// Guesses which language a secret is written in, from common words and letters.
// Good enough for the prototype; a real app can use a language-identification
// library (for example CLD3 or fastText) on the server. The author always
// sees the guess and can correct it before posting.

export const LANGUAGES = ["it", "en", "de", "fr", "es", "pt"];

const WORDS = {
  it: "il lo la i gli le un una di che e è non per con mi ma sono ho ha come anche più quando mio mia del della nel alla perché ancora sempre io lui lei questo quella",
  en: "the a an and is are was i you he she it not to of in on for with my me but that this have has had when so just because still always never what who",
  de: "der die das und ist nicht ich du er sie es ein eine mit zu auf für mein meine aber dass wenn noch immer habe hat war auch nur sich den dem",
  fr: "le la les un une et est je tu il elle ne pas de des du que qui pour avec mon ma mes mais quand encore toujours suis ai a dans sur parce",
  es: "el la los las un una y es no de que en con por para mi me pero cuando todavía siempre estoy he ha yo tú él ella porque muy",
  pt: "o a os as um uma e é não de que em com por para meu minha mas quando ainda sempre estou eu ele ela porque muito isso se",
};
const SETS = Object.fromEntries(Object.entries(WORDS).map(([k, v]) => [k, new Set(v.split(" "))]));

// Letters that point strongly to one language.
const LETTERS = { de: /[äöüß]/i, es: /[ñ¿¡]/i, pt: /[ãõ]/i, fr: /[êâîôûëœ]|ç(?!ã)/i, it: /\b(perché|più|così|già)\b/i };

export function detectLanguage(text) {
  const words = text.toLowerCase().match(/[\p{L}']+/gu) || [];
  if (words.length < 3) return { lang: null, confident: false };
  const score = {};
  for (const l of LANGUAGES) {
    score[l] = words.reduce((n, w) => n + (SETS[l].has(w) || SETS[l].has(w.split("'").pop()) ? 1 : 0), 0);
    if (LETTERS[l]?.test(text)) score[l] += 2;
  }
  const ranked = LANGUAGES.slice().sort((a, b) => score[b] - score[a]);
  const [best, second] = ranked;
  if (score[best] < 2) return { lang: null, confident: false };
  return { lang: best, confident: score[best] - score[second] >= 2 };
}
