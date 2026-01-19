import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    ui: {
        brand: {
            name: 'Dişçi Hukuk Bürosu',
        },
    },
    collections: {
        blog: collection({
            label: 'Makaleler',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            entryLayout: 'content',
            schema: {
                title: fields.slug({ name: { label: 'Başlık' } }),
                description: fields.text({ label: 'Kısa Açıklama (SEO)', multiline: true }),
                pubDate: fields.date({ label: 'Yayın Tarihi' }),
                author: fields.text({
                    label: 'Yazar',
                    defaultValue: 'Av. Fatih Dişçi'
                }),
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
                        { label: 'Kira Hukuku', value: 'Kira Hukuku' },
                        { label: 'Aile Hukuku', value: 'Aile Hukuku' },
                    ],
                    defaultValue: 'Bilişim Hukuku'
                }),
                tags: fields.array(
                    fields.text({ label: 'Etiket' }),
                    {
                        label: 'Etiketler',
                        itemLabel: props => props.value || 'Yeni Etiket',
                    }
                ),
                image: fields.text({
                    label: 'Resim Yolu',
                    description: 'Örnek: /images/blog/kira-hukuku.jpg'
                }),
                content: fields.mdx({
                    label: 'İçerik',
                }),
            },
        }),
    },
});
