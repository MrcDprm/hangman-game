// Oyun kuralları: harf tahmini, kalan hak, ipucu, kazanma ve kaybetme. Arayüzden bağımsızdır; tarayıcı olmadan test edilir.

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

/** Uzun kelimelerde baştan açık gelen harf sayısı: 8-10 harfte 1, 11 ve üstünde 2. */
export function givenLetterCount(word) {
  const length = [...word].length;
  if (length >= 11) return 2;
  if (length >= 8) return 1;
  return 0;
}

/** Kelimede henüz açılmamış harfler (her harf bir kez). */
export function hiddenLetters(state) {
  return [...new Set(state.word)].filter((letter) => !state.guessed.includes(letter));
}

const pick = (items, random) => items[Math.floor(random() * items.length)];

/**
 * Yeni oyun. status: 'playing', 'won' ya da 'lost'.
 * Uzun kelimelerde bir iki harf baştan açılır; en az iki farklı harf her zaman gizli kalır.
 */
export function createGame(word, lang, random = Math.random) {
  const guessed = [];
  for (let i = 0; i < givenLetterCount(word); i++) {
    const hidden = [...new Set(word)].filter((letter) => !guessed.includes(letter));
    if (hidden.length <= 2) break;
    guessed.push(pick(hidden, random));
  }
  return { word, lang, guessed, given: guessed.length, mistakes: 0, status: 'playing', hintLetter: null };
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

/**
 * İpucu kelime başına bir kez kullanılır. Son hakta kullanılamaz (oyuncuyu kaybettirmesin)
 * ve tek gizli harf kaldığında kullanılamaz (oyunu ipucu kazanmasın).
 */
export function canUseHint(state) {
  return state.status === 'playing' && state.hintLetter === null && livesLeft(state) > 1 && hiddenLetters(state).length > 1;
}

/** Gizli harflerden birini açar, karşılığında bir hak gider. */
export function useHint(state, random = Math.random) {
  if (!canUseHint(state)) return state;
  const letter = pick(hiddenLetters(state), random);
  return { ...state, guessed: [...state.guessed, letter], mistakes: state.mistakes + 1, hintLetter: letter };
}

/** Kelimenin harfleri ve her birinin bulunup bulunmadığı (ekrandaki kutular için). */
export function wordSlots(state) {
  return [...state.word].map((letter) => ({ letter, found: state.guessed.includes(letter) }));
}

export function livesLeft(state) {
  return MAX_MISTAKES - state.mistakes;
}