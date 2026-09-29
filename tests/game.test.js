import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, guess, wordSlots, livesLeft, normalizeLetter, MAX_MISTAKES } from '../src/game.js';

/** Harfleri sırayla tahmin eder. */
function play(word, letters, lang = 'en') {
  return [...letters].reduce((state, letter) => guess(state, letter), createGame(word, lang));
}

test('doğru tahmin harfi açar, hak gitmez', () => {
  const state = play('cat', 'a');
  assert.deepEqual(wordSlots(state).map((slot) => slot.found), [false, true, false]);
  assert.equal(livesLeft(state), MAX_MISTAKES);
  assert.equal(state.status, 'playing');
});

test('yanlış tahmin bir hak götürür, eski durum değişmez', () => {
  const start = createGame('cat', 'en');
  const next = guess(start, 'z');
  assert.equal(next.mistakes, 1);
  assert.deepEqual(start.guessed, []);
});

test('aynı harf, geçersiz karakter ve boş girdi hak götürmez', () => {
  const state = play('cat', 'z');
  for (const input of ['z', 'Z', '1', '', 'ab', ' ', 'ç', null, undefined]) {
    assert.equal(guess(state, input), state, `girdi: ${input}`);
  }
});

test('bütün harfler bulununca kazanılır, sonra tahmin kabul edilmez', () => {
  const won = play('banana', 'bna');
  assert.equal(won.status, 'won');
  assert.equal(guess(won, 'x'), won);
});

test('6 yanlış tahminde kaybedilir', () => {
  const lost = play('cat', 'bdefgh');
  assert.equal(lost.status, 'lost');
  assert.equal(livesLeft(lost), 0);
  assert.equal(guess(lost, 'c'), lost);
});

test('Türkçede I küçük ı, İ küçük i olur; İngilizcede I küçük i olur', () => {
  assert.equal(normalizeLetter('I', 'tr'), 'ı');
  assert.equal(normalizeLetter('İ', 'tr'), 'i');
  assert.equal(normalizeLetter('I', 'en'), 'i');
  assert.equal(normalizeLetter('Ş', 'tr'), 'ş');
  assert.equal(normalizeLetter('ş', 'en'), null);

  // "ısparta": büyük I ile tahmin ı harfini açar, i harfini açmaz
  const state = guess(createGame('ısparta', 'tr'), 'I');
  assert.equal(wordSlots(state)[0].found, true);
  assert.equal(state.mistakes, 0);
  assert.equal(guess(state, 'i').mistakes, 1);
});