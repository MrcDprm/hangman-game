// Arayüz: kategori, kelime kutuları, ekran klavyesi, adam çizimi ve istatistikler. Oyun kuralları game.js'te.
import { ALPHABETS, MAX_MISTAKES, canUseHint, createGame, guess, livesLeft, useHint, wordSlots } from './game.js';
import { CATEGORIES, createPicker, loadWords } from './words.js';
import { EMPTY_STATS, loadSettings, recordResult, saveSettings } from './storage.js';
import { translate } from './i18n.js';
import { applyTheme, nextTheme } from './theme.js';

const browserLang = navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
const settings = loadSettings(undefined, browserLang);

const el = {
  category: document.getElementById('category'),
  figure: document.getElementById('figure'),
  parts: document.querySelectorAll('.figure .part'),
  livesDots: document.getElementById('lives-dots'),
  livesText: document.getElementById('lives-text'),
  word: document.getElementById('word'),
  status: document.getElementById('status'),
  keyboard: document.getElementById('keyboard'),
  newWord: document.getElementById('new-word'),
  hint: document.getElementById('hint'),
  resetStats: document.getElementById('reset-stats'),
  themeToggle: document.getElementById('theme-toggle'),
  langButtons: document.querySelectorAll('[data-lang]'),
  stats: {
    wins: document.getElementById('stat-wins'),
    losses: document.getElementById('stat-losses'),
    streak: document.getElementById('stat-streak'),
    bestStreak: document.getElementById('stat-best'),
  },
};

const wordLists = new Map(); // dil -> kelime listesi yükleme işlemi (Promise), her dil bir kez indirilir
const pickers = new Map(); // "dil:kategori" -> tekrarsız kelime seçici
let game = null; // kelimeler yüklenene kadar oyun yok
let loadFailed = false;

const t = (key, params) => translate(settings.lang, key, params);
const upper = (text) => text.toLocaleUpperCase(settings.lang);

// ---------- Oyun akışı ----------

function wordsFor(lang) {
  if (!wordLists.has(lang)) {
    const loading = loadWords(lang);
    wordLists.set(lang, loading);
    loading.catch(() => wordLists.delete(lang)); // başarısız olursa bir sonraki denemede yeniden indirilsin
  }
  return wordLists.get(lang);
}

async function newGame() {
  const { lang, category } = settings;
  game = null;
  loadFailed = false;
  render();
  try {
    const words = await wordsFor(lang);
    if (lang !== settings.lang || category !== settings.category) return; // bu arada ayar değişti, yeni istek zaten yolda
    if (words[category].length === 0) throw new Error(`boş kategori: ${category}`);

    const key = `${lang}:${category}`;
    if (!pickers.has(key)) pickers.set(key, createPicker(words[category]));
    game = createGame(pickers.get(key)(), lang);
  } catch (error) {
    console.error(error); // ayrıntı geliştirici konsolunda kalır, kullanıcıya sade mesaj gösterilir
    loadFailed = true;
  }
  render();
}

/** Tahmin ve ipucu aynı yoldan geçer: oyun durumunu değiştirir, bitince istatistiğe işler. */
function update(next) {
  if (!game) return;
  const before = game;
  game = next(game);
  if (game === before) return; // geçersiz, tekrar, izin verilmeyen ipucu ya da oyun bitmiş

  if (game.status !== 'playing') {
    settings.stats = recordResult(settings.stats, game.status === 'won');
    saveSettings(settings);
  }
  render();
}
// ---------- Çizim ----------

function render() {
  renderFigure();
  renderWord();
  renderKeyboard();
  renderHint();
  renderStats();
  el.status.textContent = statusText();
}

function renderFigure() {
  const mistakes = game?.mistakes ?? 0;
  el.parts.forEach((part, index) => part.classList.toggle('shown', index < mistakes));
  el.figure.classList.toggle('won', game?.status === 'won');
  el.figure.classList.toggle('lost', game?.status === 'lost');

  const lives = game ? livesLeft(game) : MAX_MISTAKES;
  el.livesDots.replaceChildren(
    ...Array.from({ length: MAX_MISTAKES }, (_, index) => {
      const dot = document.createElement('span');
      if (index >= lives) dot.className = 'lost';
      return dot;
    }),
  );
  el.livesText.textContent = lives === 1 ? t('livesOne') : t('lives', { lives });
}

function renderWord() {
  if (!game) {
    el.word.replaceChildren();
    el.word.removeAttribute('aria-label');
    return;
  }
  const slots = wordSlots(game);
  const lost = game.status === 'lost';
  el.word.style.setProperty('--letters', slots.length); // CSS kutu genişliğini buna göre hesaplar
  el.word.replaceChildren(
    ...slots.map(({ letter, found }) => {
      const slot = document.createElement('span');
      slot.className = found ? 'slot found' : lost ? 'slot missed' : 'slot';
      slot.textContent = found || lost ? upper(letter) : '';
      return slot;
    }),
  );
  const pattern = slots.map(({ letter, found }) => (found ? upper(letter) : t('blank'))).join(', ');
  el.word.setAttribute('aria-label', t('word', { count: slots.length, pattern }));
}

/** Klavye sadece dil değişince yeniden oluşturulur; tuşların durumu her çizimde güncellenir. */
function renderKeyboard() {
  if (el.keyboard.dataset.lang !== settings.lang) {
    el.keyboard.dataset.lang = settings.lang;
    el.keyboard.replaceChildren(
      ...ALPHABETS[settings.lang].map((letter) => {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'key';
        key.dataset.letter = letter;
        key.textContent = upper(letter);
        return key;
      }),
    );
  }

  const playing = game?.status === 'playing';
  for (const key of el.keyboard.children) {
    const { letter } = key.dataset;
    const used = game?.guessed.includes(letter) ?? false;
    const inWord = used && game.word.includes(letter);
    key.classList.toggle('correct', inWord);
    key.classList.toggle('wrong', used && !inWord);
    // disabled yerine aria-disabled: basılan tuş odağı kaybetmez, klavyeyle oynayan kişi yerinde kalır
    key.setAttribute('aria-disabled', String(used || !playing));
    key.setAttribute('aria-label', used ? t(inWord ? 'keyCorrect' : 'keyWrong', { letter: upper(letter) }) : upper(letter));
  }
}

function renderHint() {
  // disabled yerine aria-disabled: ipucu alındıktan sonra odak butonda kalır
  el.hint.setAttribute('aria-disabled', String(!game || !canUseHint(game)));
}

function renderStats() {
  for (const [name, node] of Object.entries(el.stats)) node.textContent = settings.stats[name];
}

function statusText() {
  if (loadFailed) return t('loadError');
  if (!game) return t('loading');
  if (game.status === 'won') return t('won', { word: upper(game.word) });
  if (game.status === 'lost') return t('lost', { word: upper(game.word) });

  if (game.guessed.length === game.given) return t('prompt'); // baştan açık gelen harfler tahmin sayılmaz
  const letter = game.guessed.at(-1);
  if (letter === game.hintLetter) return t('hinted', { letter: upper(letter) });
  return t(game.word.includes(letter) ? 'correct' : 'wrong', { letter: upper(letter) });
}

/** Dil değişince sabit metinler (data-i18n), kategori listesi ve dil düğmeleri güncellenir. */
function renderStatic() {
  document.documentElement.lang = settings.lang;
  document.title = t('pageTitle');
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-aria]')) node.setAttribute('aria-label', t(node.dataset.i18nAria));
  for (const button of el.langButtons) button.setAttribute('aria-pressed', String(button.dataset.lang === settings.lang));

  el.category.replaceChildren(
    ...CATEGORIES.map((category) => new Option(t(`cat_${category}`), category, false, category === settings.category)),
  );
}
// ---------- Olaylar ----------

el.keyboard.addEventListener('click', (event) => {
  const key = event.target.closest('.key');
  if (key && key.getAttribute('aria-disabled') !== 'true') update((state) => guess(state, key.dataset.letter));
});

// Bilgisayar klavyesi: harf tuşu tahmin eder; oyun bitmişken Enter yeni kelime getirir
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
  if (event.target.closest('select, input, textarea')) return;
  if (event.key === 'Enter') {
    if (game && game.status !== 'playing' && !event.target.closest('button')) newGame();
    return;
  }
  update((state) => guess(state, event.key));
});

el.category.addEventListener('change', () => {
  settings.category = el.category.value;
  saveSettings(settings);
  newGame();
});

el.newWord.addEventListener('click', newGame);
el.hint.addEventListener('click', () => update(useHint));

el.resetStats.addEventListener('click', () => {
  settings.stats = { ...EMPTY_STATS };
  saveSettings(settings);
  renderStats();
});

for (const button of el.langButtons) {
  button.addEventListener('click', () => {
    if (button.dataset.lang === settings.lang) return;
    settings.lang = button.dataset.lang;
    saveSettings(settings);
    renderStatic();
    newGame(); // kelime diğer dilden gelmeli
  });
}

el.themeToggle.addEventListener('click', () => {
  settings.theme = nextTheme(settings.theme);
  saveSettings(settings);
  applyTheme(settings.theme);
});

applyTheme(settings.theme);
renderStatic();
newGame();
