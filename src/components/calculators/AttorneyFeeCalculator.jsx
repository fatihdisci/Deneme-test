import { useState } from 'react';

const FIXED_FEES = {
    "Danışmanlık": [
        { label: "Sözlü Danışma (Büroda - 1 Saat) - 4.000 TL", value: 4000 },
        { label: "Yazılı Danışma (1 Saat) - 7.000 TL", value: 7000 },
        { label: "İhtarname / Protesto Yazımı - 6.000 TL", value: 6000 },
        { label: "Kira Sözleşmesi Hazırlama - 8.000 TL", value: 8000 }
    ],
    "Ceza Mahkemeleri": [
        { label: "Sulh Ceza Hakimliği - 18.000 TL", value: 18000 },
        { label: "Asliye Ceza Mahkemesi - 45.000 TL", value: 45000 },
        { label: "Ağır Ceza Mahkemesi - 65.000 TL", value: 65000 },
        { label: "Çocuk Mahkemesi - 45.000 TL", value: 45000 }
    ],
    "Hukuk Mahkemeleri": [
        { label: "Sulh Hukuk Mahkemesi - 30.000 TL", value: 30000 },
        { label: "Asliye Hukuk Mahkemesi - 45.000 TL", value: 45000 },
        { label: "Aile (Boşanma vb.) Mahkemesi - 45.000 TL", value: 45000 },
        { label: "Tüketici Mahkemesi - 22.500 TL", value: 22500 },
        { label: "Fikri ve Sınai Haklar - 55.000 TL", value: 55000 }
    ],
    "İcra ve İflas": [
        { label: "İcra Mahkemesi (Duruşmalı) - 18.000 TL", value: 18000 },
        { label: "İcra Mahkemesi (Duruşmasız) - 11.000 TL", value: 11000 }
    ],
    "İdare ve Vergi Mahkemeleri": [
        { label: "İdare Mahkemesi (Duruşmalı) - 40.000 TL", value: 40000 },
        { label: "İdare Mahkemesi (Duruşmasız) - 30.000 TL", value: 30000 },
        { label: "Vergi Mahkemesi (Duruşmalı) - 40.000 TL", value: 40000 },
        { label: "Vergi Mahkemesi (Duruşmasız) - 30.000 TL", value: 30000 }
    ],
    "Yüksek Yargı": [
        { label: "Danıştay (İlk Derece - Duruşmasız) - 40.000 TL", value: 40000 },
        { label: "Anayasa Mahkemesi (Bireysel Başvuru - Duruşmasız) - 40.000 TL", value: 40000 }
    ]
};

const TRANCHES = [
    { limit: 600000, rate: 0.16 }, // İlk 600k
    { limit: 600000, rate: 0.15 }, // Sonra gelen 600k (1.2M)
    { limit: 1200000, rate: 0.14 }, // Sonra gelen 1.2M (2.4M)
    { limit: 1200000, rate: 0.13 }, // Sonra gelen 1.2M (3.6M)
    { limit: 1800000, rate: 0.11 }, // Sonra gelen 1.8M (5.4M)
    { limit: 2400000, rate: 0.08 }, // Sonra gelen 2.4M (7.8M)
    { limit: 3000000, rate: 0.05 }, // Sonra gelen 3M (10.8M)
    { limit: 3600000, rate: 0.03 }, // Sonra gelen 3.6M (14.4M)
    { limit: 4200000, rate: 0.02 }, // Sonra gelen 4.2M (18.6M)
    { limit: Infinity, rate: 0.01 } // 18.6M üzeri
];

const MIN_FEE_GENERAL = 45000; // Asliye Hukuk minimum

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    }).format(amount);
}

export default function AttorneyFeeCalculator() {
    const [activeTab, setActiveTab] = useState('maktu');
    const [selectedFixed, setSelectedFixed] = useState('');
    const [amount, setAmount] = useState('');
    const [nispiResult, setNispiResult] = useState(null);

    const calculateNispi = (val) => {
        let remaining = parseFloat(val);
        if (isNaN(remaining) || remaining <= 0) {
            setNispiResult(null);
            return;
        }

        let totalFee = 0;
        let details = [];
        let tempRemaining = remaining;

        for (let tranche of TRANCHES) {
            if (tempRemaining <= 0) break;
            let currentTrancheAmount = Math.min(tempRemaining, tranche.limit);
            let currentFee = currentTrancheAmount * tranche.rate;
            totalFee += currentFee;
            details.push({ amount: currentTrancheAmount, rate: tranche.rate * 100, fee: currentFee });
            tempRemaining -= currentTrancheAmount;
        }

        setNispiResult({
            value: remaining,
            totalFee: totalFee,
            isBelowMin: totalFee < MIN_FEE_GENERAL
        });
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                <button
                    onClick={() => setActiveTab('maktu')}
                    className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${activeTab === 'maktu' ? 'bg-amber-500/10 text-amber-500 border-b-2 border-amber-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    Konusu Para Olmayan (Maktu)
                </button>
                <button
                    onClick={() => setActiveTab('nispi')}
                    className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${activeTab === 'nispi' ? 'bg-amber-500/10 text-amber-500 border-b-2 border-amber-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    Konusu Para Olan (Nispi)
                </button>
            </div>

            <div className="p-6 md:p-10">
                {activeTab === 'maktu' ? (
                    <div className="space-y-8" data-aos="fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">
                                Dava Türü / İşlem Seçiniz
                            </label>
                            <select
                                value={selectedFixed}
                                onChange={(e) => setSelectedFixed(e.target.value)}
                                className="w-full h-14 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
                            >
                                <option value="">Seçim Yapınız...</option>
                                {Object.entries(FIXED_FEES).map(([category, items]) => (
                                    <optgroup key={category} label={category} className="bg-slate-900 text-amber-500 font-bold">
                                        {items.map((item) => (
                                            <option key={item.label} value={item.value} className="text-white font-normal">
                                                {item.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {selectedFixed && (
                            <div className="space-y-6" data-aos="zoom-in">
                                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 rounded-2xl p-8 text-center">
                                    <p className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-wider">Asgari Avukatlık Ücreti</p>
                                    <p className="text-4xl md:text-5xl font-bold text-amber-500">
                                        {formatCurrency(parseFloat(selectedFixed))}
                                    </p>
                                </div>
                                <div className="flex items-start gap-4 bg-slate-800/30 rounded-xl p-6 md:p-8 border border-slate-700/50">
                                    <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Bu tutar Resmi Gazete'de yayımlanan Avukatlık Asgari Ücret Tarifesi (AAÜT) uyarınca belirlenen <strong className="text-slate-200">asgari</strong> tutardır. Dosyanın kapsamı, harcanacak emek ve davanın süresine göre bu tutar üzerinde anlaşma yapılabilir.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8" data-aos="fade-in">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">
                                Dava / İcra Değeri (TL)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    calculateNispi(e.target.value);
                                }}
                                placeholder="Hesaplanacak tutarı giriniz..."
                                className="w-full h-16 px-6 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-semibold text-lg"
                            />
                        </div>

                        {nispiResult && (
                            <div className="space-y-6" data-aos="zoom-in">
                                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 rounded-2xl p-8 text-center">
                                    <p className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-wider">HESAPLANAN ASGARİ ÜCRET</p>
                                    <p className="text-4xl md:text-5xl font-bold text-amber-500">
                                        {formatCurrency(nispiResult.totalFee)}
                                    </p>
                                </div>

                                {nispiResult.isBelowMin && (
                                    <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-6 md:p-8 flex items-start gap-4">
                                        <svg className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-amber-200/90 text-sm leading-relaxed">
                                            <strong className="text-amber-400 block mb-1">Önemli Kural:</strong>
                                            Hesaplanan nispi ücret, maktu ücretin (Asliye Hukuk için {formatCurrency(MIN_FEE_GENERAL)}) altında kalamaz. Bu durumda maktu ücretin uygulanması gerekebilir.
                                        </p>
                                    </div>
                                )}

                                <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-800">
                                    <p className="text-white font-serif mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                                        Hesaplama Detayları (Kademeli)
                                    </p>
                                    <div className="space-y-3 opacity-80">
                                        <div className="flex justify-between text-sm text-slate-400 pb-2 border-b border-slate-800">
                                            <span>Dava Değeri</span>
                                            <span className="text-white">{formatCurrency(nispiResult.value)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-400">
                                            <span>Asgari Ücret Oranı</span>
                                            <span className="text-white">AAÜT 2025/26 Oranları</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
