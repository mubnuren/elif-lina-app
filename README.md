# Elif Lina - Günlük Sorumluluk Programı

Elif Lina için hazırlanmış çocuk dostu günlük sorumluluk, yıldız, rozet, ödül ve ebeveyn takip uygulamasının deploy'a hazır MVP sürümüdür.

## İçerik

- Çocuk girişi ve ebeveyn girişi
- Günlük görev takibi
- Görev tamamlama / yıldız kazanma
- Ebeveyn panelinden görev ekleme, düzenleme ve silme
- Ödül ekleme, düzenleme ve silme
- Rozetler ve başarılar ekranı
- Mini oyun ekranları
- Macera haritası
- Haftalık takip ve performans grafiği
- Profil ve ayarlar ekranı
- Tarayıcı localStorage kayıt sistemi
- Mobil uyumlu responsive tasarım
- PWA manifest dosyası
- Vercel deploy ayarı
- Standalone HTML önizleme dosyası

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda Vite'ın verdiği yerel adresi açın.

## Yayına alma

Vercel için hazırdır.

```bash
npm run build
```

Vercel ayarları:

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Detaylı anlatım için `DEPLOYMENT.md` dosyasına bakın.

## Kullanım notu

Bu sürüm MVP prototiptir. Veriler şimdilik tarayıcı hafızasında tutulur. Gerçek kullanıcı hesabı, veritabanı, bildirim, çoklu çocuk profili ve gerçek mini oyun mekanikleri sonraki fazda eklenebilir.
