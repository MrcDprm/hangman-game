import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CATEGORIES, createPicker, loadWords, validateWords } from '../src/words.js';
import { ALPHABETS } from '../src/game.js';

/** Tarayıcıdaki fetch yerine dosyayı diskten okuyan sahte fetch. */
async function fakeFetch(url) {
  const text = await readFile(new URL(`../${url}`, import.meta.url), 'utf8');
  return { ok: true, json: async () => JSON.parse(text) };
}

for (const lang of ['tr', 'en']) {
  test(`${lang}: 10 kategori, her birinde 100 geçerli kelime, hiç tekrar yok`, async () => {
    const words = await loadWords(lang, fakeFetch);
    assert.deepEqual(Object.keys(words), CATEGORIES);

    const all = [];
    for (const category of CATEGORIES) {
      assert.equal(words[category].length, 100, category);
      for (const word of words[category]) {
        assert.ok([...word].every((ch) => ALPHABETS[lang].includes(ch)), `${category}: ${word}`);
      }
      all.push(...words[category]);
    }
    assert.equal(new Set(all).size, all.length, 'bir kelime birden fazla yerde geçiyor');
  });
}

test('geçersiz veri ayıklanır', () => {
  const words = validateWords({ animals: ['cat', 'Dog', 'ox', 'kedi', 42, 'çita'], bilinmeyen: ['x'], cities: 'paris' }, 'en');
  assert.deepEqual(words.animals, ['cat', 'kedi']);
  assert.deepEqual(words.cities, []);
  assert.equal('bilinmeyen' in words, false);
  assert.deepEqual(validateWords(null, 'tr').animals, []);
});

test('dosya yüklenemezse anlaşılır bir hata fırlatır', async () => {
  await assert.rejects(loadWords('tr', async () => ({ ok: false, status: 404 })), /yüklenemedi \(404\)/);
});

test('torba: bütün kelimeler çıkmadan tekrar yok, torba yenilenince art arda aynı kelime yok', () => {
  const words = ['a1', 'b2', 'c3', 'd4', 'e5'];
  for (let seed = 1; seed <= 50; seed++) {
    let value = seed;
    const random = () => {
      value = (value * 1103515245 + 12345) % 2147483648;
      return value / 2147483648;
    };
    const next = createPicker(words, random);
    const round1 = Array.from({ length: 5 }, next);
    assert.deepEqual([...round1].sort(), words);
    const round2First = next();
    assert.notEqual(round2First, round1.at(-1));
  }
});