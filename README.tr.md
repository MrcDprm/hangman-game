# Adam Asmaca (Hangman)

[English](README.md) | **Türkçe**

Sade HTML, CSS ve JavaScript ile yazılmış bir adam asmaca oyunu. Gizli kelimeyi, adam tamamen çizilmeden harf harf tahmin et. 21 dar kategoride yaklaşık 1.000 Türkçe ve 1.000 İngilizce kelime var; neyi tahmin ettiğini her zaman bilirsin.

**Canlı demo:** [hangman.miracdeprem.com](https://hangman.miracdeprem.com)

![İpucu kullanılmış İngilizce bir oyun](docs/screenshot-play.png)

## Özellikler

- **7 grupta 21 kategori, yaklaşık 2.000 kelime:** hayvanlar (vahşi hayvanlar, evcil ve çiftlik hayvanları, kuşlar, deniz canlıları), yerler (ülkeler, başkentler, Türkiye'nin illeri / ABD eyaletleri, yeryüzü şekilleri), yiyecek (meyveler, sebzeler, Türk mutfağı / dünya yemekleri), spor (spor dalları, spor ekipmanları), ev (mobilya, mutfak eşyaları, giysiler), bilim (bilgisayar parçaları, kimyasal elementler, uzay) ve insan (meslekler, vücudumuz). Her kategoride dil başına 39 ile 100 arasında kelime var.
- **Tahmin**
  - Ekrandaki klavyeyle ya da kendi klavyenle tahmin edersin.
  - Alfabe dile göre değişir: Türkçede 29 harf (ç, ğ, ı, ö, ş, ü), İngilizcede 26 harf var.
  - Türkçe büyük-küçük harf kuralları doğru işlenir: Caps Lock açıkken `I` harfi `ı`, `İ` harfi `i` sayılır.
- **6 hak:** Her yanlış tahminde adamın bir parçası çizilir. Aynı harfi tekrar basmak, rakam ya da Ctrl+R gibi kısayollar hak götürmez.
- **Zor kelimeler için yardım**
  - **İpucu butonu:** Bir hak karşılığında gizli bir harf açar, kelime başına bir kez kullanılır. Son hakta ve tek harf kaldığında kilitlenir.
  - **Her kelime** bazı harfleri açık başlar (3-6 harf: 1, 7-10: 2, 11 ve üstü: 3); en az iki farklı harf her zaman gizli kalır.
- **Tekrarsız kelime:** Sayfa açık kaldığı sürece kategorideki her kelime bir kez oynanmadan hiçbir kelime tekrar gelmez.
- **İstatistikler:** Galibiyet, mağlubiyet, seri ve en iyi seri; sayfa yenilense de korunur.
- **Erişilebilir**
  - Tamamen klavyeyle oynanabilir; tur bitince Enter yeni kelime getirir.
  - Ekran okuyucu kelimenin durumunu ("Kelime, 5 harf: C, R, A, boş, boş") ve her tuşun durumunu okur.
  - Sistemdeki "hareketi azalt" ayarına uyar.
- **Her kategorinin kendi adresi:** örneğin [/kuslar](https://hangman.miracdeprem.com/kuslar) ya da [/meslekler](https://hangman.miracdeprem.com/meslekler) oyunu o kategoride açar; Türkçe ya da İngilizce (`?lang=en`).
- **Türkçe ve İngilizce**, [portfolyo sitemle](https://www.miracdeprem.com) uyumlu **koyu ve açık tema**.
- **Duyarlı tasarım:** Masaüstünde iki sütun, telefonda tek sütun; uzun kelimeler her zaman tek satırda kalır.
- **Geri bildirim:** Küçük bir düğme; ad (isteğe bağlı), e-posta ya da telefon ve mesaj içeren formu açar. Mesaj portfolyo sitem üzerinden doğrudan bana ulaşır.

## Ekran Görüntüleri

| Kazanma, açık tema (Türkçe) | Kaybetme | Telefon |
|---|---|---|
| ![Açık temada kazanılmış Türkçe bir tur](docs/screenshot-light.png) | ![Kelimeyi gösteren kaybetme ekranı](docs/screenshot-lost.png) | ![Uzun kelimeyle telefon görünümü](docs/screenshot-mobile.png) |

## Kullanılan Teknolojiler

- HTML, CSS, JavaScript (ES modülleri, framework yok, derleme adımı yok)
- Node.js'in yerleşik test aracı (`node --test`), 21 birim testi
- Yayın: Vercel, güvenlik başlıklarıyla (Content Security Policy)

## Kurulum ve Çalıştırma

[hangman.miracdeprem.com](https://hangman.miracdeprem.com) adresinden çevrim içi oynayabilir ya da kendi bilgisayarında çalıştırabilirsin:

```bash
git clone https://github.com/MrcDprm/hangman-game.git
cd hangman-game
npm run dev
```

Sonra `http://localhost:5175` adresini aç. Küçük geliştirme sunucusu (Node.js 20 veya üstü) dosyaları sunar, canlı sitedeki güvenlik başlıklarını ekler ve `/kuslar` gibi adresleri Vercel'deki gibi karşılar.

Testleri çalıştırmak için (Node.js 20 veya üstü):

```bash
npm test
```

### Proje yapısı

```
data/words-tr.json  Türkçe kelimeler (21 kategori)
data/words-en.json  İngilizce kelimeler (21 kategori)
src/game.js         Oyun kuralları: tahmin, hak, ipucu, kazanma ve kaybetme
src/words.js        Kelime listelerini yükler ve doğrular, tekrarsız kelime seçer
src/storage.js      Ayarlar ve istatistikler (localStorage, doğrulamalı)
src/i18n.js         Türkçe ve İngilizce metinler
src/theme.js        Tema değiştirme
src/theme-init.js   Kayıtlı temayı sayfa çizilmeden önce uygular
src/main.js         Hepsini sayfaya bağlar
tests/              Kurallar, kelime listeleri ve kayıt için birim testleri
```

## Öğrendiklerim

- **Dile göre metin işlemek.** `"I".toLowerCase()` sonucu `"i"`, ama Türkçede `I` harfinin küçüğü `ı`. `toLocaleLowerCase('tr')` ve `toLocaleUpperCase('tr')` kullanarak tahminlerin ve ekrandaki kelimenin her dilin kurallarına uymasını sağladım.
- **`fetch` ile veri yüklemek.** Kelime listeleri sadece seçilen dil için yüklenen JSON dosyaları. `async`/`await` kullandım. Yükleme işlemini (Promise) önbellekte tuttum, böylece her dosya bir kez indiriliyor. Yükleme başarısız olursa kaydı önbellekten sildim, bir sonraki denemede dosya yeniden indiriliyor.
- **Dosyadan gelen veriye güvenmemek.** Her kelime kullanılmadan önce kontrol ediliyor: sadece bilinen kategoriler, sadece o dilin alfabesindeki harfler, en az üç harf. Dosya yüklenemezse oyuncu sade bir mesaj görüyor, teknik ayrıntı geliştirici konsolunda kalıyor.
- **Adil karıştırma.** Kelimeler Fisher-Yates karıştırmasıyla hazırlanan bir "torbadan" çekiliyor. Her sıralama eşit olasılıkla çıkıyor ve torba boşalmadan hiçbir kelime tekrar gelmiyor. Torba bir closure'ın içinde duruyor, dışarıdan değiştirilemiyor.
- **Her değişiklik için tek yol.** Tahmin de ipucu da yeni bir oyun durumu döndürüyor. İstatistik kaydını ve ekranı çizmeyi tek bir `update` fonksiyonu yapıyor. Fonksiyonları parametre olarak geçirmek (`update(useHint)`) bu kodu tek yerde tuttu.
- **Yarış durumu (race condition).** Kelimeler yüklenirken oyuncu dil değiştirirse eski istek yeni oyunun üstüne yazmamalı. `await` sonrasında ayarları yeniden kontrol ederek bunu çözdüm.
- **SVG ve CSS ile çizim.** Adamın her parçası `pathLength="1"` verilmiş bir SVG çizgisi. Böylece tek bir CSS geçişi, gerçek uzunluğu ne olursa olsun her parçayı aynı şekilde "çiziyor".
- **İçeriğe göre boyutlandırma.** Harf kutuları CSS container birimleri ve bir `--letters` değişkeniyle boyutlanıyor. 14 harflik bir kelime küçük bir telefonda bile tek satıra sığıyor.

## Lisans

[MIT](LICENSE)
