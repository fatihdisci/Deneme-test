import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'github',
        repo: 'fatihdisci/Deneme-test', // The specific repo we are working on
    },
    collections: {
        blog: collection({
            label: 'Makaleler',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Başlık' } }),
                description: fields.text({ label: 'Kısa Açıklama', multiline: true }),
                pubDate: fields.date({ label: 'Yayın Tarihi' }),
                category: fields.select({
                    label: 'Kategori',
                    options: [
                        { label: 'Bilişim Hukuku', value: 'Bilişim Hukuku' },
                        { label: 'Ceza Hukuku', value: 'Ceza Hukuku' },
                        { label: 'Ticaret Hukuku', value: 'Ticaret Hukuku' },
                        { label: 'İdare Hukuku', value: 'İdare Hukuku' },
                        { label: 'Gayrimenkul Hukuku', value: 'Gayrimenkul Hukuku' },
                        { label: 'Miras Hukuku', value: 'Miras Hukuku' },
                        { label: 'İş Hukuku', value: 'İş Hukuku' },
                    ],
                    defaultValue: 'Bilişim Hukuku'
                }),
                image: fields.text({
                    label: 'Kapak Görseli (örn: /images/blog/resim.jpg)',
                    description: 'Public klasörüne attığınız resmin yolunu yazın.'
                }),
                content: fields.document({
                    label: 'İçerik',
                    formatting: true,
                    dividers: true,
                    links: true,
                    images: true,
                }),
            },
        }),
    },
});
