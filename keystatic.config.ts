import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    ui: {
        brand: {
            name: 'Dişçi Hukuk Bürosu',
        },
        navigation: {
            'İçerik Yönetimi': ['blog'],
        },
    },
    collections: {
        blog: collection({
            label: 'Makaleler',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            entryLayout: 'content',
            columns: ['title', 'category', 'pubDate'],
            schema: {
                // ===== TEMEL BİLGİLER =====
                title: fields.slug({
                    name: {
                        label: 'Makale Başlığı',
                        description: 'SEO için optimize edilmiş bir başlık girin',
                    }
                }),
                description: fields.text({
                    label: 'Kısa Açıklama (SEO)',
                    description: 'Google arama sonuçlarında görünecek 150-160 karakter açıklama',
                    multiline: true,
                    validation: { length: { min: 50, max: 200 } },
                }),

                // ===== YAYINLAMA BİLGİLERİ =====
                pubDate: fields.date({
                    label: 'Yayın Tarihi',
                    defaultValue: { kind: 'today' },
                }),
                author: fields.text({
                    label: 'Yazar',
                    defaultValue: 'Av. Fatih Dişçi'
                }),

                // ===== KATEGORİ VE ETİKETLER =====
                category: fields.select({
                    label: 'Kategori',
                    options: [
                        { label: 'Kira Hukuku', value: 'Kira Hukuku' },
                        { label: 'Ceza Hukuku', value: 'Ceza Hukuku' },
                        { label: 'İş Hukuku', value: 'İş Hukuku' },
                        { label: 'Aile Hukuku', value: 'Aile Hukuku' },
                        { label: 'Miras Hukuku', value: 'Miras Hukuku' },
                        { label: 'Gayrimenkul Hukuku', value: 'Gayrimenkul Hukuku' },
                        { label: 'Ticaret Hukuku', value: 'Ticaret Hukuku' },
                        { label: 'İdare Hukuku', value: 'İdare Hukuku' },
                        { label: 'Bilişim Hukuku', value: 'Bilişim Hukuku' },
                    ],
                    defaultValue: 'Kira Hukuku'
                }),
                tags: fields.array(
                    fields.text({ label: 'Etiket' }),
                    {
                        label: 'Etiketler (SEO Anahtar Kelimeler)',
                        description: 'Virgülle ayrılmış anahtar kelimeler ekleyin',
                        itemLabel: props => props.value || 'Yeni Etiket',
                    }
                ),

                // ===== GÖRSEL =====
                image: fields.image({
                    label: 'Kapak Görseli',
                    description: 'Blog kartlarında ve sosyal medyada görünecek görsel',
                    directory: 'public/images/blog',
                    publicPath: '/images/blog/',
                }),

                // ===== İÇERİK =====
                content: fields.mdx({
                    label: 'Makale İçeriği',
                    options: {
                        heading: [2, 3, 4],
                        bold: true,
                        italic: true,
                        strikethrough: true,
                        link: true,
                        blockquote: true,
                        orderedList: true,
                        unorderedList: true,
                        table: true,
                        code: true,
                        codeBlock: true,
                        divider: true,
                        image: {
                            directory: 'public/images/blog',
                            publicPath: '/images/blog/',
                        },
                    },
                }),
            },
        }),
    },
});
