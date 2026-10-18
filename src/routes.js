// Uygulamanın adresleri: her kategori kendi sayfasına sahip (/hayvanlar, /ulkeler …).
// Hem tarayıcı (main.js) hem sunucu fonksiyonu (api/page.js) kullanır; başlıklar iki tarafta aynı olur.
import { CATEGORIES } from './words.js';
import { translate } from './i18n.js';

export const ORIGIN = 'https://hangman.miracdeprem.com';

export const CATEGORY_SLUGS = {
  wild_animals: 'vahsi-hayvanlar',
  pets_farm: 'evcil-ve-ciftlik-hayvanlari',
  birds: 'kuslar',
  sea_life: 'deniz-canlilari',
  countries: 'ulkeler',
  capitals: 'baskentler',
  regions: 'iller',
  landforms: 'yeryuzu-sekilleri',
  fruits: 'meyveler',
  vegetables: 'sebzeler',
  dishes: 'yemekler',
  sports: 'spor-dallari',
  sports_gear: 'spor-ekipmanlari',
  furniture: 'mobilya',
  kitchen: 'mutfak-esyalari',
  clothes: 'giysiler',
  computer: 'bilgisayar-parcalari',
  elements: 'kimyasal-elementler',
  space: 'uzay',
  jobs: 'meslekler',
  body: 'vucudumuz',
};

const BY_SLUG = new Map(CATEGORIES.map((category) => [CATEGORY_SLUGS[category], category]));

export const categoryForSlug = (slug) => BY_SLUG.get(slug) ?? null;

/** "/hayvanlar" → "animals"; adresi olmayan yol için null. */
export function categoryFromPath(pathname) {
  return categoryForSlug(pathname.replace(/^\/+|\/+$/g, '').toLowerCase());
}

export const pathFor = (category) => (category ? `/${CATEGORY_SLUGS[category]}` : '/');

export const SITEMAP_PATHS = ['/', ...CATEGORIES.map(pathFor)];

const HOME = {
  tr: {
    title: 'Adam Asmaca Oyna – Ücretsiz Türkçe Kelime Oyunu | Miraç Deprem',
    description:
      'Ücretsiz adam asmaca oyunu: hayvanlardan uzaya 21 kategoride yaklaşık 1.000 Türkçe ve 1.000 İngilizce kelime, ipucu ve seri istatistikleri. Tarayıcıda hemen oyna, üyelik gerekmez.',
  },
  en: {
    title: 'Hangman Game – Play Free Online | Miraç Deprem',
    description:
      'Play hangman online for free: about 1,000 English and 1,000 Turkish words in 21 categories from animals to space, hints and win streaks. No sign-up, right in your browser.',
  },
};

/** Sekme başlığı ve açıklama. category boşsa ana sayfa metni döner. */
export function pageMeta(category, lang) {
  if (!category) return HOME[lang];
  const name = translate(lang, `cat_${category}`);
  return lang === 'en'
    ? {
        title: `Hangman: ${name} – Free Word Game`,
        description: `Play hangman with ${name.toLowerCase()}: guess the letters, use a hint and build a win streak. Free, no sign-up.`,
      }
    : {
        title: `Adam Asmaca: ${name} – Ücretsiz Kelime Oyunu`,
        description: `${name} kategorisinde adam asmaca oyna: harfleri tahmin et, ipucu kullan, serini büyüt. Ücretsiz, üyelik gerekmez.`,
      };
}
