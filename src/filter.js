// Client-side safety filter for the Hush prototype.
// First line of defence only: in production run the same checks on the server,
// add an AI context check, and keep human review before anything is published.
// Checks run in every supported language, whatever language the interface is in.

const NAME_LIST = (
  // English
  "james john robert michael william david richard joseph thomas charles christopher daniel matthew anthony " +
  "steven paul andrew joshua kevin brian george timothy ryan jason jacob gary nicholas eric jonathan justin " +
  "brandon tyler aaron adam nathan zachary kyle noah ethan liam oliver lucas mason logan jack harry charlie oscar " +
  "mary patricia jennifer linda elizabeth barbara susan jessica sarah karen lisa nancy betty sandra ashley " +
  "emily michelle amanda melissa stephanie rebecca laura sharon cynthia amy angela emma olivia ava sophia " +
  "isabella chloe lily hannah madison abigail megan rachel lauren samantha natalie zoe " +
  // Italian
  "marco luca matteo andrea giulia sara chiara francesca alessandro lorenzo davide simone federico paolo " +
  "giuseppe giovanni antonio mario francesco roberto stefano fabio daniele michele riccardo nicola alessia " +
  "martina elena valentina silvia paola federica giorgia sofia beatrice ginevra noemi leonardo tommaso " +
  "gabriele edoardo pietro filippo " +
  // German, French, Spanish
  "jonas lukas elias leon lena julia nina sophie hans claudia sabine monika ursula petra pierre camille " +
  "manon nicolas carlos miguel javier lucia carmen"
).split(" ");

const strip = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const NAMES = new Set(NAME_LIST.map(strip));

// Capitalised words that are normal mid-sentence and are not a person.
const ALWAYS_CAPITALISED = new Set(
  (
    "I Im Ive Id Ill Mom Mum Dad Grandma Grandpa God Christmas Easter Halloween Thanksgiving Natale Pasqua " +
    "Capodanno Ferragosto Dio Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March " +
    "April May June July August September October November December Lunedì Martedì Mercoledì Giovedì Venerdì " +
    "Sabato Domenica Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre " +
    "Dicembre English Italian German French Spanish Japanese Switzerland Svizzera Italy Italia Germany " +
    "Germania France Francia Spain Spagna Austria Europe Europa America USA UK London Londra Paris Parigi " +
    "Rome Roma Milan Milano Zurich Zurigo Geneva Ginevra Lugano Berlin Berlino Instagram WhatsApp Netflix " +
    "Google Spotify TikTok Facebook YouTube iPhone OK"
  ).split(" ")
);

// Look-alike characters people use to sneak a word past a filter.
const LOOKALIKES = {
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x", "і": "i", "ј": "j", "к": "k",
  "м": "m", "н": "h", "т": "t", "в": "b", "ο": "o", "α": "a", "ε": "e", "ι": "i", "κ": "k", "ν": "v",
  "ρ": "p", "τ": "t", "υ": "u",
};
// Numbers and symbols used as letters. "1", "!" and "|" can stand for "l" or "i", so both are tried.
const LEET = { "0": "o", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "9": "g", "@": "a", "$": "s", "€": "e", "+": "t" };
const AMBIGUOUS = /[1!|]/g;
const SEPARATORS = /[._\-*~·'’,/\\]/g;

// Words that legitimately mix numbers and letters.
const MIXED_OK = /^(\d+(st|nd|rd|th|s|h|am|pm|k|m|km|kg|g|cm|mm|min|yo|x|enne|anni|°|%)|mp3|mp4|covid19|4g|5g|3d|ps4|ps5|b2b|2fa|f1|h24)$/i;

function variants(token) {
  let base = strip(token.toLowerCase());
  base = [...base].map((ch) => LOOKALIKES[ch] ?? ch).join("");
  base = base.replace(/[0345789@$€+]/g, (ch) => LEET[ch]);
  const out = new Set();
  for (const rep of ["l", "i"]) {
    const v = base.replace(AMBIGUOUS, rep).replace(SEPARATORS, "");
    out.add(v);
    out.add(v.replace(/(.)\1{2,}/g, "$1$1")); // luuuuca -> luuca
    out.add(v.replace(/(.)\1+/g, "$1"));      // luuca  -> luca
  }
  return out;
}

const matchesName = (token) => [...variants(token)].some((v) => NAMES.has(v) || NAMES.has(v.replace(/s$/, "")));

const SELF_HARM = /(kill myself|killing myself|end it all|suicid|take my (own )?life|hurt myself|cut myself|don'?t want to (be alive|live)|want to die|uccidermi|ammazzarmi|farla finita|togliermi la vita|tagliarmi|farmi del male|non voglio pi[uù] vivere|voglio morire)/i;
const INSULTS = /\b(bitch\w*|bastard\w*|asshole\w*|cunt\w*|whore\w*|slut\w*|retard\w*|idiot\w*|moron\w*|f+u+c+k+\s*(you|him|her|them)|stronz\w*|puttan\w*|troia|coglion\w*|vaffanculo|deficient\w*|cretin\w*|ritardat\w*)\b/i;
const THREATS = /\b(i('| a)?ll kill (you|him|her|them)|i will kill|i'?m going to (hurt|kill)|make (him|her|them) pay|i know where (you|he|she|they) live|ti ammazzo|lo ammazzo|la ammazzo|gliela faccio pagare|so dove abit\w+)/i;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const HANDLE = /(^|\s)@\w{2,}/;
const PHONE = /\+?\d[\d\s/.-]{7,}\d/;
// Invitations to get in touch outside the app.
const CONTACT_INVITE = /\b(dm me|message me|text me|write to me|contact me|add me|find me on|hit me up|my (insta|ig|snap|snapchat|telegram|whatsapp|tiktok|number)|scrivimi|contattami|aggiungimi|cercami|trovami su|mandami un messaggio|il mio (numero|insta|profilo)|su (insta|instagram|snap|telegram|whatsapp|tiktok) sono)\b/i;
const LINK = /(https?:\/\/|www\.|\b\w+\.(com|net|org|io|ch|it|co|uk|de|fr)\b)/i;

const normalizedText = (text, rep) =>
  [...strip(text.toLowerCase())].map((ch) => LOOKALIKES[ch] ?? ch).join("")
    .replace(/[0345789@$€]/g, (ch) => LEET[ch]).replace(AMBIGUOUS, rep);

export function analyze(text) {
  const r = {
    names: [], properNouns: [], disguised: [], contact: false,
    insult: false, threat: false, selfHarm: false,
  };
  if (!text.trim()) return r;

  const tokens = text.split(/\s+/).filter(Boolean);

  tokens.forEach((raw) => {
    // trim surrounding punctuation, keep characters that may be standing in for letters
    const token = raw.replace(/^[^\p{L}\p{N}@$|!€]+/u, "").replace(/[^\p{L}\p{N}]+$/u, "").replace(/['’]s$/i, "");
    if (!token) return;
    const plain = /^[\p{L}]+$/u.test(token) && !/[^\x00-ɏ]/.test(token);
    if (matchesName(token)) {
      if (plain) r.names.push(token);
      else r.disguised.push(token); // written with numbers, symbols, dots or look-alike letters
    } else if (/\p{L}/u.test(token) && /[\d@$€|]/u.test(token) && !MIXED_OK.test(token) && !EMAIL.test(raw) && !HANDLE.test(" " + raw)) {
      r.disguised.push(token); // numbers mixed into a word, e.g. "K3vin"
    } else if (/^(\p{L}[._\-*~·]){3,}\p{L}$/u.test(token)) {
      r.disguised.push(token); // l.e.t.t.e.r.s
    }
  });

  // Single letters written apart: "l u c a"
  let run = [];
  const flush = () => {
    if (run.length >= 3) {
      const word = run.join("");
      if (matchesName(word) || run.length >= 4) r.disguised.push(run.join(" "));
    }
    run = [];
  };
  for (const t of tokens) {
    if (/^[\p{L}\d@$|!]$/u.test(t)) run.push(t); else flush();
  }
  flush();

  // Capitalised words that are not the first word of a sentence.
  for (const sentence of text.split(/[.!?…\n]+/)) {
    for (const word of sentence.trim().split(/\s+/).slice(1)) {
      const clean = word.replace(/['’]s\b.*$/i, "").replace(/[^\p{L}]/gu, "");
      if (
        clean.length > 1 && /^\p{Lu}\p{Ll}/u.test(clean) && !ALWAYS_CAPITALISED.has(clean) &&
        !r.names.includes(clean) && !r.disguised.some((d) => d.includes(clean))
      ) r.properNouns.push(clean);
    }
  }

  const texts = [text, normalizedText(text, "l"), normalizedText(text, "i")];
  r.contact = EMAIL.test(text) || HANDLE.test(text) || PHONE.test(text) || LINK.test(text) || texts.some((t) => CONTACT_INVITE.test(t));
  r.insult = texts.some((t) => INSULTS.test(t));
  r.threat = texts.some((t) => THREATS.test(t));
  r.selfHarm = texts.some((t) => SELF_HARM.test(t));
  r.names = [...new Set(r.names)];
  r.properNouns = [...new Set(r.properNouns)];
  r.disguised = [...new Set(r.disguised)];
  return r;
}

export function isBlocked(r) {
  return r.names.length > 0 || r.properNouns.length > 0 || r.disguised.length > 0 ||
    r.contact || r.insult || r.threat || r.selfHarm;
}
