import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, REACTIONS, SECRETS } from "./data.js";
import { analyze, isBlocked } from "./filter.js";
import { STRINGS, SUPPORTED, LANGUAGE_NAMES, deviceLanguage } from "./i18n.js";

/* ---------- helpers ---------- */

const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("hush_" + key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("hush_" + key, JSON.stringify(value)); } catch {}
  },
};

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => storage.get(key, initial));
  useEffect(() => storage.set(key, value), [key, value]);
  return [value, setValue];
}

const AD_EVERY = 5;

const LangContext = createContext({ lang: "en", t: STRINGS.en });
const useLang = () => useContext(LangContext);

const catText = (key, lang) => {
  const c = CATEGORIES.find((x) => x.key === key);
  return c ? c[lang] || c.en : ["", ""];
};

function countryName(code, lang) {
  try { return new Intl.DisplayNames([lang], { type: "region" }).of(code) || code; }
  catch { return code; }
}

const fmt = (n, lang) => n.toLocaleString(lang === "it" ? "it-CH" : "en-GB");

/* ---------- app ---------- */

export default function App() {
  const [langSetting, setLangSetting] = usePersistentState("lang", "auto");
  const device = useMemo(deviceLanguage, []);
  const lang = langSetting === "auto" ? device : langSetting;
  const t = STRINGS[lang];

  const [accepted, setAccepted] = usePersistentState("accepted", false);
  const [tab, setTab] = useState("read");
  const [banned, setBanned] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <LangContext.Provider value={{ lang, t }}>
      <div className="app">
        <header className="topbar">
          <div className="brand">Hush<small>{t.tagline}</small></div>
          <nav aria-label="Sections">
            {["read", "write", "rules"].map((k) => (
              <button key={k} aria-current={tab === k} onClick={() => setTab(k)}>{t.tabs[k]}</button>
            ))}
          </nav>
        </header>

        {tab === "read" && <Reader onReport={() => setToast(t.reported)} onWrite={() => setTab("write")} />}
        {tab === "write" && <Write />}
        {tab === "rules" && (
          <Rules
            langSetting={langSetting}
            device={device}
            onLang={setLangSetting}
            onDemoBan={() => setBanned(true)}
            onReplayWelcome={() => setAccepted(false)}
          />
        )}

        {!accepted && <Welcome onEnter={() => setAccepted(true)} />}
        {banned && <Banned onBack={() => setBanned(false)} />}
        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    </LangContext.Provider>
  );
}

/* ---------- read: one secret per screen, swipe up for the next ---------- */

function Reader({ onReport, onWrite }) {
  const { lang, t } = useLang();
  const [category, setCategory] = useState("all");
  const [mine, setMine] = usePersistentState("reactions", {});
  const deck = useRef(null);

  const list = useMemo(
    () => (category === "all" ? SECRETS : SECRETS.filter((s) => s.cat === category)),
    [category]
  );

  // Interleave an ad after every AD_EVERY secrets, then a closing slide.
  const slides = useMemo(() => {
    const out = [];
    list.forEach((s, i) => {
      out.push({ type: "secret", secret: s });
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
      <div className="cats" role="group" aria-label={t.categories}>
        {[{ key: "all" }, ...CATEGORIES].map((c) => (
          <button key={c.key} aria-pressed={category === c.key} onClick={() => pick(c.key)}>
            {c.key === "all" ? t.all : catText(c.key, lang)[0]}
          </button>
        ))}
      </div>
      {current && (
        <p className="catinfo">{catText(current.key, lang)[1]} · {t.secretsCount(list.length)}</p>
      )}

      <div className="deck" ref={deck} tabIndex={0} aria-label={t.swipeHint}>
        {slides.map((slide, i) => (
          <section className="slide" key={slide.secret?.id ?? slide.id ?? "end"}>
            {slide.type === "secret" && (
              <SecretCard
                secret={slide.secret}
                selected={mine[slide.secret.id] || {}}
                onReact={(k) => toggle(slide.secret.id, k)}
                onCategory={pick}
                onReport={onReport}
                onNext={next}
                first={i === 0}
              />
            )}
            {slide.type === "ad" && <AdSlide onNext={next} />}
            {slide.type === "end" && (
              <div className="endcard">
                <h2>{t.endTitle}</h2>
                <p>{t.endText}</p>
                <div className="end-actions">
                  <button className="primary" onClick={onWrite}>{t.writeOne}</button>
                  <button className="ghost" onClick={() => deck.current?.scrollTo({ top: 0, behavior: "smooth" })}>{t.backToTop}</button>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

function SecretCard({ secret, selected, onReact, onCategory, onReport, onNext, first }) {
  const { lang, t } = useLang();
  const reacted = Object.keys(selected).length > 0;
  const count = (k) => secret.r[k] + (selected[k] ? 1 : 0);
  const pct = Math.round((count("metoo") / (secret.views + (reacted ? 1 : 0))) * 100);
  const [num, rest] = t.metooLine(pct);

  return (
    <article className="note">
      <div className="meta">
        <button className="cattag" onClick={() => onCategory(secret.cat)}>{catText(secret.cat, lang)[0]}</button>
        <span className={"gender g-" + secret.gender}>{t.gender[secret.gender]}</span>
        <span>{secret.age}{t.ageSuffix}</span>
        <span>{countryName(secret.country, lang)}</span>
      </div>

      <p className="text">{secret[lang] || secret.en}</p>

      <div className="note-bottom">
        <div className="metoo-block">
          <div className="metoo"><b>{num}</b>{rest}</div>
          <div className="bar"><i style={{ width: Math.min(pct, 100) + "%" }} /></div>
        </div>
        <div className="reacts">
          {REACTIONS.map((r) => (
            <button key={r.key} className="react" aria-pressed={!!selected[r.key]} onClick={() => onReact(r.key)}>
              <span className="e" aria-hidden="true">{r.emoji}</span>
              {t.reactions[r.key]}
              <span className="n">{fmt(count(r.key), lang)}</span>
            </button>
          ))}
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

function Write() {
  const { lang, t } = useLang();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = usePersistentState("gender", "");
  const [justSent, setJustSent] = useState(false);
  const [sent, setSent] = usePersistentState("sent", []);

  const r = useMemo(() => analyze(text), [text]);
  const empty = !text.trim();
  const blocked = isBlocked(r);
  const canSend = !empty && text.trim().length >= 15 && !blocked && !!category && !!gender;
  const state = (bad) => (empty ? "idle" : bad ? "bad" : "");
  const list = (arr) => <em>{arr.join(", ")}</em>;
  const parts = (p) => <>{p[0]}{p[1]}{p[2]}</>;

  const send = () => {
    setSent((s) => [{ text: text.trim(), cat: category, gender }, ...s]);
    setText("");
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

        <h3>{t.iAm}</h3>
        <div className="segmented" role="group" aria-label={t.iAm}>
          {["m", "f", "x"].map((g) => (
            <button key={g} aria-pressed={gender === g} onClick={() => setGender(g)}>{t.gender[g]}</button>
          ))}
        </div>

        <h3>{t.category}</h3>
        <div className="pick" role="group" aria-label={t.category}>
          {CATEGORIES.map((c) => (
            <button key={c.key} title={catText(c.key, lang)[1]} aria-pressed={category === c.key} onClick={() => setCategory(c.key)}>
              {catText(c.key, lang)[0]}
            </button>
          ))}
        </div>
        <p className="intro-line">{category ? catText(category, lang)[1] : t.chooseWhere}</p>

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
          {!gender ? t.missing.gender : !category ? t.missing.cat : t.send}
        </button>

        {justSent && (
          <div className="sent"><p><strong>{t.received}</strong> {t.receivedText}</p></div>
        )}
      </section>

      {sent.length > 0 && (
        <section className="card">
          <h3>{t.yourSecrets}</h3>
          <div className="mine">
            {sent.map((s, i) => (
              <div className="mine-item" key={i}>
                <p>
                  {s.cat && <span className="mine-cat">{catText(s.cat, lang)[0]}{s.gender ? " · " + t.gender[s.gender] : ""}</span>}
                  {s.text}
                </p>
                <span className="pill">{t.inReview}</span>
              </div>
            ))}
          </div>
        </section>
      )}
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

function HelpBox() {
  const { t } = useLang();
  return (
    <div className="help" role="alert">
      <p><strong>{t.help.title}</strong> {t.help.body}</p>
      {t.help.lines.map(([who, num]) => <p key={num}>{who} <span className="num">{num}</span></p>)}
      <p>{t.help.emergency}</p>
    </div>
  );
}

/* ---------- rules ---------- */

function Rules({ langSetting, device, onLang, onDemoBan, onReplayWelcome }) {
  const { t } = useLang();
  return (
    <main className="scroll">
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
      <section className="card">
        <h3>{t.languageTitle}</h3>
        <div className="langs" role="radiogroup" aria-label={t.languageTitle}>
          {["auto", ...SUPPORTED].map((k) => (
            <label key={k} className="agree" htmlFor={"lang-" + k}>
              <input id={"lang-" + k} type="radio" name="lang" checked={langSetting === k} onChange={() => onLang(k)} />
              <span>{k === "auto" ? t.languageAuto(LANGUAGE_NAMES[device]) : LANGUAGE_NAMES[k]}</span>
            </label>
          ))}
        </div>
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
        <div className="brand">Hush</div>
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
        <div className="brand">Hush</div>
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
