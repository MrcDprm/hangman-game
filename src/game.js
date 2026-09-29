// Oyun kuralları: harf tahmini, kalan hak, kazanma ve kaybetme. Arayüzden bağımsızdır; tarayıcı olmadan test edilir.

export const MAX_MISTAKES = 6;

export const ALPHABETS = {
  tr: [...'abcçdefgğhıijklmnoöprsştuüvyz'],
  en: [...'abcdefghijklmnopqrstuvwxyz'],
};

/**
 * Girilen karakteri o dilin küçük harfine çevirir; alfabede yoksa null döner.
 * Türkçede büyük I'nın küçüğü ı, büyük İ'nin küçüğü i'dir; bu yüzden dile göre çevrilir.
 */
export function normalizeLetter(input, lang) {
  if (typeof input !== 'string' || [...input].length !== 1) return null;
  const letter = input.toLocaleLowerCase(lang);
  return ALPHABETS[lang].includes(letter) ? letter : null;
}

/** Yeni oyun. status: 'playing', 'won' ya da 'lost'. */
export function createGame(word, lang) {
  return { word, lang, guessed: [], mistakes: 0, status: 'playing' };
}

/**
 * Tahmini uygular ve YENİ bir durum döndürür (eski durum değişmez).
 * Geçersiz karakter, tekrar tahmin ya da bitmiş oyunda aynı durum geri döner; hak gitmez.
 */
export function guess(state, input) {
  const letter = normalizeLetter(input, state.lang);
  if (state.status !== 'playing' || letter === null || state.guessed.includes(letter)) return state;

  const guessed = [...state.guessed, letter];
  const mistakes = state.word.includes(letter) ? state.mistakes : state.mistakes + 1;

  let status = 'playing';
  if ([...state.word].every((ch) => guessed.includes(ch))) status = 'won';
  else if (mistakes >= MAX_MISTAKES) status = 'lost';

  return { ...state, guessed, mistakes, status };
}

/** Kelimenin harfleri ve her birinin bulunup bulunmadığı (ekrandaki kutular için). */
export function wordSlots(state) {
  return [...state.word].map((letter) => ({ letter, found: state.guessed.includes(letter) }));
}

export function livesLeft(state) {
  return MAX_MISTAKES - state.mistakes;
}