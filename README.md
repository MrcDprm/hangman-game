# Hangman

**English** | [Türkçe](README.tr.md)

A hangman word game in plain HTML, CSS and JavaScript, with word categories in Turkish and English.

> Work in progress. The plan below will become the full README when the project reaches v1.0.

## Features (plan)

**MVP**
- [ ] 10 word categories with 100 words each (animals, countries, cities, food and drink, professions, technology, sports, nature, home, science), with separate Turkish and English lists: 2,000 words in total
- [ ] Guess letters with the on-screen keyboard or the physical keyboard; the alphabet follows the language (Turkish has ç, ğ, ı, ö, ş, ü)
- [ ] Six wrong guesses allowed; the hangman is drawn step by step and remaining lives are shown
- [ ] Win and lose screens that reveal the word
- [ ] Hint button: reveals one hidden letter for a life, once per word
- [ ] Long words start with one or two letters revealed (8–10 letters: 1, 11+: 2)
- [ ] No repeated words until every word in the category has been played
- [ ] Wins, losses and current streak, kept after a page refresh
- [ ] Turkish and English interface, dark and light theme matching my portfolio
- [ ] Keyboard play and screen-reader announcements, responsive layout
- [ ] Game logic in separate modules, tested with Node's built-in test runner
- [ ] Deployed on Vercel

**Later**
- Difficulty by word length
- Two-player mode where one player enters the word

## Tech Stack

- HTML, CSS, JavaScript (ES modules, no framework, no build step)
- `node --test` for unit tests
- Vercel for hosting
