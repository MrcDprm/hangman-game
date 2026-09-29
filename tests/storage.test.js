import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSettings, saveSettings, recordResult, EMPTY_STATS, STORAGE_KEY } from '../src/storage.js';
import { MESSAGES, translate } from '../src/i18n.js';
import { CATEGORIES } from '../src/words.js';

/** localStorage yerine testte kullanılan basit sahte depo. */
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    data,
  };
}

test('kayıt yoksa varsayılan ayarlar gelir', () => {
  assert.deepEqual(loadSettings(fakeStorage(), 'en'), {
    lang: 'en',
    theme: 'dark',
    category: 'animals',
    stats: { wins: 0, losses: 0, streak: 0, bestStreak: 0 },
  });
});

test('kaydedilen ayarlar geri okunur, bilinmeyen alanlar yazılmaz', () => {
  const storage = fakeStorage();
  const settings = { lang: 'tr', theme: 'light', category: 'science', stats: { wins: 5, losses: 2, streak: 3, bestStreak: 4 } };
  assert.equal(saveSettings({ ...settings, extra: 'x' }, storage), true);
  assert.deepEqual(loadSettings(storage), settings);
  assert.equal(JSON.parse(storage.data[STORAGE_KEY]).extra, undefined);
});

test('bozuk ya da geçersiz kayıt varsayılana döner', () => {
  assert.equal(loadSettings(fakeStorage({ [STORAGE_KEY]: '{bozuk json' })).category, 'animals');
  const odd = { lang: 'de', theme: 'pink', category: 'uzay', stats: { wins: -1, losses: 1.5, streak: '9', hacked: 99 } };
  const settings = loadSettings(fakeStorage({ [STORAGE_KEY]: JSON.stringify(odd) }), 'tr');
  assert.deepEqual(settings, { lang: 'tr', theme: 'dark', category: 'animals', stats: { ...EMPTY_STATS } });
  assert.equal(loadSettings(fakeStorage({ [STORAGE_KEY]: '42' })).theme, 'dark');
});

test('depolama erişilemezse hata fırlatmaz', () => {
  const broken = {
    getItem: () => {
      throw new Error('SecurityError');
    },
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
  };
  assert.equal(loadSettings(broken).theme, 'dark');
  assert.equal(saveSettings(loadSettings(broken), broken), false);
  assert.equal(loadSettings(null).lang, 'tr');
});

test('kazanınca seri artar, kaybedince sıfırlanır, en iyi seri korunur', () => {
  let stats = { ...EMPTY_STATS };
  for (const won of [true, true, true, false, true]) stats = recordResult(stats, won);
  assert.deepEqual(stats, { wins: 4, losses: 1, streak: 1, bestStreak: 3 });
});

test('iki dilde de aynı metin anahtarları var, her kategorinin adı var', () => {
  assert.deepEqual(Object.keys(MESSAGES.en).sort(), Object.keys(MESSAGES.tr).sort());
  for (const category of CATEGORIES) assert.ok(`cat_${category}` in MESSAGES.tr, category);
  assert.equal(translate('en', 'won', { word: 'CAT' }), 'You won! The word was CAT.');
});