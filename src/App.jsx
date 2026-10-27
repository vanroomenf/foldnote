import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES, REACTIONS, SECRETS, GENDERS, AGE_BANDS, COUNTRIES, AVATARS,
} from "./data.js";
import { analyze, isBlocked } from "./filter.js";
import { LANGUAGES, detectLanguage } from "./language.js";
import { STRINGS, deviceLanguage } from "./i18n.js";

/* ---------- helpers ---------- */

const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("foldnote_" + key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("foldnote_" + key, JSON.stringify(value)); } catch {}
  },
};

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => storage.get(key, initial));
  useEffect(() => storage.set(key, value), [key, value]);
  return [value, setValue];
}

const AD_EVERY = 5;
const TINTS = 7; // paper colors that rotate from card to card (tint-1 … tint-7)

const LangContext = createContext({ lang: "en", t: STRINGS.en });
const useLang = () => useContext(LangContext);

const catText = (key, lang) => {
  const c = CATEGORIES.find((x) => x.key === key);
  return c ? c[lang] || c.en : ["", ""];
};

const cap = (w) => w.charAt(0).toLocaleUpperCase() + w.slice(1);
const flag = (code) => String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

function languageName(code, lang) {
  try { return new Intl.DisplayNames([lang], { type: "language" }).of(code) || code; }
  catch { return code; }
}

function countryName(code, lang) {
  try { return new Intl.DisplayNames([lang], { type: "region" }).of(code) || code; }
  catch { return code; }
}

const fmt = (n, lang) => n.toLocaleString(lang === "it" ? "it-CH" : "en-GB");
const compact = (n, lang) => {
  try { return new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 }).format(n); }
  catch { return String(n); }
};

/* ---------- logo: an F folded from a strip of paper ---------- */

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
      <path className="logo-front" d="M7 6L13 5.5V27H7Z" />
      <path className="logo-back" d="M13 5.5L26 4V10L13 11.5Z" />
      <path className="logo-back" d="M13 15L22 14V19.5L13 20.5Z" />
      <path className="logo-fold" d="M13 5.5L13 11.5L15.5 8.4Z M13 15L13 20.5L15.2 17.6Z" />
      <path className="logo-edge" d="M7 6L13 5.5L26 4V10L13 11.5V15L22 14V19.5L13 20.5V27H7Z" />
    </svg>
  );
}

/* ---------- my secrets: timing (demo moderation takes a few seconds) ---------- */

const REVIEW_MS = 8000;
const DURATIONS = { "1d": 864e5, "7d": 7 * 864e5, "30d": 30 * 864e5, "1y": 365 * 864e5 };

function secretStatus(sec, now) {
  if (now < sec.createdAt + REVIEW_MS) return { status: "review" };
  const liveAt = sec.createdAt + REVIEW_MS;
  const expiresAt = liveAt + DURATIONS[sec.duration];
  return now >= expiresAt ? { status: "expired", liveAt } : { status: "live", liveAt, left: expiresAt - now };
}

function timeLeft(ms, t) {
  const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5), m = Math.max(1, Math.floor(ms / 6e4));
  return d >= 1 ? t.left.days(d) : h >= 1 ? t.left.hours(h) : t.left.minutes(m);
}

// Demo only: reactions trickle in after a secret goes live.
function demoReactions(sec, liveAt, now) {
  const seconds = Math.max(0, (now - liveAt) / 1000);
  const base = Math.min(Math.floor(seconds / 2), 400);
  const out = {};
  REACTIONS.forEach((r, i) => {
    const w = ((sec.createdAt / 1000 + i * 97) % 13) / 13;
    out[r.key] = Math.floor(base * w * w);
  });
  return out;
}

/* ---------- app ---------- */

export default function App() {
  // The interface follows the phone's language. Secrets are always shown in the
  // language they were written in; readers choose which country to read from.
  const lang = useMemo(deviceLanguage, []);
  const t = STRINGS[lang];

  const [accepted, setAccepted] = usePersistentState("accepted", false);
  const [profile, setProfile] = usePersistentState("profile", null);
  const [mySecrets, setMySecrets] = usePersistentState("mysecrets", []);
  // Languages the reader wants to read: ["all"] or a list of language codes. Starts with the phone's language.
  const [savedLangs, setReadLangs] = usePersistentState("readlangs", null);
  const readLangs = savedLangs?.length ? savedLangs : [lang];
  const [focusLangs, setFocusLangs] = useState(false);
  const [tab, setTab] = useState("read");
  const [banned, setBanned] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="app">
        <header className="topbar">
          <div className="brand"><Logo /><span>Foldnote</span></div>
          <nav aria-label="Sections">
            {["read", "write", "me"].map((k) => (
              <button key={k} aria-current={tab === k} onClick={() => setTab(k)}>{t.tabs[k]}</button>
            ))}
          </nav>
        </header>

        {tab === "read" && (
          <Reader
            readLangs={readLangs}
            onReadLangs={setReadLangs}
            onChangeLangs={() => { setFocusLangs(true); setTab("me"); }}
            onToast={setToast}
            onWrite={() => setTab("write")}
          />
        )}
        {tab === "write" && (
          <Write
            profile={profile}
            onEditProfile={() => setTab("me")}
            onSeeMine={() => setTab("me")}
            onPublish={(sec) => setMySecrets((all) => [sec, ...all])}
          />
        )}
        {tab === "me" && (
          <Me
            profile={profile}
            onSave={setProfile}
            mySecrets={mySecrets}
            onDelete={(id) => { setMySecrets((all) => all.filter((x) => x.id !== id)); setToast(t.mine.deletedToast); }}
            readLangs={readLangs}
            onReadLangs={setReadLangs}
            focusLangs={focusLangs}
            onFocused={() => setFocusLangs(false)}
            onDemoBan={() => setBanned(true)}
            onReplayWelcome={() => setAccepted(false)}
          />
        )}

        {!accepted && <Welcome onEnter={() => setAccepted(true)} />}
        {accepted && !profile && (
          <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="setup-title">
            <div className="overlay-inner">
              <div className="brand"><Logo /><span>Foldnote</span></div>
              <h1 id="setup-title">{t.setupTitle}</h1>
              <p className="lede">{t.setupLede}</p>
              <ProfileForm onSave={setProfile} submitLabel={t.createProfile} />
            </div>
          </div>
        )}
        {banned && <Banned onBack={() => setBanned(false)} />}
        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </LangContext.Provider>
  );
}

/* ---------- profile ---------- */

function profileLine(p, t, lang) {
  return [t.gender[p.gender], p.age, countryName(p.country, lang)].join(" · ");
}

function ProfileChip({ p }) {
  const { lang, t } = useLang();
  return (
    <div className="chip">
      <span className="avatar" aria-hidden="true">{p.avatar}</span>
      <span><b>{p.nickname}</b><small>{profileLine(p, t, lang)}</small></span>
    </div>
  );
}

function ProfileForm({ initial, onSave, onCancel, submitLabel }) {
  const { lang, t } = useLang();
  const [p, setP] = useState(initial || { nickname: "", avatar: AVATARS[0], gender: "", age: "", country: "" });
  const set = (k) => (v) => setP((x) => ({ ...x, [k]: v }));

  const nickOk = useMemo(() => {
    if (!/^[A-Za-z0-9._]{3,20}$/.test(p.nickname)) return false;
    const r = analyze(p.nickname.replace(/[._]/g, " "));
    return !(r.contact || r.insult || r.threat);
  }, [p.nickname]);
  const ready = nickOk && p.gender && p.age && p.country;

  return (
    <section className="card">
      <label htmlFor="nick" className="field-label">{t.nickname}</label>
      <input id="nick" className="input" value={p.nickname} maxLength={20} autoComplete="off"
        onChange={(e) => set("nickname")(e.target.value.trim())} placeholder="nightowl_92" />
      <p className={"intro-line" + (p.nickname && !nickOk ? " error" : "")}>{p.nickname && !nickOk ? t.nicknameBad : t.nicknameHint}</p>

      <h3>{t.avatar}</h3>
      <div className="avatars" role="group" aria-label={t.avatar}>
        {AVATARS.map((a) => (
          <button key={a} aria-pressed={p.avatar === a} onClick={() => set("avatar")(a)}>{a}</button>
        ))}
      </div>

      <h3>{t.iAm}</h3>
      <div className="segmented" role="group" aria-label={t.iAm}>
        {GENDERS.map((g) => (
          <button key={g} aria-pressed={p.gender === g} onClick={() => set("gender")(g)}>{t.genderChoice[g]}</button>
        ))}
      </div>

      <h3>{t.ageBand}</h3>
      <div className="segmented" role="group" aria-label={t.ageBand}>
        {AGE_BANDS.map((a) => (
          <button key={a} aria-pressed={p.age === a} onClick={() => set("age")(a)}>{a}</button>
        ))}
      </div>

      <label htmlFor="country" className="field-label">{t.country}</label>
      <select id="country" className="input" value={p.country} onChange={(e) => set("country")(e.target.value)}>
        <option value="" disabled>—</option>
        {COUNTRIES.map((c) => <option key={c} value={c}>{countryName(c, lang)}</option>)}
      </select>

      <p className="note-small">{t.phoneNote}</p>

      <div className="row-actions">
        {onCancel && <button className="ghost" onClick={onCancel}>{t.cancel}</button>}
        <button className="primary" disabled={!ready} onClick={() => onSave(p)}>{submitLabel}</button>
      </div>
    </section>
  );
}

/* ---------- read: one secret per screen, swipe up for the next ---------- */

function Reader({ readLangs, onReadLangs, onChangeLangs, onToast, onWrite }) {
  const { lang, t } = useLang();
  const [category, setCategory] = useState("all");
  const all = readLangs.includes("all");
  const [mine, setMine] = usePersistentState("reactions", {});
  const [reports, setReports] = usePersistentState("reports", {}); // secret id -> { reason, details, at }
  const [reporting, setReporting] = useState(null);
  const deck = useRef(null);

  const list = useMemo(
    () => SECRETS.filter((s) => (category === "all" || s.cat === category) && (all || readLangs.includes(s.orig))),
    [category, readLangs, all]
  );
  useEffect(() => { deck.current?.scrollTo({ top: 0 }); }, [readLangs]);

  const slides = useMemo(() => {
    const out = [];
    list.forEach((s, i) => {
      out.push({ type: "secret", secret: s, n: i });
      if ((i + 1) % AD_EVERY === 0 && i < list.length - 1) out.push({ type: "ad", id: "ad" + i });
    });
    out.push({ type: "end" });
    return out;
  }, [list]);

  const pick = (key) => {
    setCategory(key);
    deck.current?.scrollTo({ top: 0 });
  };
  const next = () => {
    const el = deck.current;
    if (el) el.scrollBy({ top: el.clientHeight, behavior: "smooth" });
  };
  const toggle = (id, key) =>
    setMine((m) => {
      const forSecret = { ...(m[id] || {}) };
      if (forSecret[key]) delete forSecret[key]; else forSecret[key] = true;
      return { ...m, [id]: forSecret };
    });

  const current = CATEGORIES.find((c) => c.key === category);

  return (
    <main className="reader">
      <button className="place" onClick={onChangeLangs} aria-label={t.where.title}>
        <span className="place-label">{t.where.label}</span>
        <span className="place-names">{all ? "🌍 " + t.where.all : readLangs.map((l) => cap(languageName(l, lang))).join(", ")}</span>
        <span className="place-edit">{t.where.change}</span>
      </button>
      <div className="cats" role="group" aria-label={t.categories}>
        {[{ key: "all" }, ...CATEGORIES].map((c) => (
          <button key={c.key} aria-pressed={category === c.key} onClick={() => pick(c.key)}>
            {c.key === "all" ? t.all : catText(c.key, lang)[0]}
          </button>
        ))}
      </div>
      {current && <p className="catinfo">{catText(current.key, lang)[1]} · {t.secretsCount(list.length)}</p>}

      <div className="deck" ref={deck} tabIndex={0} aria-label={t.swipeHint}>
        {slides.map((slide, i) => (
          <section className="slide" key={slide.secret?.id ?? slide.id ?? "end"}>
            {slide.type === "secret" && reports[slide.secret.id] && (
              <ReportedCard
                reason={reports[slide.secret.id].reason}
                onUndo={() => setReports((r) => { const c = { ...r }; delete c[slide.secret.id]; return c; })}
                onNext={next}
              />
            )}
            {slide.type === "secret" && !reports[slide.secret.id] && (
              <SecretCard
                secret={slide.secret}
                tint={(slide.n % TINTS) + 1}
                selected={mine[slide.secret.id] || {}}
                onReact={(k) => toggle(slide.secret.id, k)}
                onCategory={pick}
                onReport={() => setReporting(slide.secret)}
                onNext={next}
                first={i === 0}
              />
            )}
            {slide.type === "ad" && <AdSlide onNext={next} />}
            {slide.type === "end" && (
              <div className="endcard">
                <h2>{list.length ? t.endTitle : t.where.emptyTitle}</h2>
                <p>{list.length ? t.endText : t.where.emptyText}</p>
                {!all && (
                  <button className="ghost" onClick={() => onReadLangs(["all"])}>🌍 {t.where.seeAll}</button>
                )}
                <div className="end-actions">
                  <button className="primary" onClick={onWrite}>{t.writeOne}</button>
                  {list.length > 0 && (
                    <button className="ghost" onClick={() => deck.current?.scrollTo({ top: 0, behavior: "smooth" })}>{t.backToTop}</button>
                  )}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {reporting && (
        <ReportSheet
          secret={reporting}
          onClose={() => setReporting(null)}
          onSubmit={(report) => {
            setReports((r) => ({ ...r, [reporting.id]: { ...report, at: Date.now() } }));
            setReporting(null);
            onToast(t.rep.sentToast);
          }}
        />
      )}
    </main>
  );
}

function SecretCard({ secret, selected, onReact, onCategory, onReport, onNext, first, tint }) {
  const { lang, t } = useLang();
  const body = secret[secret.orig] || secret.en;
  const count = (k) => secret.r[k] + (selected[k] ? 1 : 0);
  const [label, setLabel] = useState(null);

  // Every reaction is visible as a compact emoji chip. Order is fixed per secret
  // (most used first, from the starting counts) so chips don't jump while you tap.
  const ranked = useMemo(
    () => [...REACTIONS].sort((a, b) => (secret.r[b.key] ?? 0) - (secret.r[a.key] ?? 0)),
    [secret]
  );
  useEffect(() => {
    if (!label) return;
    const id = setTimeout(() => setLabel(null), 1400);
    return () => clearTimeout(id);
  }, [label]);

  return (
    <article className={"note tint-" + tint}>
      <div className="meta">
        <button className="cattag" onClick={() => onCategory(secret.cat)}>{catText(secret.cat, lang)[0]}</button>
        <span className={"gender g-" + secret.gender}>{t.gender[secret.gender]}</span>
        <span>{secret.age}{t.ageSuffix}</span>
        <span>{countryName(secret.country, lang)}</span>
      </div>

      <p className="text" lang={secret.orig}>{body}</p>

      <div className="note-bottom">
        <div className="reacts-wrap">
          {label && <div className="react-label" role="status">{label}</div>}
          <div className="reacts" role="group" aria-label={t.allReactions}>
            {ranked.map((r) => (
              <button
                key={r.key}
                className="react"
                aria-pressed={!!selected[r.key]}
                aria-label={`${t.reactions[r.key]}: ${fmt(count(r.key), lang)}`}
                title={t.reactions[r.key]}
                onClick={() => { onReact(r.key); setLabel(`${r.emoji} ${t.reactions[r.key]}`); }}
              >
                <span className="e" aria-hidden="true">{r.emoji}</span>
                <span className="n" aria-hidden="true">{compact(count(r.key), lang)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="foot">
          <button className={"nexthint" + (first ? " pulse" : "")} onClick={onNext}>
            <span aria-hidden="true" className="chev">⌃</span>{first ? t.swipeHint : t.next}
          </button>
          <button className="link" onClick={onReport}>{t.report}</button>
        </div>
      </div>
    </article>
  );
}

/* ---------- report ---------- */

const REPORT_REASONS = ["identifies", "contact", "hate", "sexual", "risk", "minor", "illegal", "spam", "other"];

function ReportSheet({ secret, onClose, onSubmit }) {
  const { lang, t } = useLang();
  const [step, setStep] = useState("reason");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const r = useMemo(() => analyze(details), [details]);
  const detailsBad = details.trim() && (r.contact || r.insult || r.threat);

  return (
    <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-head">
          <h2 id="report-title">{step === "reason" ? t.rep.title : t.rep.detailsTitle}</h2>
          <button className="link" onClick={onClose}>{t.cancel}</button>
        </div>
        <blockquote className="quote" lang={secret.orig}>{secret[secret.orig] || secret.en}</blockquote>

        {step === "reason" && (
          <>
            <p className="intro-line">{t.rep.intro}</p>
            <div className="reasons" role="radiogroup" aria-label={t.rep.title}>
              {REPORT_REASONS.map((k) => (
                <label key={k} className={"reason" + (reason === k ? " on" : "")} htmlFor={"reason-" + k}>
                  <input id={"reason-" + k} type="radio" name="reason" checked={reason === k} onChange={() => setReason(k)} />
                  <span><b>{t.rep.reasons[k][0]}</b><small>{t.rep.reasons[k][1]}</small></span>
                </label>
              ))}
            </div>
            <button className="primary" disabled={!reason} onClick={() => setStep("details")}>{t.rep.next}</button>
          </>
        )}

        {step === "details" && (
          <>
            <p className="intro-line"><b className="ink">{t.rep.reasons[reason][0]}</b> · <button className="link inline" onClick={() => setStep("reason")}>{t.rep.change}</button></p>
            {reason === "risk" && <HelpBox forOthers />}
            {reason === "identifies" && <p className="note-small">{t.rep.identifiesNote}</p>}
            <label htmlFor="report-details" className="field-label">{t.rep.detailsLabel}</label>
            <textarea id="report-details" className="short" maxLength={300} value={details}
              placeholder={t.rep.detailsPlaceholder} onChange={(e) => setDetails(e.target.value)} />
            {detailsBad && <p className="intro-line error">{t.rep.detailsBad}</p>}
            <p className="note-small">{t.rep.whatHappens}</p>
            <button className="primary" disabled={!!detailsBad} onClick={() => onSubmit({ reason, details: details.trim() })}>{t.rep.submit}</button>
          </>
        )}
      </div>
    </div>
  );
}

function ReportedCard({ reason, onUndo, onNext }) {
  const { t } = useLang();
  return (
    <div className="reported">
      <span className="reported-icon" aria-hidden="true">⚑</span>
      <h2>{t.rep.doneTitle}</h2>
      <p>{t.rep.doneText}</p>
      <p className="muted">{t.rep.reasonWas} <b>{t.rep.reasons[reason]?.[0]}</b></p>
      <div className="end-actions">
        <button className="primary" onClick={onNext}>{t.next}</button>
        <button className="link" onClick={onUndo}>{t.rep.undo}</button>
      </div>
    </div>
  );
}

function AdSlide({ onNext }) {
  const { t } = useLang();
  return (
    <div className="ad">
      <strong>{t.adLabel}</strong>
      <p>{t.adText}</p>
      <button className="nexthint" onClick={onNext}><span aria-hidden="true" className="chev">⌃</span>{t.next}</button>
    </div>
  );
}

/* ---------- write ---------- */

function Write({ profile, onEditProfile, onSeeMine, onPublish }) {
  const { lang, t } = useLang();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("30d");
  const [pickedLang, setPickedLang] = useState(null); // author's correction, if any
  const detected = useMemo(() => detectLanguage(text, lang), [text, lang]);
  const writtenIn = pickedLang || detected.lang;
  const [justSent, setJustSent] = useState(false);

  const r = useMemo(() => analyze(text), [text]);
  const empty = !text.trim();
  const blocked = isBlocked(r);
  const canSend = !empty && text.trim().length >= 15 && !blocked && !!category && !!profile && !!writtenIn;
  const state = (bad) => (empty ? "idle" : bad ? "bad" : "");
  const list = (arr) => <em>{arr.join(", ")}</em>;
  const parts = (p) => <>{p[0]}{p[1]}{p[2]}</>;

  const send = () => {
    onPublish({
      id: "m" + Date.now(), text: text.trim(), cat: category, duration, createdAt: Date.now(), orig: writtenIn,
      gender: profile.gender, age: profile.age, country: profile.country,
    });
    setText("");
    setPickedLang(null);
    setJustSent(true);
  };

  return (
    <main className="scroll">
      <section className="card">
        <h2>{t.writeTitle}</h2>
        <p className="intro-line">{t.writeIntro}</p>

        <label htmlFor="secret" className="field-label">{t.yourSecret}</label>
        <textarea
          id="secret"
          maxLength={280}
          value={text}
          placeholder={t.placeholder}
          onChange={(e) => { setText(e.target.value); setJustSent(false); }}
        />
        <div className="count">{text.length} / 280</div>

        {!empty && (
          <div className="langline">
            <p className="intro-line">
              {writtenIn
                ? <>{t.wlang.writtenIn} <b className="ink">{cap(languageName(writtenIn, lang))}</b>{!pickedLang && <> · {t.wlang.auto}</>}</>
                : t.wlang.unknown}
            </p>
            <div className="pick small" role="group" aria-label={t.wlang.label}>
              {[...new Set([...(pickedLang && !detected.candidates.includes(pickedLang) ? [pickedLang] : []), ...detected.candidates])].slice(0, 3).map((l) => (
                <button key={l} aria-pressed={writtenIn === l} onClick={() => setPickedLang(l)}>{cap(languageName(l, lang))}</button>
              ))}
              <label className="other-lang" htmlFor="other-lang">
                <span>{t.wlang.other}</span>
                <select id="other-lang" value="" onChange={(e) => e.target.value && setPickedLang(e.target.value)}>
                  <option value="">…</option>
                  {LANGUAGES.map((l) => ({ l, n: cap(languageName(l, lang)) }))
                    .sort((a, b) => a.n.localeCompare(b.n, lang))
                    .map(({ l, n }) => <option key={l} value={l}>{n}</option>)}
                </select>
              </label>
            </div>
          </div>
        )}

        {profile && (
          <p className="intro-line">
            {t.postingAs} <b className="ink">{profileLine(profile, t, lang)}</b>.{" "}
            <button className="link inline" onClick={onEditProfile}>{t.editInMe}</button>
          </p>
        )}

        <h3>{t.category}</h3>
        <div className="pick" role="group" aria-label={t.category}>
          {CATEGORIES.map((c) => (
            <button key={c.key} title={catText(c.key, lang)[1]} aria-pressed={category === c.key} onClick={() => setCategory(c.key)}>
              {catText(c.key, lang)[0]}
            </button>
          ))}
        </div>
        <p className="intro-line">{category ? catText(category, lang)[1] : t.chooseWhere}</p>

        <h3>{t.dur.title}</h3>
        <div className="segmented" role="group" aria-label={t.dur.title}>
          {Object.keys(DURATIONS).map((k) => (
            <button key={k} aria-pressed={duration === k} onClick={() => setDuration(k)}>{t.dur.options[k]}</button>
          ))}
        </div>
        <p className="intro-line">{t.dur.hint}</p>

        <h3>{t.autoCheck}</h3>
        <ul className="checks">
          <Check state={state(r.names.length)}>{r.names.length ? parts(t.chk.nameBad(list(r.names))) : t.chk.nameOk}</Check>
          <Check state={state(r.disguised.length)}>{r.disguised.length ? parts(t.chk.disguisedBad(list(r.disguised))) : t.chk.disguisedOk}</Check>
          <Check state={state(r.properNouns.length)}>{r.properNouns.length ? parts(t.chk.properBad(list(r.properNouns))) : t.chk.properOk}</Check>
          <Check state={state(r.contact)}>{r.contact ? t.chk.contactBad : t.chk.contactOk}</Check>
          <Check state={state(r.insult || r.threat)}>{r.threat ? t.chk.threat : r.insult ? t.chk.insult : t.chk.insultOk}</Check>
        </ul>

        {r.selfHarm && <HelpBox />}

        <button className="primary" disabled={!canSend} onClick={send}>
          {!category ? t.missing.cat : !writtenIn && !empty ? t.wlang.missing : t.send}
        </button>

        {justSent && (
          <div className="sent">
            <p><strong>{t.received}</strong> {t.receivedText}</p>
            <button className="link inline" onClick={onSeeMine}>{t.mine.seeMine}</button>
          </div>
        )}
      </section>
    </main>
  );
}

function Check({ state, children }) {
  const mark = state === "bad" ? "!" : state === "idle" ? "·" : "✓";
  return (
    <li className={"check " + state}>
      <span className="dot" aria-hidden="true">{mark}</span>
      <span>{children}</span>
    </li>
  );
}

function HelpBox({ forOthers }) {
  const { t } = useLang();
  return (
    <div className="help" role="alert">
      {forOthers
        ? <p><strong>{t.rep.riskTitle}</strong> {t.rep.riskBody}</p>
        : <p><strong>{t.help.title}</strong> {t.help.body}</p>}
      {t.help.lines.map(([who, num]) => <p key={num}>{who} <span className="num">{num}</span></p>)}
      {!forOthers && <p>{t.help.emergency}</p>}
    </div>
  );
}

/* ---------- me: profile, privacy, rules, language ---------- */

function LanguagePicker({ value, onChange, focus, onFocused }) {
  const { lang, t } = useLang();
  const ref = useRef(null);
  const all = value.includes("all");

  useEffect(() => {
    if (!focus) return;
    ref.current?.scrollIntoView?.({ block: "start", behavior: "smooth" });
    onFocused();
  }, [focus, onFocused]);

  // Phone language first, then the others alphabetically.
  const langs = useMemo(
    () => [lang, ...LANGUAGES.filter((l) => l !== lang).sort((a, b) => languageName(a, lang).localeCompare(languageName(b, lang), lang))],
    [lang]
  );

  const chosen = all ? [] : value;
  const toggle = (l) => {
    const next = chosen.includes(l) ? chosen.filter((x) => x !== l) : [...chosen, l];
    onChange(next.length ? next : ["all"]);
  };

  return (
    <section className="card" id="read-langs" ref={ref}>
      <h2>{t.where.title}</h2>
      <p className="intro-line">{t.where.lede}</p>

      <label className={"agree world" + (all ? " on" : "")} htmlFor="lang-all">
        <input id="lang-all" type="checkbox" checked={all} onChange={() => onChange(all ? [lang] : ["all"])} />
        <span>🌍 <b>{t.where.all}</b></span>
      </label>

      <div className="countries">
        {langs.map((l) => (
          <label key={l} className={"country" + (chosen.includes(l) ? " on" : "")} htmlFor={"rl-" + l}>
            <input id={"rl-" + l} type="checkbox" checked={chosen.includes(l)} onChange={() => toggle(l)} />
            <span className="cname">{cap(languageName(l, lang))}</span>
          </label>
        ))}
      </div>
      <p className="note-small">{t.where.note}</p>
    </section>
  );
}

function MySecrets({ items, onDelete }) {
  const { lang, t } = useLang();
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="card">
      <h2>{t.mine.title}</h2>
      {items.length === 0 && <p className="intro-line">{t.mine.empty}</p>}
      <div className="mylist">
        {items.map((sec) => {
          const st = secretStatus(sec, now);
          const reacts = st.liveAt ? demoReactions(sec, st.liveAt, now) : {};
          const total = Object.values(reacts).reduce((a, b) => a + b, 0);
          const top = REACTIONS.filter((r) => reacts[r.key] > 0).sort((a, b) => reacts[b.key] - reacts[a.key]).slice(0, 4);
          return (
            <article key={sec.id} className={"mysecret " + st.status}>
              <div className="mysecret-head">
                <span className="cattag static">{catText(sec.cat, lang)[0]}</span>
                <span className={"pill " + st.status}>
                  {st.status === "review" ? t.mine.review : st.status === "live" ? t.mine.live : t.mine.expired}
                </span>
              </div>
              <p className="mysecret-text">{sec.text}</p>
              <div className="mysecret-meta">
                <span>
                  {st.status === "review" && t.mine.reviewText}
                  {st.status === "live" && <>⏳ {t.mine.expiresIn} {timeLeft(st.left, t)}</>}
                  {st.status === "expired" && t.mine.expiredText}
                </span>
                {st.liveAt && (
                  <span className="received" aria-label={t.mine.reactionsLabel(total)}>
                    {top.map((r) => <span key={r.key}>{r.emoji} {compact(reacts[r.key], lang)}</span>)}
                    {total === 0 && <span className="muted">{t.mine.noReactions}</span>}
                  </span>
                )}
              </div>
              {confirm === sec.id ? (
                <div className="confirm">
                  <p>{t.mine.confirm}</p>
                  <div className="row-actions wrap">
                    <button className="ghost" onClick={() => setConfirm(null)}>{t.cancel}</button>
                    <button className="primary danger" onClick={() => { setConfirm(null); onDelete(sec.id); }}>{t.mine.deleteNow}</button>
                  </div>
                </div>
              ) : (
                <button className="link left" onClick={() => setConfirm(sec.id)}>{t.mine.delete}</button>
              )}
            </article>
          );
        })}
      </div>
      {items.length > 0 && <p className="note-small">{t.mine.demoNote}</p>}
    </section>
  );
}

function Me({ profile, onSave, mySecrets, onDelete, readLangs, onReadLangs, focusLangs, onFocused, onDemoBan, onReplayWelcome }) {
  const { lang, t } = useLang();
  const [editing, setEditing] = useState(false);

  return (
    <main className="scroll">
      <h2>{t.meTitle}</h2>
      {profile && !editing && (
        <section className="card">
          <ProfileChip p={profile} />
          <button className="ghost" onClick={() => setEditing(true)}>{t.editProfile}</button>
        </section>
      )}
      {editing && (
        <ProfileForm initial={profile} submitLabel={t.saveProfile}
          onCancel={() => setEditing(false)} onSave={(p) => { onSave(p); setEditing(false); }} />
      )}

      <LanguagePicker value={readLangs} onChange={onReadLangs} focus={focusLangs} onFocused={onFocused} />

      <MySecrets items={mySecrets} onDelete={onDelete} />

      <section className="card">
        <h3>{t.privacyTitle}</h3>
        <dl className="privacy">
          {t.privacy.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
        </dl>
      </section>

      <section className="card">
        <h2>{t.rulesTitle}</h2>
        <ol className="rules">
          {t.rules.map(([b, s]) => <li key={b}><div><b>{b}</b><span>{s}</span></div></li>)}
        </ol>
      </section>
      <section className="card">
        <h2>{t.breakTitle}</h2>
        <div className="ladder">
          {t.ladder.map(([tag, text, tone]) => (
            <div className="step" key={tag}><span className={"tag " + tone}>{tag}</span><p>{text}</p></div>
          ))}
        </div>
        <button className="ghost" onClick={onDemoBan}>{t.seeBan}</button>
        <button className="link left" onClick={onReplayWelcome}>{t.replayWelcome}</button>
      </section>
    </main>
  );
}

/* ---------- overlays ---------- */

function Welcome({ onEnter }) {
  const { t } = useLang();
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="overlay-inner">
        <div className="brand"><Logo /><span>Foldnote</span></div>
        <h1 id="welcome-title">{t.welcomeTitle}</h1>
        <p className="lede">{t.welcomeLede}</p>
        <section className="card">
          <h3>{t.beforeIn}</h3>
          <ol className="rules">
            {t.welcomeRules.map(([b, s]) => <li key={b}><div><b>{b}</b><span>{s}</span></div></li>)}
          </ol>
        </section>
        <label className="agree" htmlFor="adult">
          <input id="adult" type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
          <span>{t.adult}</span>
        </label>
        <label className="agree" htmlFor="terms">
          <input id="terms" type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>{t.accept}</span>
        </label>
        <button className="primary" disabled={!(adult && terms)} onClick={onEnter}>{t.enter}</button>
      </div>
    </div>
  );
}

function Banned({ onBack }) {
  const { t } = useLang();
  return (
    <div className="overlay ban" role="dialog" aria-modal="true" aria-labelledby="ban-title">
      <div className="overlay-inner">
        <div className="brand"><Logo /><span>Foldnote</span></div>
        <h1 id="ban-title">{t.banTitle}</h1>
        <p className="lede">{t.banLede}</p>
        <section className="card">
          <h3>{t.banWhat}</h3>
          <p className="plain">{t.banText}</p>
          <p className="plain muted">{t.banAppeal}</p>
        </section>
        <button className="ghost" onClick={onBack}>{t.banBack}</button>
      </div>
    </div>
  );
}
