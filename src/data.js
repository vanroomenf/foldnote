// Categories, reactions and sample secrets for the Foldnote prototype.
// Labels and texts are given per language; see i18n.js for the interface strings.
// gender: "m" man, "f" woman, "x" prefers not to say. country: ISO code, shown in the reader's language.

export const CATEGORIES = [
  { key: "butterflies", en: ["Butterflies", "Crushes, love and that fluttery feeling"], it: ["Batticuore", "Amori, cotte e farfalle nello stomaco"] },
  { key: "closed", en: ["Closed Chapters", "Exes, breakups and what's left behind"], it: ["Capitoli chiusi", "Ex, addii e quello che è rimasto"] },
  { key: "monday", en: ["Monday Morning", "Work, bosses, colleagues and meetings"], it: ["Lunedì mattina", "Ufficio, colleghi, capi e riunioni"] },
  { key: "family", en: ["Family Dinner", "Parents, kids, relatives and in-laws"], it: ["Pranzo della domenica", "Genitori, figli, parenti e suoceri"] },
  { key: "friends", en: ["Almost Friends", "Friendships that lasted, ended or never started"], it: ["Amici, quasi", "Amicizie vere, finite o mai iniziate"] },
  { key: "lies", en: ["White Lies", "The little lies we all tell"], it: ["Bugie bianche", "Le piccole bugie che diciamo tutti"] },
  { key: "cringe", en: ["Cringe Files", "Moments you wish you could delete"], it: ["Figuracce", "Momenti che vorresti cancellare"] },
  { key: "quirks", en: ["Secret Quirks", "Strange habits you never admit to"], it: ["Manie segrete", "Abitudini strane che non confessi a nessuno"] },
  { key: "lump", en: ["Lump in the Throat", "The things that make you tear up"], it: ["Groppo in gola", "Le cose che fanno commuovere"] },
];

export const REACTIONS = [
  { key: "metoo", emoji: "🙋" },
  { key: "hug", emoji: "🫂" },
  { key: "laugh", emoji: "😂" },
  { key: "wow", emoji: "😮" },
  { key: "strong", emoji: "💪" },
  { key: "safe", emoji: "🤐" },
  { key: "notalone", emoji: "🤝" },
  { key: "moved", emoji: "🥲" },
  { key: "proud", emoji: "👏" },
  { key: "cringe", emoji: "🫣" },
  { key: "dead", emoji: "💀" },
  { key: "goforit", emoji: "🔥" },
];

// How many reactions show on a card before "More".
export const QUICK_REACTIONS = 4;

export const GENDERS = ["m", "f", "nb", "x"];
export const AGE_BANDS = ["18–19", "20–29", "30–39", "40–49", "50–59", "60+"];
export const COUNTRIES = ["CH", "IT", "DE", "FR", "AT", "ES", "PT", "GB", "IE", "US", "CA", "AU"];
export const AVATARS = [
  // animals
  "🦉", "🦊", "🐢", "🐙", "🐝", "🐧", "🦔", "🐨", "🦦", "🐸", "🦋", "🐳", "🦩", "🐌", "🦥", "🐞",
  // nature and sky
  "🌙", "🌵", "🍄", "🌊", "🪐", "🌻", "🍁", "🌈", "⛰️", "❄️", "🔥", "⭐",
  // food
  "🍋", "🍉", "🥑", "🍩", "🍓", "🧁",
  // things
  "🎈", "🎧", "📚", "🎨", "🪁", "🧩", "🕯️", "🎲", "🪴", "☕", "🧸", "🔮",
];

// Sample content. In production these come from your backend after moderation,
// written in one language and translated for readers of the other languages.
export const SECRETS = [
  { id: 1, cat: "quirks", gender: "m", country: "CH", age: "30–39", views: 4120, r: { metoo: 612, hug: 388, laugh: 1450, wow: 96 },
    en: "I'm 34 and my mom still cuts my hair because I'm scared of hairdressers.",
    it: "Ho 34 anni e mi faccio ancora tagliare i capelli da mia madre perché ho paura dei parrucchieri." },
  { id: 16, cat: "butterflies", gender: "f", country: "CH", age: "40–49", views: 6380, r: { metoo: 1240, hug: 2810, laugh: 30, wow: 410 },
    en: "Twelve years married and my heart still jumps when I hear his keys in the door.",
    it: "Sono sposata da dodici anni e mi viene ancora il batticuore quando sento le sue chiavi nella porta." },
  { id: 2, cat: "lies", gender: "m", country: "IT", age: "40–49", views: 5890, r: { metoo: 1730, hug: 210, laugh: 402, wow: 88 },
    en: "I told everyone I quit smoking. I have one cigarette a day, hiding in the basement.",
    it: "Dico a tutti che ho smesso di fumare. Fumo una sigaretta al giorno di nascosto in cantina." },
  { id: 17, cat: "closed", gender: "f", country: "GB", age: "20–29", views: 7120, r: { metoo: 2650, hug: 1980, laugh: 880, wow: 70 },
    en: "I told him I threw away his hoodie. I wear it every Sunday night.",
    it: "Gli ho detto che ho buttato la sua felpa. La metto ogni domenica sera." },
  { id: 5, cat: "monday", gender: "m", country: "CH", age: "30–39", views: 6020, r: { metoo: 2840, hug: 760, laugh: 120, wow: 205 },
    en: "At work everyone thinks I'm confident. Before every meeting I rehearse my lines in the car for twenty minutes.",
    it: "Al lavoro tutti pensano che io sia sicuro di me. Prima di ogni riunione ripasso le frasi in macchina per venti minuti." },
  { id: 8, cat: "lump", gender: "m", country: "ES", age: "40–49", views: 8210, r: { metoo: 1980, hug: 4650, laugh: 15, wow: 520 },
    en: "My dad never told me he's proud of me. Yesterday I heard him say it to a neighbour. I cried in the car.",
    it: "Mio padre non mi ha mai detto che è fiero di me. Ieri l'ho sentito dirlo a un vicino. Ho pianto in macchina." },
  { id: 19, cat: "cringe", gender: "f", country: "DE", age: "30–39", views: 6900, r: { metoo: 3420, hug: 120, laugh: 2960, wow: 25 },
    en: "I waved back at someone who was waving at the person behind me. I pretended to fix my hair. Three years later, I still think about it.",
    it: "Ho salutato con la mano una persona che salutava quella dietro di me. Ho fatto finta di sistemarmi i capelli. Ci penso ancora, dopo tre anni." },
  { id: 3, cat: "family", gender: "f", country: "IT", age: "20–29", views: 7300, r: { metoo: 3105, hug: 290, laugh: 1880, wow: 45 },
    en: "On my graduation day I was mostly happy that nobody would ever ask me when I'm graduating again.",
    it: "Il giorno della mia laurea ero felice soprattutto perché nessuno mi avrebbe più chiesto quando mi laureo." },
  { id: 21, cat: "friends", gender: "f", country: "US", age: "30–39", views: 5340, r: { metoo: 2290, hug: 640, laugh: 780, wow: 130 },
    en: "I'm in a group chat with my high school friends. I've read every message for six years and never written one.",
    it: "Sono in un gruppo con le amiche del liceo. Leggo tutti i messaggi e non scrivo mai, da sei anni." },
  { id: 6, cat: "quirks", gender: "m", country: "FR", age: "20–29", views: 4980, r: { metoo: 1505, hug: 180, laugh: 2210, wow: 40 },
    en: "I talk to my plants. Once I apologised to a basil plant for leaving it in the sun.",
    it: "Parlo con le mie piante. Una volta mi sono scusato con un basilico perché l'avevo dimenticato al sole." },
  { id: 18, cat: "closed", gender: "f", country: "AT", age: "30–39", views: 6150, r: { metoo: 2470, hug: 1530, laugh: 540, wow: 300 },
    en: "The day we broke up I cried for an hour. Then I slept better than I had in two years.",
    it: "Il giorno in cui ci siamo lasciati ho pianto un'ora. Poi ho dormito benissimo per la prima volta in due anni." },
  { id: 9, cat: "monday", gender: "f", country: "CH", age: "20–29", views: 5100, r: { metoo: 2930, hug: 310, laugh: 1350, wow: 22 },
    en: "When someone says “quick call?” I can literally feel my heart speed up.",
    it: "Quando qualcuno mi dice «facciamo una call veloce» sento il cuore che accelera." },
  { id: 7, cat: "lies", gender: "m", country: "GB", age: "30–39", views: 3890, r: { metoo: 640, hug: 60, laugh: 1720, wow: 390 },
    en: "I've never seen the movie I say is my favourite. I picked it at 16 to impress someone and now it's too late.",
    it: "Non ho mai visto il film che dico essere il mio preferito. L'ho scelto a 16 anni per fare colpo e ormai è tardi." },
  { id: 10, cat: "butterflies", gender: "m", country: "IT", age: "20–29", views: 6440, r: { metoo: 210, hug: 540, laugh: 2980, wow: 1120 },
    en: "I told my girlfriend I can swim. We leave for the beach in three weeks and I'm taking lessons in secret.",
    it: "Ho detto alla mia ragazza che so nuotare. Partiamo per il mare tra tre settimane e sto prendendo lezioni di nascosto." },
  { id: 12, cat: "family", gender: "f", country: "US", age: "30–39", views: 7650, r: { metoo: 880, hug: 420, laugh: 3310, wow: 1760 },
    en: "I pretend I don't understand my husband's family's language. I understand all of it, including what they say about me.",
    it: "Faccio finta di non capire il dialetto della famiglia di mio marito. Lo capisco benissimo, compresi i commenti su di me." },
  { id: 20, cat: "cringe", gender: "m", country: "CH", age: "20–29", views: 5780, r: { metoo: 1890, hug: 90, laugh: 3640, wow: 150 },
    en: "The waiter said “enjoy your meal” and I said “you too.” It was my job interview lunch. They hired me anyway.",
    it: "Il cameriere mi ha detto «buon appetito» e io ho risposto «anche a lei». Era il mio colloquio di lavoro. Mi hanno assunto lo stesso." },
  { id: 11, cat: "lump", gender: "f", country: "AT", age: "60+", views: 2870, r: { metoo: 190, hug: 1340, laugh: 20, wow: 410 },
    en: "Every year I send a birthday card to my primary school teacher. I don't know if she reads them. I never sign.",
    it: "Ogni anno mando un biglietto d'auguri alla mia maestra delle elementari. Non so se lo legga. Non firmo mai." },
  { id: 13, cat: "lies", gender: "m", country: "CH", age: "40–49", views: 4410, r: { metoo: 1610, hug: 90, laugh: 1990, wow: 60 },
    en: "I joined the gym in January. I only go for the sauna and to feel like a person who goes to the gym.",
    it: "Mi sono iscritto in palestra a gennaio. Ci vado solo per la sauna e per sentirmi una persona che va in palestra." },
  { id: 22, cat: "butterflies", gender: "m", country: "CH", age: "20–29", views: 4720, r: { metoo: 690, hug: 1160, laugh: 1300, wow: 540 },
    en: "I learned three sentences in Japanese for someone I saw twice on the train. I never used them.",
    it: "Ho imparato tre frasi in giapponese per una persona che ho visto due volte in treno. Non le ho mai usate." },
  { id: 14, cat: "family", gender: "f", country: "PT", age: "40–49", views: 5230, r: { metoo: 1870, hug: 2400, laugh: 10, wow: 150 },
    en: "I'm scared my kids will grow up and stop needing me. Then I feel guilty, because that's exactly what I want for them.",
    it: "Ho paura che i miei figli crescano e non abbiano più bisogno di me. Poi mi sento in colpa, perché è proprio quello che voglio." },
  { id: 4, cat: "closed", gender: "m", country: "DE", age: "50–59", views: 3460, r: { metoo: 520, hug: 1290, laugh: 140, wow: 310 },
    en: "After the divorce I found out I can cook. I just needed nobody watching me while I did it.",
    it: "Dopo il divorzio ho scoperto che so cucinare. Avevo solo bisogno di qualcuno che non mi guardasse mentre lo facevo." },
  { id: 15, cat: "lies", gender: "m", country: "GB", age: "20–29", views: 9020, r: { metoo: 5480, hug: 40, laugh: 2650, wow: 30 },
    en: "I text “on my way” before I've even got out of the shower.",
    it: "Rispondo «sto arrivando» quando non sono ancora uscito dalla doccia." },
];

// Prototype extras: non-binary authors and starting counts for the newer reactions.
const NON_BINARY = new Set([9, 22]);
for (const s of SECRETS) {
  if (NON_BINARY.has(s.id)) s.gender = "nb";
  s.r.strong ??= Math.round(s.r.hug * 0.35 + s.views * 0.01);
  s.r.safe ??= Math.round(s.views * 0.04 + s.r.wow * 0.3);
  // Newer reactions, weighted by category so each secret has its own top reactions.
  const w = (cats, hi, lo) => Math.round(s.views * (cats.includes(s.cat) ? hi : lo) * (0.7 + ((s.id * 37) % 60) / 100));
  s.r.notalone ??= w(["lump", "family", "friends", "closed", "monday"], 0.16, 0.03);
  s.r.moved ??= w(["lump", "family", "butterflies"], 0.22, 0.02);
  s.r.proud ??= w(["closed", "lump", "monday"], 0.13, 0.015);
  s.r.cringe ??= w(["cringe", "lies"], 0.3, 0.03);
  s.r.dead ??= w(["cringe", "quirks", "lies"], 0.26, 0.02);
  s.r.goforit ??= w(["butterflies"], 0.24, 0.01);
}
