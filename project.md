# Dişçi Hukuk Bürosu - Web Sitesi Proje Dokümantasyonu

> **Son Güncelleme:** 19.01.2026
> **Durum:** Canlı (Production Ready)
> **Versiyon:** 1.1.0

## 1. Proje Genel Bakış
Bu proje, **Dişçi Hukuk Bürosu** için geliştirilmiş, yüksek performanslı, SEO uyumlu ve yönetilebilir bir kurumsal web sitesidir. Modern web teknolojileri kullanılarak inşa edilmiş olup, statik site üretimi (SSG) mantığıyla çalışır. Bu sayede maksimum hız ve güvenlik sağlar.

## 2. Teknoloji Yığını (Tech Stack)
*   **Core Framework:** [Astro 5.x](https://astro.build) (Static Site Generator)
*   **UI Framework:** React (İnteraktif bileşenler için - örn: Blog Arama)
*   **Styling:** Tailwind CSS v4 + Global CSS Variabless
*   **CMS (İçerik Yönetimi):** [Keystatic](https://keystatic.com) (Git tabanlı, yerel modda çalışan admin paneli)
*   **İçerik Formatı:** MDX (Markdown + JSX)
*   **Hosting:** GitHub Pages (Statik Hosting)

## 3. Sistem Mimarisi ve Çalışma Mantığı

### 3.1. Hibrit İçerik Yönetimi (Keystatic)
Sistem, veritabanı gerektirmeyen **Dosya Tabanlı İçerik (File-based Content)** yapısını kullanır.
*   **Veri Kaynağı:** Tüm blog yazıları, `src/content/blog/` klasöründe `.mdx` dosyaları olarak saklanır.
*   **Admin Paneli:** `/keystatic` adresinde çalışan bir arayüz sunar. Bu panel, doğrudan yerel dosya sistemindeki `.mdx` dosyalarını okur ve yazar.
*   **Kısıtlama:** Site statik olarak host edildiği için (SSG), Admin Paneli **sadece yerel geliştirme ortamında (`localhost`)** çalışır. Canlı sitede `/keystatic` erişilemez.

### 3.2. Çalışma Akışı (Workflow)
İçerik eklemek veya güncellemek için aşağıdaki akış izlenir:
1.  **Başlatma:** Masaüstündeki `Admin_Panel_Baslat.bat` dosyası çalıştırılır.
2.  **Menü Seçimi:** `[1]` seçilerek Admin Paneli açılır.
3.  **Düzenleme:** Tarayıcıda (`http://localhost:4321/keystatic`) işlemler yapılır ve kaydedilir.
4.  **Kapatma:** Terminalde sunucuyu durdurmak için `CTRL+C` yapılır.
5.  **Yayınlama:** Menüden `[2]` seçilir. Program otomatik olarak değişiklikleri Git'e yükler ve siteyi günceller.

### 3.3. Görsel Yönetimi
*   Görseller `public/images/blog/` dizininde saklanır.
*   Admin panelinden yüklenen görseller otomatik olarak bu klasöre kaydedilir.

## 4. Tasarım Sistemi (Design System)

### 4.1. Renk Paleti (Gold & Dark Navy)
Proje, lüks ve güven veren bir hukuk bürosu kimliği için özel bir renk paleti kullanır.
*   **Ana Renk (Gold):** `#ab934d` (Vurgular, başlıklar, butonlar)
*   **Arkaplan:** `#020617` (Slate-950 - Koyu Lacivert/Siyah)
*   **Metin:** `text-slate-300` (Okunabilirlik için yumuşatılmış beyaz)

### 4.2. Tipografi
*   **Başlıklar (Serif):** `Playfair Display` (Zarif, otoriter görünüm).
*   **Gövde Metni (Sans):** `Inter` veya sistem fontları (Okunabilirlik odaklı).
*   **Tipografi Kuralları:** Blog yazılarında başlıklar (`h2`, `h3`) otomatik olarak `text-gold-500` rengini alır. Paragraflar ve listeler arasında optimum okuma boşlukları (`mb-6`) ayarlanmıştır.

## 5. Dosya Yapısı (Önemli Dizinler)

```
/
├── .astro/                 # Astro cache (git-ignored)
├── dist/                   # Production build çıktısı (git-ignored)
├── public/                 # Statik dosyalar
│   └── images/blog/        # Blog görselleri
├── src/
│   ├── components/         # Tekrar kullanılabilir UI parçaları (Hero, Footer vb.)
│   ├── content/
│   │   ├── blog/           # Blog yazıları (.mdx dosyaları buradadır)
│   │   └── config.ts       # İçerik şemaları (Zod validation)
│   ├── layouts/            # Sayfa şablonları (Layout.astro)
│   ├── pages/              # Sayfa rotaları (index, blog, iletisim vb.)
│   └── styles/
│       └── global.css      # Tailwind ve özel CSS ayarları
├── astro.config.mjs        # Astro konfigürasyonu (Keystatic entegrasyonu burada)
├── keystatic.config.ts     # Admin paneli şeması ve ayarları
└── package.json            # Bağımlılıklar
```

## 6. Sık Yapılan İşlemler

### Yeni Blog Yazısı Ekleme
1. `Admin_Panel_Baslat.bat`'ı çalıştır.
2. `http://localhost:4321/keystatic` adresine git.
3. "Makaleler" -> "Ekle" yolunu izle.
4. Başlık, Kategori, Yazar, Görsel ve İçeriği gir.
5. Kaydet ve Git'e gönder.

### Manuel Kod Düzenleme
*   Tasarım değişiklikleri için `global.css` veya ilgili `.astro` bileşeni düzenlenir.
*   Yeni sayfa eklemek için `src/pages/` altına `.astro` dosyası oluşturulur.
