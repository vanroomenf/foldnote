// Interface strings and language detection.
// The app picks the first supported language in the device settings
// (navigator.languages), falling back to English. Add a language by adding
// a block here and "xx" texts in data.js.

export const SUPPORTED = ["en", "it"];
export const LANGUAGE_NAMES = { en: "English", it: "Italiano" };

export function deviceLanguage() {
  const prefs = (typeof navigator !== "undefined" && (navigator.languages?.length ? navigator.languages : [navigator.language])) || [];
  for (const tag of prefs) {
    const base = String(tag || "").toLowerCase().split("-")[0];
    if (SUPPORTED.includes(base)) return base;
  }
  return "en";
}

export const STRINGS = {
  en: {
    tagline: "Anonymous secrets, kind reactions",
    tabs: { read: "Read", write: "Write", rules: "Rules" },
    all: "All",
    categories: "Categories",
    secretsCount: (n) => `${n} secrets`,
    reactions: { metoo: "Me too", hug: "Sending love", laugh: "Made me laugh", wow: "Didn't see that coming" },
    gender: { m: "Man", f: "Woman", x: "Prefers not to say" },
    ageSuffix: "",
    report: "Report",
    reported: "Report sent to the moderators. Thank you.",
    swipeHint: "Swipe up for the next secret",
    next: "Next secret",
    adLabel: "Ad",
    adText: "An ad would fill this screen, one every five secrets.",
    endTitle: "You've read them all.",
    endText: "New secrets arrive every day. Try another category or share one of your own.",
    backToTop: "Back to the first",
    writeOne: "Write a secret",
    sample: "Prototype with sample secrets.",

    writeTitle: "Say it quietly",
    writeIntro: "Talk about yourself, never about someone else. Instead of names, use roles: “my brother”, “a colleague”, “my boss”.",
    yourSecret: "Your secret",
    placeholder: "e.g. Every time my boss compliments me, I go to the bathroom to smile on my own.",
    iAm: "I am",
    category: "Category",
    chooseWhere: "Choose where to post it.",
    autoCheck: "Automatic check",
    chk: {
      nameBad: (l) => ["Contains a name: ", l, ". Replace it with a role, like “a friend”."],
      nameOk: "No personal names",
      properBad: (l) => ["Looks like a name: ", l, ". If it isn't one, write it in lowercase."],
      properOk: "No suspicious proper nouns",
      disguisedBad: (l) => ["Written to get past the filter: ", l, ". Numbers, symbols or spaces inside a word aren't allowed. Doing this on purpose gets you banned."],
      disguisedOk: "No disguised words",
      contactBad: "Contains contact details or an invitation to get in touch. Foldnote has no contact between users.",
      contactOk: "No contact details",
      threat: "Contains a threat.",
      insult: "Contains an insult or offensive word.",
      insultOk: "No insults or threats",
    },
    help: {
      title: "It sounds like you're going through a hard time.",
      body: "This won't be posted, but what you feel matters. Talking to someone can help, even right now.",
      lines: [["Switzerland: Die Dargebotene Hand / La Main Tendue", "143"], ["Italy: Telefono Amico", "02 2327 2327"], ["UK & Ireland: Samaritans", "116 123"], ["USA: Suicide & Crisis Lifeline", "988"]],
      emergency: "If you're in immediate danger, call your local emergency number.",
    },
    send: "Send for review",
    missing: { gender: "Choose man or woman to send", cat: "Choose a category to send" },
    received: "Received.",
    receivedText: "A moderator reads it before it goes live, usually within a few hours. Nobody will know it's yours.",
    yourSecrets: "Your secrets",
    inReview: "In review",

    rulesTitle: "The Foldnote rules",
    rules: [
      ["Only talk about yourself.", "No names, nicknames, social handles or details that identify another person."],
      ["No personal data.", "Not yours, not anyone else's: phone numbers, emails, addresses, links."],
      ["No insults, hate or threats.", "You can share your anger. You can't aim it at someone."],
      ["No explicit or illegal content.", "Foldnote is for adults, but it stays a clean place."],
      ["Adults only.", "You must be at least 18."],
    ],
    breakTitle: "What happens if someone breaks them",
    ladder: [
      ["Blocked", "The filter spots a name or personal detail while you type. The secret isn't sent and you're asked to rewrite it. No penalty: it can happen by mistake.", "g"],
      ["Rejected", "A moderator rejects a borderline secret during review. You get a notice explaining why.", "g"],
      ["Banned", "A clear, deliberate violation: a name disguised to dodge the filter (like “1uca” or “J o h n”), trying to contact someone, insults, threats, someone else's data. The account is closed the first time, with no second chances.", "r"],
    ],
    seeBan: "See the ban screen (demo)",
    replayWelcome: "Show the welcome screen again",
    languageTitle: "Language",
    languageAuto: (name) => `Automatic (device: ${name})`,

    welcomeTitle: "A place to say what you'd never say out loud.",
    welcomeLede: "Read secrets from strangers, one at a time, and find out how many people feel the same way. No comments, no messages, only kind reactions.",
    beforeIn: "Before you come in",
    welcomeRules: [
      ["Only talk about yourself.", "Never names or details that identify someone."],
      ["No personal data, insults or threats.", "The filter blocks them and a moderator checks every secret."],
      ["Zero tolerance.", "Anyone who breaks the rules on purpose is banned the first time."],
    ],
    adult: "I am at least 18 years old.",
    accept: "I've read the rules and accept that if I break them on purpose, my account will be closed immediately.",
    enter: "Enter",

    banTitle: "Your account has been closed.",
    banLede: "One of your secrets contained another person's name, disguised to get past the filter. That breaks rule 1, which you accepted when you joined.",
    banWhat: "What this means",
    banText: "You can no longer read or post on Foldnote with this phone number. The secret was deleted and never published.",
    banAppeal: "If you think this is a mistake, you can ask for a review once.",
    banBack: "Back to the app (demo only)",
  },

  it: {
    tagline: "Segreti anonimi, reazioni gentili",
    tabs: { read: "Leggi", write: "Scrivi", rules: "Regole" },
    all: "Tutti",
    categories: "Categorie",
    secretsCount: (n) => `${n} segreti`,
    reactions: { metoo: "Anche io", hug: "Ti sono accanto", laugh: "Mi fai ridere", wow: "Non me l'aspettavo" },
    gender: { m: "Uomo", f: "Donna", x: "Preferisce non dirlo" },
    ageSuffix: " anni",
    report: "Segnala",
    reported: "Segnalazione inviata ai moderatori. Grazie.",
    swipeHint: "Scorri in su per il prossimo segreto",
    next: "Prossimo segreto",
    adLabel: "Pubblicità",
    adText: "Qui un annuncio occuperebbe lo schermo, uno ogni cinque segreti.",
    endTitle: "Li hai letti tutti.",
    endText: "Ogni giorno arrivano nuovi segreti. Prova un'altra categoria o scrivine uno tuo.",
    backToTop: "Torna al primo",
    writeOne: "Scrivi un segreto",
    sample: "Prototipo con segreti di esempio.",

    writeTitle: "Dillo sottovoce",
    writeIntro: "Parla di te, mai di qualcun altro. Al posto dei nomi usa ruoli: «mio fratello», «una collega», «il mio capo».",
    yourSecret: "Il tuo segreto",
    placeholder: "Es. Ogni volta che il mio capo mi fa i complimenti vado in bagno a sorridere da solo.",
    iAm: "Sono",
    category: "Categoria",
    chooseWhere: "Scegli dove pubblicarlo.",
    autoCheck: "Controllo automatico",
    chk: {
      nameBad: (l) => ["Contiene un nome: ", l, ". Sostituiscilo con un ruolo, per esempio «un amico»."],
      nameOk: "Nessun nome di persona",
      properBad: (l) => ["Sembra un nome proprio: ", l, ". Se non lo è, scrivilo in minuscolo."],
      properOk: "Nessun nome proprio sospetto",
      disguisedBad: (l) => ["Scritto per aggirare il filtro: ", l, ". Numeri, simboli o spazi dentro una parola non sono ammessi. Farlo apposta porta all'espulsione."],
      disguisedOk: "Nessuna parola camuffata",
      contactBad: "Contiene un contatto o un invito a farsi contattare. Su Foldnote gli utenti non possono contattarsi.",
      contactOk: "Nessun dato di contatto",
      threat: "Contiene una minaccia.",
      insult: "Contiene un insulto o una parola offensiva.",
      insultOk: "Nessun insulto o minaccia",
    },
    help: {
      title: "Sembra che tu stia passando un momento difficile.",
      body: "Questo segreto non verrà pubblicato, ma quello che senti conta. Parlarne con qualcuno può aiutare, anche adesso.",
      lines: [["Svizzera: Telefono Amico", "143"], ["Italia: Telefono Amico", "02 2327 2327"], ["Regno Unito e Irlanda: Samaritans", "116 123"], ["Stati Uniti: Suicide & Crisis Lifeline", "988"]],
      emergency: "In caso di pericolo immediato chiama il numero di emergenza locale (112 in Europa).",
    },
    send: "Invia in revisione",
    missing: { gender: "Scegli uomo o donna per inviare", cat: "Scegli una categoria per inviare" },
    received: "Ricevuto.",
    receivedText: "Un moderatore lo legge prima della pubblicazione, di solito entro poche ore. Nessuno saprà che è tuo.",
    yourSecrets: "I tuoi segreti",
    inReview: "In revisione",

    rulesTitle: "Le regole di Foldnote",
    rules: [
      ["Parla solo di te.", "Niente nomi, soprannomi, profili social o dettagli che fanno riconoscere un'altra persona."],
      ["Niente dati personali.", "Né tuoi né di altri: numeri di telefono, email, indirizzi, link."],
      ["Niente insulti, odio o minacce.", "Puoi raccontare la tua rabbia, non usarla contro qualcuno."],
      ["Niente contenuti espliciti o illegali.", "Foldnote è per adulti, ma resta un posto pulito."],
      ["Solo maggiorenni.", "Bisogna avere almeno 18 anni."],
    ],
    breakTitle: "Cosa succede se qualcuno sgarra",
    ladder: [
      ["Bloccato", "Il filtro trova un nome o un dato personale mentre scrivi. Il segreto non parte e ti chiediamo di riscriverlo. Nessuna penalità: può capitare per sbaglio.", "g"],
      ["Scartato", "Il moderatore scarta un segreto dubbio in revisione. Ricevi un avviso con il motivo.", "g"],
      ["Espulso", "Violazione voluta e chiara: un nome camuffato per aggirare il filtro (come «1uca» o «M a r c o»), tentare di contattare qualcuno, insulti, minacce, dati di altri. L'account viene chiuso alla prima volta, senza seconde possibilità.", "r"],
    ],
    seeBan: "Vedi la schermata di espulsione (demo)",
    replayWelcome: "Rivedi la schermata di benvenuto",
    languageTitle: "Lingua",
    languageAuto: (name) => `Automatica (dispositivo: ${name})`,

    welcomeTitle: "Un posto per dire quello che non diresti mai.",
    welcomeLede: "Leggi i segreti di sconosciuti, uno alla volta, e scopri quante persone provano le stesse cose. Niente commenti, niente messaggi, solo reazioni gentili.",
    beforeIn: "Prima di entrare",
    welcomeRules: [
      ["Parla solo di te.", "Mai nomi o dettagli che fanno riconoscere qualcuno."],
      ["Niente dati personali, insulti o minacce.", "Il filtro li blocca e un moderatore controlla ogni segreto."],
      ["Tolleranza zero.", "Chi viola le regole apposta viene espulso alla prima volta."],
    ],
    adult: "Ho almeno 18 anni.",
    accept: "Ho letto le regole e accetto che, se le violo apposta, il mio account venga chiuso subito.",
    enter: "Entra",

    banTitle: "Il tuo account è stato chiuso.",
    banLede: "Un tuo segreto conteneva il nome di un'altra persona, camuffato per aggirare il filtro. È una violazione della regola 1, che hai accettato all'ingresso.",
    banWhat: "Cosa significa",
    banText: "Non puoi più leggere né scrivere su Foldnote con questo numero di telefono. Il segreto è stato eliminato e non è mai stato pubblicato.",
    banAppeal: "Se pensi che sia un errore, puoi chiedere una revisione una sola volta.",
    banBack: "Torna all'app (solo demo)",
  },
};

/* ---------- profile, messages and newer options ---------- */

Object.assign(STRINGS.en, {
  tabs: { read: "Read", write: "Write", me: "Me" },
  gender: { m: "Man", f: "Woman", nb: "Non-binary", x: "Prefers not to say" },
  genderChoice: { m: "Man", f: "Woman", nb: "Non-binary", x: "Prefer not to say" },
  reactions: { metoo: "Me too", hug: "Sending love", laugh: "Made me laugh", wow: "Didn't see that coming", strong: "Stay strong", safe: "Safe with me",
    notalone: "You're not alone", moved: "That got me", proud: "Proud of you", cringe: "So awkward", dead: "I'm dead", goforit: "Go for it" },
  moreReactions: "More",
  lessReactions: "Less",
  allReactions: "All reactions",

  setupTitle: "Create your profile",
  setupLede: "Your secrets are always anonymous. Nobody can see your profile, and nobody on Foldnote can contact you.",
  nickname: "Nickname",
  nicknameHint: "Only you see it. 3 to 20 letters, numbers, dots or underscores.",
  nicknameBad: "Use 3 to 20 letters, numbers, dots or underscores, with no contact details or offensive words.",
  avatar: "Avatar",
  iAm: "I am",
  ageBand: "Age",
  country: "Country",
  phoneNote: "In the real app you'd confirm your phone number here. It's never shown to anyone, and it's how a ban stays a ban.",
  createProfile: "Create profile",
  saveProfile: "Save",
  cancel: "Cancel",

  postingAs: "Posted anonymously as",
  editInMe: "Change it in Me",

  meTitle: "Your profile",
  privacyTitle: "Who sees what",
  privacy: [
    ["Your secrets", "Always anonymous. Readers only see gender, age band and country."],
    ["Your profile", "Only you see it. It fills in gender, age band and country on your secrets for you."],
    ["Contact", "Foldnote has no private messages, no followers and no comments. Nobody can reach you through the app, and you can't reach anyone."],
  ],
  editProfile: "Edit profile",


  rules: [
    ["Only talk about yourself.", "No names, nicknames, social handles or details that identify another person."],
    ["No personal data.", "Not yours, not anyone else's: phone numbers, emails, addresses, links."],
    ["No insults, hate or threats.", "You can share your anger. You can't aim it at someone."],
    ["No contact, ever.", "Don't try to reach the author of a secret or invite people to contact you, in any form. That's an immediate ban."],
    ["No explicit or illegal content.", "Foldnote is for adults, but it stays a clean place."],
    ["Adults only.", "You must be at least 18."],
  ],
});

Object.assign(STRINGS.it, {
  tabs: { read: "Leggi", write: "Scrivi", me: "Io" },
  gender: { m: "Uomo", f: "Donna", nb: "Non binario", x: "Preferisce non dirlo" },
  genderChoice: { m: "Uomo", f: "Donna", nb: "Non binario", x: "Preferisco non dirlo" },
  reactions: { metoo: "Anche io", hug: "Ti sono accanto", laugh: "Mi fai ridere", wow: "Non me l'aspettavo", strong: "Forza", safe: "Rimane tra noi",
    notalone: "Non sei solo", moved: "Mi hai commosso", proud: "Fiero di te", cringe: "Che imbarazzo", dead: "Sto morendo", goforit: "Buttati!" },
  moreReactions: "Altre",
  lessReactions: "Meno",
  allReactions: "Tutte le reazioni",

  setupTitle: "Crea il tuo profilo",
  setupLede: "I tuoi segreti sono sempre anonimi. Nessuno vede il tuo profilo e nessuno su Foldnote può contattarti.",
  nickname: "Nickname",
  nicknameHint: "Lo vedi solo tu. Da 3 a 20 tra lettere, numeri, punti o trattini bassi.",
  nicknameBad: "Usa da 3 a 20 tra lettere, numeri, punti o trattini bassi, senza contatti né parole offensive.",
  avatar: "Avatar",
  iAm: "Sono",
  ageBand: "Età",
  country: "Paese",
  phoneNote: "Nell'app vera qui confermeresti il tuo numero di telefono. Non lo vede nessuno, e serve perché un'espulsione resti tale.",
  createProfile: "Crea profilo",
  saveProfile: "Salva",
  cancel: "Annulla",

  postingAs: "Pubblicato in forma anonima come",
  editInMe: "Modificalo in Io",

  meTitle: "Il tuo profilo",
  privacyTitle: "Chi vede cosa",
  privacy: [
    ["I tuoi segreti", "Sempre anonimi. Chi legge vede solo genere, fascia d'età e Paese."],
    ["Il tuo profilo", "Lo vedi solo tu. Serve a compilare in automatico genere, fascia d'età e Paese sui tuoi segreti."],
    ["Contatti", "Foldnote non ha messaggi privati, follower o commenti. Nessuno può raggiungerti tramite l'app, e tu non puoi raggiungere nessuno."],
  ],
  editProfile: "Modifica profilo",


  rules: [
    ["Parla solo di te.", "Niente nomi, soprannomi, profili social o dettagli che fanno riconoscere un'altra persona."],
    ["Niente dati personali.", "Né tuoi né di altri: numeri di telefono, email, indirizzi, link."],
    ["Niente insulti, odio o minacce.", "Puoi raccontare la tua rabbia, non usarla contro qualcuno."],
    ["Nessun contatto, mai.", "Non cercare l'autore di un segreto e non invitare nessuno a contattarti, in nessuna forma. È espulsione immediata."],
    ["Niente contenuti espliciti o illegali.", "Foldnote è per adulti, ma resta un posto pulito."],
    ["Solo maggiorenni.", "Bisogna avere almeno 18 anni."],
  ],
});

/* ---------- reporting ---------- */

STRINGS.en.rep = {
  title: "Why are you reporting this?",
  intro: "Reports are anonymous. The author won't know who reported their secret.",
  reasons: {
    identifies: ["It identifies someone", "A name, nickname or details that make it clear who it's about"],
    contact: ["It tries to make contact", "Phone number, social handle, link, or an invitation to get in touch"],
    hate: ["Bullying, hate or threats", "Insults, hatred toward a group, or a threat against someone"],
    sexual: ["Sexual or explicit content", "Graphic sexual details or anything involving minors"],
    risk: ["Someone may be in danger", "Self-harm, suicide, abuse or violence happening now"],
    minor: ["The author seems to be under 18", "Foldnote is only for adults"],
    illegal: ["Something illegal", "Selling drugs or weapons, fraud, or other crimes"],
    spam: ["Spam or advertising", "Promotion, scams or repeated posts"],
    other: ["Something else", "It breaks the rules in another way"],
  },
  next: "Continue",
  change: "Change",
  detailsTitle: "Anything to add?",
  detailsLabel: "Details (optional)",
  detailsPlaceholder: "What should the moderator look at? Don't include names or contact details.",
  detailsBad: "Please remove contact details, insults or threats from your note.",
  identifiesNote: "If the secret is about you and you want it removed quickly, say so here. You don't need to tell us who you are.",
  riskTitle: "If someone is in immediate danger, call the emergency number (112 in Europe, 911 in the US).",
  riskBody: "We review these reports first. If it's you who's struggling, you can talk to someone right now:",
  whatHappens: "The secret is hidden for you straight away. A moderator reviews it, usually within 24 hours, and removes it if it breaks the rules. Repeated false reports can lead to a ban.",
  submit: "Send report",
  sentToast: "Report sent. Thank you for keeping Foldnote safe.",
  doneTitle: "You reported this secret",
  doneText: "It's hidden for you, and a moderator will review it.",
  reasonWas: "Reason:",
  undo: "Undo report and show it again",
};

STRINGS.it.rep = {
  title: "Perché lo segnali?",
  intro: "Le segnalazioni sono anonime. L'autore non saprà chi ha segnalato il suo segreto.",
  reasons: {
    identifies: ["Fa riconoscere qualcuno", "Un nome, un soprannome o dettagli che fanno capire di chi si parla"],
    contact: ["Cerca un contatto", "Numero di telefono, profilo social, link o un invito a farsi contattare"],
    hate: ["Bullismo, odio o minacce", "Insulti, odio verso un gruppo o una minaccia verso qualcuno"],
    sexual: ["Contenuti sessuali espliciti", "Dettagli sessuali espliciti o qualsiasi cosa che riguardi minori"],
    risk: ["Qualcuno potrebbe essere in pericolo", "Autolesionismo, suicidio, abusi o violenze in corso"],
    minor: ["L'autore sembra minorenne", "Foldnote è solo per maggiorenni"],
    illegal: ["Qualcosa di illegale", "Vendita di droghe o armi, truffe o altri reati"],
    spam: ["Spam o pubblicità", "Promozioni, truffe o messaggi ripetuti"],
    other: ["Altro", "Viola le regole in un altro modo"],
  },
  next: "Continua",
  change: "Cambia",
  detailsTitle: "Vuoi aggiungere qualcosa?",
  detailsLabel: "Dettagli (facoltativo)",
  detailsPlaceholder: "Cosa deve guardare il moderatore? Non scrivere nomi o contatti.",
  detailsBad: "Togli dalla nota contatti, insulti o minacce.",
  identifiesNote: "Se il segreto parla di te e vuoi che venga tolto in fretta, scrivilo qui. Non serve dirci chi sei.",
  riskTitle: "Se qualcuno è in pericolo immediato, chiama il numero di emergenza (112 in Europa).",
  riskBody: "Queste segnalazioni le controlliamo per prime. Se sei tu a stare male, puoi parlare con qualcuno anche adesso:",
  whatHappens: "Il segreto sparisce subito per te. Un moderatore lo controlla, di solito entro 24 ore, e lo rimuove se viola le regole. Le segnalazioni false ripetute possono portare all'espulsione.",
  submit: "Invia segnalazione",
  sentToast: "Segnalazione inviata. Grazie per aiutare a tenere Foldnote sicuro.",
  doneTitle: "Hai segnalato questo segreto",
  doneText: "Non lo vedi più, e un moderatore lo controllerà.",
  reasonWas: "Motivo:",
  undo: "Annulla la segnalazione e mostralo di nuovo",
};

STRINGS.en.allReactions = "Reactions";
STRINGS.it.allReactions = "Reazioni";

/* ---------- my secrets and duration ---------- */

STRINGS.en.dur = {
  title: "How long it stays up",
  options: { "1d": "24 hours", "7d": "7 days", "30d": "30 days", "1y": "1 year" },
  hint: "After that it disappears for everyone. You can delete it sooner from Me.",
};
STRINGS.it.dur = {
  title: "Quanto resta online",
  options: { "1d": "24 ore", "7d": "7 giorni", "30d": "30 giorni", "1y": "1 anno" },
  hint: "Poi sparisce per tutti. Puoi cancellarlo prima dalla sezione Io.",
};
STRINGS.en.left = { days: (n) => (n === 1 ? "1 day" : `${n} days`), hours: (n) => (n === 1 ? "1 hour" : `${n} hours`), minutes: (n) => `${n} min` };
STRINGS.it.left = { days: (n) => (n === 1 ? "1 giorno" : `${n} giorni`), hours: (n) => (n === 1 ? "1 ora" : `${n} ore`), minutes: (n) => `${n} min` };
STRINGS.en.mine = {
  title: "Your secrets",
  empty: "You haven't posted anything yet. Your secrets will show up here, and only you can see this list.",
  review: "In review",
  live: "Live",
  expired: "Expired",
  reviewText: "A moderator is reading it.",
  expiresIn: "Disappears in",
  expiredText: "No longer visible to anyone.",
  noReactions: "No reactions yet",
  reactionsLabel: (n) => `${n} reactions received`,
  delete: "Delete",
  confirm: "Delete this secret for good? It will disappear for everyone, along with its reactions.",
  deleteNow: "Delete for good",
  deletedToast: "Secret deleted.",
  seeMine: "See your secrets",
  demoNote: "Prototype: moderation takes a few seconds and reactions are simulated.",
};
STRINGS.it.mine = {
  title: "I tuoi segreti",
  empty: "Non hai ancora pubblicato niente. I tuoi segreti compariranno qui, e questa lista la vedi solo tu.",
  review: "In revisione",
  live: "Online",
  expired: "Scaduto",
  reviewText: "Un moderatore lo sta leggendo.",
  expiresIn: "Sparisce tra",
  expiredText: "Non è più visibile a nessuno.",
  noReactions: "Ancora nessuna reazione",
  reactionsLabel: (n) => `${n} reazioni ricevute`,
  delete: "Elimina",
  confirm: "Eliminare questo segreto per sempre? Sparirà per tutti, insieme alle sue reazioni.",
  deleteNow: "Elimina per sempre",
  deletedToast: "Segreto eliminato.",
  seeMine: "Vedi i tuoi segreti",
  demoNote: "Prototipo: la revisione dura pochi secondi e le reazioni sono simulate.",
};

/* ---------- which languages to read ---------- */

STRINGS.en.where = {
  title: "Languages you read",
  lede: "Pick the languages you want to read secrets in, or read everything. Secrets always appear exactly as they were written.",
  all: "All languages",
  label: "Reading in",
  change: "Change",
  note: "Each secret's language is recognised automatically when it's written, and the author can correct it.",
  emptyTitle: "No secrets here yet.",
  emptyText: "Nobody has written in this category in your languages yet. Try another category, or read in all languages.",
  seeAll: "Read in all languages",
};
STRINGS.it.where = {
  title: "Lingue in cui leggi",
  lede: "Scegli le lingue in cui vuoi leggere i segreti, oppure leggili tutti. I segreti si vedono sempre esattamente come sono stati scritti.",
  all: "Tutte le lingue",
  label: "Leggi in",
  change: "Cambia",
  note: "La lingua di ogni segreto viene riconosciuta da sola quando viene scritto, e l'autore può correggerla.",
  emptyTitle: "Ancora nessun segreto qui.",
  emptyText: "Nessuno ha ancora scritto in questa categoria nelle tue lingue. Prova un'altra categoria, o leggi in tutte le lingue.",
  seeAll: "Leggi in tutte le lingue",
};

STRINGS.en.wlang = {
  label: "Language",
  writtenIn: "Written in",
  auto: "recognised automatically, tap to correct",
  unknown: "Which language is this in? Write a little more, or pick it here:",
  missing: "Choose the language to send",
  other: "Another language",
};
STRINGS.it.wlang = {
  label: "Lingua",
  writtenIn: "Scritto in",
  auto: "riconosciuto in automatico, tocca per correggere",
  unknown: "In che lingua è? Scrivi ancora un po', oppure sceglila:",
  missing: "Scegli la lingua per inviare",
  other: "Altra lingua",
};
