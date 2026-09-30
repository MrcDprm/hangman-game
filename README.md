# Hangman

**English** | [Türkçe](README.tr.md)

A hangman word game in plain HTML, CSS and JavaScript. Guess the hidden word letter by letter before the man is drawn. It has 1,000 Turkish and 1,000 English words in 10 categories.

**Live demo:** [hangman.miracdeprem.com](https://hangman.miracdeprem.com)

![Playing in English with a hint used](docs/screenshot-play.png)

## Features

- **10 categories, 2,000 words:** animals, countries, cities, food and drink, jobs, technology, sports, nature, home and science. Each category has 100 words in Turkish and 100 in English.
- **Guessing**
  - Use the on-screen keyboard or your own keyboard.
  - The alphabet follows the language: Turkish has 29 letters (ç, ğ, ı, ö, ş, ü), English has 26.
  - Turkish case rules are handled: with Caps Lock on, `I` counts as `ı` and `İ` as `i`.
- **Six lives:** each wrong guess draws a part of the man. Repeated letters, numbers and shortcuts like Ctrl+R never cost a life.
- **Help for hard words**
  - **Hint button:** reveals one hidden letter for a life, once per word. It is locked on the last life and when only one letter is left.
  - **Long words** start with one or two letters revealed (8–10 letters: 1, 11 or more: 2).
- **No repeats:** while the page is open, every word in a category is played once before any word comes back.
- **Stats:** wins, losses, current streak and best streak, kept after a page refresh.
- **Accessible**
  - Full keyboard play; Enter starts a new word when the round is over.
  - Screen readers hear the word pattern ("Word, 5 letters: C, R, A, blank, blank") and each key's state.
  - Respects the "reduce motion" system setting.
- **Turkish and English**, with a **dark and light theme** that match my [portfolio](https://www.miracdeprem.com).
- **Responsive:** two columns on desktop, one column on phones; long words always stay on one line.
- **Feedback:** a small button opens a form (name optional, email or phone, message) that sends straight to me through my portfolio site.

## Screenshots

| Win, light theme (Turkish) | Lose | Phone |
|---|---|---|
| ![Won round in Turkish with the light theme](docs/screenshot-light.png) | ![Lost round showing the word](docs/screenshot-lost.png) | ![Phone layout with a long word](docs/screenshot-mobile.png) |

## Tech Stack

- HTML, CSS, JavaScript (ES modules, no framework, no build step)
- Node.js built-in test runner (`node --test`), 21 unit tests
- Hosted on Vercel, with security headers (Content Security Policy)

## Installation

Play it online at [hangman.miracdeprem.com](https://hangman.miracdeprem.com), or run it locally:

```bash
git clone https://github.com/MrcDprm/hangman-game.git
cd hangman-game
python -m http.server 5173
```

Then open `http://localhost:5173`. The word lists are loaded with `fetch` and ES modules do not load from `file://`, so a local server is needed. Any static server works.

Run the tests (Node.js 20 or newer):

```bash
npm test
```

### Project structure

```
data/words-tr.json  Turkish words (10 categories × 100)
data/words-en.json  English words (10 categories × 100)
src/game.js         Game rules: guesses, lives, hint, win and loss
src/words.js        Loads and validates the word lists, picks words without repeats
src/storage.js      Settings and stats in localStorage, with validation
src/i18n.js         Turkish and English texts
src/theme.js        Theme switching
src/theme-init.js   Applies the saved theme before the first paint
src/main.js         Connects everything to the page
tests/              Unit tests for rules, word lists and storage
```

## What I Learned

- **Language-aware text.** `"I".toLowerCase()` gives `"i"`, but in Turkish the lowercase of `I` is `ı`. I used `toLocaleLowerCase('tr')` and `toLocaleUpperCase('tr')`, so guesses and the displayed word follow the rules of each language.
- **Loading data with `fetch`.** The word lists are JSON files that load only for the selected language. I used `async`/`await`, cached the loading promise so each file downloads once, and removed it from the cache when loading failed, so the next try downloads it again.
- **Not trusting data from files.** Every word is checked before use: only known categories, only letters of that language's alphabet, at least three letters. If the file cannot load, the player sees a plain message and the technical details stay in the developer console.
- **A fair shuffle.** Words come from a shuffled "bag" built with the Fisher–Yates shuffle, so every order is equally likely and no word repeats until the bag is empty. The bag lives inside a closure, so nothing outside can change it.
- **One path for every change.** A guess and a hint both return a new game state, and one `update` function takes care of saving stats and drawing the page. Passing functions around (`update(useHint)`) kept that code in one place.
- **Race conditions.** If the player switches language while words are still loading, the old request must not overwrite the new game. Checking the settings again after `await` fixed that.
- **Drawing with SVG and CSS.** Each part of the man is an SVG line with `pathLength="1"`, so one CSS transition "draws" every part the same way, whatever its real length.
- **Sizing from content.** Letter boxes use CSS container units and a `--letters` variable, so a 14-letter word fits on one line even on a small phone.

## Future Plans

- Difficulty by word length
- Two-player mode where one player enters the word
- More categories

## License

[MIT](LICENSE)
