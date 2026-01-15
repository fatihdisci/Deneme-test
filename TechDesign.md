# Technical Design Document - Discilaw

## 1. Teknoloji Yığını
- **Framework:** Astro v5 (SSG - Statik Site Üretimi).
- **CSS:** Tailwind CSS + @tailwindcss/typography.
- **Bileşenler:** Astro Bileşenleri (.astro).
- **Animasyon:** AOS (Animate On Scroll).
- **Yayınlama:** GitHub Actions üzerinden GitHub Pages.

## 2. Veri Yapısı (Blog Şeması)
Makaleler `src/content/blog` klasöründe tutulacak. Her makale şu bilgileri içermelidir:
- Başlık (Title)
- Açıklama (Description)
- Yayın Tarihi (pubDate)
- Kategori (category: Ceza, Bilişim, İdare, Aile, Borçlar)
- Etiketler (tags: dizi şeklinde)
- Kapak Görseli (image)

## 3. Yönlendirme (Routing)
- `/blog/[slug]` yapısı ile her makale benzersiz bir URL'ye sahip olacak.