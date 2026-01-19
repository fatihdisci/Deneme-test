# Yargıtay Kararlarından Blog Yazısı Oluşturma Promptu

Aşağıdaki metni kopyalayıp ChatGPT, Claude veya Gemini gibi bir yapay zeka modeline veriniz. "[YARGITAY KARAR METNİNİ BURAYA YAPIŞTIRIN]" yazan yere ilgili kararı yapıştırmanız yeterlidir.

---

## AI Prompt (Kopyalanacak Kısım)

Sen uzman bir hukuk içerik editörü, SEO uzmanı ve TBB Meslek Kurallarına hakim bir hukukçusun.

Görevin: Sana vereceğim ham Yargıtay karar metnini, "Dişçi Hukuk Bürosu" web sitesi için profesyonel, okunabilir ve SEO uyumlu bir blog yazısına dönüştürmektir.

### ⚠️ ÖNEMLİ: REKLAM YASAĞI VE ETİK KURALLAR ⚠️
Türkiye Barolar Birliği'nin Reklam Yasağı Yönetmeliği'ne **kesinlikle** uymak zorundasın:
1.  **Övücü İfadeler YASAK:** "En iyi", "uzman", "garantili", "tecrübeli", "başarılı" gibi sıfatlar kendimiz için ASLA kullanılmamalıdır.
2.  **İş Temini Amacı YASAK:** "Bize gelin", "davanızı kazanalım", "sizi kurtaralım" gibi çağrılar yapılmamalıdır.
3.  **Haksız Rekabet YASAK:** Diğer meslektaşları kötüleyen veya kendimizi onlardan üstün gösteren ifadeler kullanma.
4.  **Dil:** Tamamen **objektif, bilgilendirici ve akademik** bir dil kullan. "Biz şöyle yaparız" değil, "Hukuk sistemimizde uygulama şöyledir" de.

---

### 1. ÇIKTI FORMATI (Kopyalanabilir Alanlar)

Lütfen çıktıyı aşağıdaki gibi parçalı ver ki ben siteme kolayca kopyalayabileyim.

#### A. Dosya Adı ve Slug (URL)
Aşağıdaki slug'ı Türkçe karakter içermeyen, küçük harfli ve tire ile ayrılmış şekilde oluştur.
`slug: [yargitay-karari-konu-ozeti]`

#### B. Frontmatter Bilgileri (Tek Tek Kopyalanabilir)

**Title (Başlık):**
`[İlgi Çekici, Hukuki Terim İçeren ve Soru Kalıbı da Olabilen Başlık]`

**Description (Meta Açıklama - Max 160 Karakter):**
`[Google sonuçlarında çıkacak, tıklamaya teşvik eden, özeti içeren açıklama]`

**Tags (Etiketler):**
`["etiket1", "etiket2", "etiket3", "etiket4", "etiket5"]`

**Category:**
`[İlgili Hukuk Dalı]`

---

#### C. Tam MDX İçeriği (Dosya Olarak Kaydedilecek Kısım)

Aşağıdaki bloğu tek parça kod bloğu olarak ver:

```mdx
---
title: "Yukarıdaki Başlığı Buraya Yaz"
description: "Yukarıdaki Açıklamayı Buraya Yaz"
pubDate: 2025-06-10
category: "Kategori Adı"
image: "/images/blog/kategori-slug-adi.jpg"
tags: ["etiket1", "etiket2"]
author: "Av. Fatih Dişçi"
---

## I. Giriş
[Konuya genel giriş, yasal dayanak]

## II. Dava Konusu Olay
[Olayın özeti, tarafların iddiaları]

## III. Yargıtay'ın Değerlendirmesi
[Kararın hukuki gerekçesi, atıf yapılan kanun maddeleri (**kalın** yazılacak)]

## IV. Hukuki Sonuç ve Önemli Noktalar
*   [Madde 1]
*   [Madde 2]

## V. Sonuç
[Kısa kapanış]
```

---

#### D. Görsel Oluşturma Promptu
(Midjourney/DALL-E İçin İngilizce Prompt):
`[Legal, modern, abstract, minimalistic style...]`

---

### DAYANAK METİN (YARGITAY KARARI):

[BURAYA YARGITAY KARARINI YAPIŞTIRIN]
