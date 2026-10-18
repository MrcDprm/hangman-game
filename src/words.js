// Kelime listeleri: dile göre data/ klasöründen yüklenir, kategoriden tekrarsız kelime seçilir.
import { ALPHABETS } from './game.js';

export const CATEGORIES = ['wild_animals', 'pets_farm', 'birds', 'sea_life', 'countries', 'capitals', 'regions', 'landforms', 'fruits', 'vegetables', 'dishes', 'sports', 'sports_gear', 'furniture', 'kitchen', 'clothes', 'computer', 'elements', 'space', 'jobs', 'body'];

// Seçim kutusundaki gruplar (sıra ekrandaki sıradır)
export const CATEGORY_GROUPS = [
  { id: 'animals', categories: ['wild_animals', 'pets_farm', 'birds', 'sea_life'] },
  { id: 'places', categories: ['countries', 'capitals', 'regions', 'landforms'] },
  { id: 'food', categories: ['fruits', 'vegetables', 'dishes'] },
  { id: 'sport', categories: ['sports', 'sports_gear'] },
  { id: 'home', categories: ['furniture', 'kitchen', 'clothes'] },
  { id: 'science', categories: ['computer', 'elements', 'space'] },
  { id: 'people', categories: ['jobs', 'body'] },
];

/** Kelime dosyasını indirir ve doğrular. fetchFn testlerde sahtesiyle değiştirilebilir. */
export async function loadWords(lang, fetchFn = fetch) {
  const response = await fetchFn(`/data/words-${lang}.json`);
  if (!response.ok) throw new Error(`words-${lang}.json yüklenemedi (${response.status})`);
  return validateWords(await response.json(), lang);
}

/**
 * Dosyadan gelen veriye güvenilmez: sadece bilinen kategoriler ve
 * o dilin alfabesindeki harflerden oluşan, en az 3 harfli kelimeler alınır.
 */
export function validateWords(data, lang) {
  const alphabet = ALPHABETS[lang];
  const result = {};
  for (const category of CATEGORIES) {
    const words = Array.isArray(data?.[category]) ? data[category] : [];
    result[category] = words.filter(
      (word) => typeof word === 'string' && word.length >= 3 && [...word].every((ch) => alphabet.includes(ch)),
    );
  }
  return result;
}

/**
 * Karıştırılmış torba: kelimeler karıştırılıp sırayla çekilir, torba boşalınca yeniden karıştırılır.
 * Böylece kategorideki bütün kelimeler oynanmadan aynı kelime tekrar gelmez.
 */
export function createPicker(words, random = Math.random) {
  let bag = [];
  let last = null;
  return function next() {
    if (bag.length === 0) {
      bag = shuffle(words, random);
      // Yeni torbanın ilk kelimesi bir önceki torbanın son kelimesiyle aynı olmasın
      if (bag.length > 1 && bag.at(-1) === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    last = bag.pop();
    return last;
  };
}

/** Fisher-Yates karıştırma: her sıralama eşit olasılıkla çıkar. Orijinal dizi değişmez. */
function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}