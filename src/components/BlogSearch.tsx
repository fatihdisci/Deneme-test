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
    postsPerPage?: number;
}

export default function BlogSearch({ posts, postsPerPage = 6 }: BlogSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filter posts based on search and category
    const filteredPosts = useMemo(() => {
        let result = posts;

        // Filter by category first
        if (selectedCategory) {
            result = result.filter(post => (post.data.category || 'Genel') === selectedCategory);
        }

        // Then filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (post) =>
                    post.data.title.toLowerCase().includes(query) ||
                    post.data.description.toLowerCase().includes(query)
            );
        }

        return result;
    }, [posts, searchQuery, selectedCategory]);

    // Reset to page 1 when search or category changes
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    // Get category counts from ALL posts (not filtered)
    const categoryCountsFromAll = useMemo(() => {
        return posts.reduce((acc, post) => {
            const cat = post.data.category || 'Genel';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [posts]);

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null); // Toggle off if already selected
        } else {
            setSelectedCategory(category);
        }
        setCurrentPage(1);
    };

    const clearCategoryFilter = () => {
        setSelectedCategory(null);
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

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
                {(searchQuery || selectedCategory) && (
                    <p className="text-sm text-slate-500 mt-3 text-center">
                        {filteredPosts.length} sonuç bulundu
                        {selectedCategory && <span className="text-gold-500"> ({selectedCategory})</span>}
                    </p>
                )}
            </div>

            {/* Categories Bar */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {/* All Categories Button */}
                <button
                    onClick={clearCategoryFilter}
                    className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${!selectedCategory
                            ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                            : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-white'
                        }`}
                >
                    Tümü <span className="font-bold text-xs bg-gold-500/10 px-2 py-0.5 rounded-full">{posts.length}</span>
                </button>

                {Object.entries(categoryCountsFromAll).map(([cat, count]) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${selectedCategory === cat
                                ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                                : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-white'
                            }`}
                    >
                        {cat} <span className="text-gold-500 font-bold text-xs bg-gold-500/10 px-2 py-0.5 rounded-full">{count}</span>
                    </button>
                ))}
            </div>

            {/* Active Filter Indicator */}
            {selectedCategory && (
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full">
                        <span className="text-sm text-gold-500">
                            <strong>{selectedCategory}</strong> kategorisi gösteriliyor
                        </span>
                        <button
                            onClick={clearCategoryFilter}
                            className="p-1 hover:bg-gold-500/20 rounded-full transition-colors"
                            aria-label="Filtreyi kaldır"
                        >
                            <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Posts Grid or Empty State */}
            {currentPosts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentPosts.map((post, index) => (
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
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCategoryClick(post.data.category || 'Genel');
                                            }}
                                            className="bg-slate-950/80 backdrop-blur text-gold-500 text-xs font-bold px-3 py-1 rounded-full border border-gold-500/20 hover:bg-gold-500/20 transition-colors"
                                        >
                                            {post.data.category || 'Genel'}
                                        </button>
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            {/* Previous Button */}
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border transition-all ${currentPage === 1
                                        ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'border-slate-700 text-slate-300 hover:border-gold-500 hover:text-gold-500'
                                    }`}
                                aria-label="Önceki sayfa"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && goToPage(page)}
                                    disabled={page === '...'}
                                    className={`min-w-[40px] h-10 rounded-lg border font-medium transition-all ${page === currentPage
                                            ? 'bg-gold-500 border-gold-500 text-slate-950'
                                            : page === '...'
                                                ? 'border-transparent text-slate-600 cursor-default'
                                                : 'border-slate-700 text-slate-300 hover:border-gold-500 hover:text-gold-500'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages
                                        ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'border-slate-700 text-slate-300 hover:border-gold-500 hover:text-gold-500'
                                    }`}
                                aria-label="Sonraki sayfa"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Page Info */}
                    {totalPages > 1 && (
                        <p className="text-center text-sm text-slate-500 mt-4">
                            Sayfa {currentPage} / {totalPages} • Toplam {filteredPosts.length} makale
                        </p>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900/50 border border-slate-800 mb-6">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-serif">Sonuç Bulunamadı</h3>
                    <p className="text-slate-500 mb-4">
                        Aradığınız kriterde sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.
                    </p>
                    {(selectedCategory || searchQuery) && (
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setSearchQuery('');
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Filtreleri Temizle
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
