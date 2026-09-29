// Ayarları ve istatistikleri tarayıcıda saklar.
// Okunan veriye güvenilmez: bozuk, eksik ya da beklenmeyen değer varsa varsayılan kullanılır.
import { CATEGORIES } from './words.js';

export const STORAGE_KEY = 'hangman-settings';
export const LANGUAGES = ['tr', 'en'];
export const THEMES = ['dark', 'light'];
export const EMPTY_STATS = Object.freeze({ wins: 0, losses: 0, streak: 0, bestStreak: 0 });

/** Gizli sekmede ya da çerezler engelliyken localStorage'a erişmek bile hata fırlatabilir. */
function browserStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function readJson(storage) {
  try {
    return JSON.parse(storage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

const oneOf = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
const count = (value) => (Number.isSafeInteger(value) && value >= 0 ? value : 0);

export function loadSettings(storage = browserStorage(), fallbackLang = 'tr') {
  const saved = readJson(storage);
  const stats = saved.stats ?? {};
  return {
    lang: oneOf(saved.lang, LANGUAGES, fallbackLang),
    theme: oneOf(saved.theme, THEMES, 'dark'),
    category: oneOf(saved.category, CATEGORIES, CATEGORIES[0]),
    // Sadece bilinen istatistik alanları alınır, her biri sayı olarak doğrulanır
    stats: Object.fromEntries(Object.keys(EMPTY_STATS).map((key) => [key, count(stats[key])])),
  };
}

/** Sadece bilinen alanlar yazılır. Kaydedilemezse (depolama dolu/kapalı) oyun yine çalışır. */
export function saveSettings(settings, storage = browserStorage()) {
  const { lang, theme, category, stats } = settings;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ lang, theme, category, stats }));
    return true;
  } catch {
    return false;
  }
}

/** Oyun sonucunu istatistiğe işler ve yeni bir nesne döndürür: kazanınca seri artar, kaybedince sıfırlanır. */
export function recordResult(stats, won) {
  const streak = won ? stats.streak + 1 : 0;
  return {
    wins: stats.wins + (won ? 1 : 0),
    losses: stats.losses + (won ? 0 : 1),
    streak,
    bestStreak: Math.max(stats.bestStreak, streak),
  };
}