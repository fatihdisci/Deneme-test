import { useState, useMemo } from 'react';

interface BlogPost {
    slug: string;
    data: {
        title: string;
        description: string;
        pubDate: Date;
        category?: string;
        image?: string;
    };
}

interface BlogSearchProps {
    posts: BlogPost[];
}

export default function BlogSearch({ posts }: BlogSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;

        const query = searchQuery.toLowerCase();
        return posts.filter(
            (post) =>
                post.data.title.toLowerCase().includes(query) ||
                post.data.description.toLowerCase().includes(query)
        );
    }, [posts, searchQuery]);

    const clearSearch = () => setSearchQuery('');

    return (
        <div className="w-full">
            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative group">
                    {/* Magnifying Glass Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>

                    <input
                        type="text"
                        placeholder="Makale ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    />

                    {/* Clear Button */}
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            aria-label="Aramayı temizle"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <p className="text-sm text-slate-500 mt-3 text-center">
                        {filteredPosts.length} sonuç bulundu
                    </p>
                )}
            </div>

            {/* Categories Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {Object.entries(
                    posts.reduce((acc, post) => {
                        const cat = post.data.category || 'Genel';
                        acc[cat] = (acc[cat] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>)
                ).map(([cat, count]) => {
                    const getServiceSlug = (category: string) => {
                        const map: Record<string, string> = {
                            "Aile Hukuku": "aile-ve-bosanma",
                            "Şirket Danışmanlığı": "sirket-danismanligi",
                            "Ceza Hukuku": "ceza-hukuku",
                            "İş Hukuku": "is-hukuku",
                            "İdare Hukuku": "idare-hukuku",
                            "Gayrimenkul Hukuku": "gayrimenkul-hukuku",
                            "Miras Hukuku": "miras-hukuku",
                            "Bilişim Hukuku": "bilisim-hukuku",
                            "Health Law": "saglik-hukuku", // Example mapping
                            "Sağlık Hukuku": "saglik-hukuku"
                        };
                        return map[category] || category.toLowerCase()
                            .replace(/ğ/g, 'g')
                            .replace(/ü/g, 'u')
                            .replace(/ş/g, 's')
                            .replace(/ı/g, 'i')
                            .replace(/ö/g, 'o')
                            .replace(/ç/g, 'c')
                            .replace(/[^a-z0-9-]/g, '-')
                            .replace(/-+/g, '-');
                    };

                    return (
                        <a
                            key={cat}
                            href={`/calisma-alanlarimiz/${getServiceSlug(cat)}`}
                            className="px-4 py-2 border border-slate-800 bg-slate-900/50 rounded-full text-slate-300 text-sm hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-white transition-all duration-300 flex items-center gap-2"
                        >
                            {cat} <span className="text-gold-500 font-bold text-xs bg-gold-500/10 px-2 py-0.5 rounded-full">{count}</span>
                        </a>
                    );
                })}
            </div>

            {/* Posts Grid or Empty State */}
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <article
                            key={post.slug}
                            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all hover:shadow-xl hover:shadow-gold-500/5 hover:-translate-y-2 group h-full flex flex-col"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="aspect-video bg-slate-800 relative overflow-hidden">
                                {post.data.image ? (
                                    <img
                                        src={post.data.image}
                                        alt={post.data.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                        <span className="text-4xl text-slate-700 group-hover:text-slate-600 transition-colors">⚖️</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-slate-950/80 backdrop-blur text-gold-500 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/20">
                                        {post.data.category || 'Genel'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="mb-4">
                                    <time className="text-xs text-slate-500">
                                        {new Date(post.data.pubDate).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold-500 transition-colors font-serif">
                                    <a href={`/blog/${post.slug}`}>{post.data.title}</a>
                                </h2>

                                <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
                                    {post.data.description}
                                </p>

                                <div className="pt-4 border-t border-white/5">
                                    <a
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-gold-500 transition-colors"
                                    >
                                        Devamını Oku
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900/50 border border-slate-800 mb-6">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-serif">Sonuç Bulunamadı</h3>
                    <p className="text-slate-500">
                        Aradığınız kriterde sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.
                    </p>
                </div>
            )}
        </div>
    );
}
