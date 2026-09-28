# Adam Asmaca (Hangman)

[English](README.md) | **Türkçe**

Sade HTML, CSS ve JavaScript ile yazılmış, Türkçe ve İngilizce kelime kategorileri olan bir adam asmaca oyunu.

> Geliştirme sürüyor. Aşağıdaki plan, proje v1.0'a ulaştığında tam README'ye dönüşecek.

## Özellikler (plan)

**MVP**
- [ ] Kelime kategorileri (hayvanlar, ülkeler, yiyecekler, meslekler, teknoloji); Türkçe ve İngilizce için ayrı kelime listeleri
- [ ] Harfler ekrandaki klavyeyle ya da bilgisayar klavyesiyle tahmin edilir; alfabe dile göre değişir (Türkçede ç, ğ, ı, ö, ş, ü var)
- [ ] 6 yanlış tahmin hakkı; adam adım adım çizilir ve kalan hak gösterilir
- [ ] Kazanma ve kaybetme ekranı, kelime gösterilir
- [ ] Kategorideki bütün kelimeler oynanmadan aynı kelime tekrar gelmez
- [ ] Galibiyet, mağlubiyet ve seri sayısı; sayfa yenilense de korunur
- [ ] Türkçe ve İngilizce arayüz, portfolyo sitemle uyumlu koyu ve açık tema
- [ ] Klavyeyle oynama ve ekran okuyucu duyuruları, telefon ve masaüstüne uyumlu tasarım
- [ ] Oyun mantığı ayrı modüllerde, Node'un yerleşik test aracıyla test edilir
- [ ] Vercel'de yayında

**Sonra eklenecekler**
- İpucu butonu (bir hak karşılığında bir harf açar)
- Kelime uzunluğuna göre zorluk
- Bir oyuncunun kelimeyi girdiği iki kişilik mod

## Kullanılan Teknolojiler

- HTML, CSS, JavaScript (ES modülleri, framework yok, derleme adımı yok)
- Birim testleri için `node --test`
- Yayın için Vercel
