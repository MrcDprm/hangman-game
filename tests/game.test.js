import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame, guess, wordSlots, livesLeft, normalizeLetter, hiddenLetters, canUseHint, useHint, MAX_MISTAKES,
} from '../src/game.js';

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


test('uzun kelimelerde harf açık gelir: 8-10 harfte 1, 11 ve üstünde 2, kısa kelimede yok', () => {
  assert.equal(createGame('cat', 'en').guessed.length, 0);
  const medium = createGame('elephant', 'en'); // 8 harf
  assert.equal(medium.given, 1);
  assert.ok(wordSlots(medium).some((slot) => slot.found));
  const long = createGame('afyonkarahisar', 'tr'); // 14 harf
  assert.equal(long.given, 2);
  assert.equal(long.mistakes, 0);
  assert.equal(long.status, 'playing');
});

test('açık gelen harfler kelimeyi asla bitirmez, en az iki farklı harf gizli kalır', () => {
  // 11 harf ama sadece 3 farklı harf: en fazla 1 harf açılabilir
  const state = createGame('aaaabbbbccc', 'en');
  assert.equal(state.given, 1);
  assert.equal(hiddenLetters(state).length, 2);
});

test('ipucu gizli bir harfi açar, bir hak götürür ve kelime başına bir kez kullanılır', () => {
  const start = createGame('cat', 'en');
  const hinted = useHint(start, () => 0);
  assert.equal(hinted.hintLetter, 'c');
  assert.equal(hinted.mistakes, 1);
  assert.equal(wordSlots(hinted)[0].found, true);
  assert.equal(canUseHint(hinted), false);
  assert.equal(useHint(hinted), hinted);
});

test('ipucu son hakta ve tek gizli harf kalınca kullanılamaz', () => {
  const lastLife = play('cat', 'bdefg');
  assert.equal(livesLeft(lastLife), 1);
  assert.equal(canUseHint(lastLife), false);

  const oneHidden = play('cat', 'ca');
  assert.equal(canUseHint(oneHidden), false);
  assert.equal(useHint(oneHidden), oneHidden);
});
