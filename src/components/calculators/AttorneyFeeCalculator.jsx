import React, { useState } from 'react';

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

const AttorneyFeeCalculator = () => {
    const [calcType, setCalcType] = useState('fixed'); // fixed or nispi
    const [selectedFixed, setSelectedFixed] = useState('');
    const [amount, setAmount] = useState('');
    const [nispiResult, setNispiResult] = useState(null);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(val);
    };

    const calculateNispi = (val) => {
        const numVal = parseFloat(val);
        if (isNaN(numVal) || numVal <= 0) {
            setNispiResult(null);
            return;
        }

        let remaining = numVal;
        let totalFee = 0;
        const breakdown = [];

        for (const tranche of TRANCHES) {
            const amountInTranche = Math.min(remaining, tranche.limit);
            if (amountInTranche <= 0) break;

            const fee = amountInTranche * tranche.rate;
            totalFee += fee;
            breakdown.push({
                range: tranche.limit === Infinity ? 'Üzeri' : formatCurrency(tranche.limit),
                rate: (tranche.rate * 100).toFixed(0) + '%',
                fee: fee
            });

            remaining -= amountInTranche;
            if (tranche.limit === Infinity) break;
        }

        const isBelowMin = totalFee < MIN_FEE_GENERAL;
        const finalFee = isBelowMin ? MIN_FEE_GENERAL : totalFee;

        setNispiResult({
            total: finalFee,
            calculated: totalFee,
            isBelowMin: isBelowMin,
            breakdown: breakdown
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Type Switcher */}
            <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-800 mb-8 max-w-md mx-auto">
                <button
                    onClick={() => setCalcType('fixed')}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${calcType === 'fixed'
                        ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Maktu Ücret
                </button>
                <button
                    onClick={() => setCalcType('nispi')}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${calcType === 'nispi'
                        ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Nispi Ücret
                </button>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
                {calcType === 'fixed' ? (
                    <div className="space-y-8 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-4">
                                Dava Türü / İşlem Seçiniz
                            </label>
                            <select
                                value={selectedFixed}
                                onChange={(e) => setSelectedFixed(e.target.value)}
                                className="w-full h-14 px-6 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all font-medium"
                            >
                                <option value="">Seçiniz...</option>
                                {Object.entries(FIXED_FEES).map(([group, items]) => (
                                    <optgroup key={group} label={group} className="bg-slate-950 text-gold-500">
                                        {items.map((item) => (
                                            <option key={item.label} value={item.value} className="text-white">
                                                {item.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        {selectedFixed && (
                            <div className="space-y-6 animate-slideUp">
                                <div className="bg-slate-950/50 rounded-2xl p-8 border border-slate-800 text-center">
                                    <h3 className="text-slate-400 font-medium mb-3">Asgari Avukatlık Ücreti (KDV Dahil)</h3>
                                    <p className="text-4xl md:text-5xl font-bold text-gold-500">
                                        {formatCurrency(parseFloat(selectedFixed))}
                                    </p>
                                </div>
                                <div className="flex items-start gap-4 bg-slate-800/30 rounded-xl p-6 md:p-8 border border-slate-700/50">
                                    <svg className="w-6 h-6 text-gold-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Bu tutar 2025-2026 yılı AAÜT uyarınca belirlenen resmi asgari tutardır.
                                        Davanın mahiyeti ve harcanacak mesaiye göre bu tutar üzerinde serbestçe ücret kararlaştırılabilir.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 animate-fadeIn">
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
                                className="w-full h-16 px-6 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all font-semibold text-lg"
                            />
                        </div>

                        {nispiResult && (
                            <div className="space-y-6 animate-slideUp">
                                <div className="bg-slate-950/50 rounded-2xl p-8 border border-slate-800 text-center">
                                    <h3 className="text-slate-400 font-medium mb-3">Hesaplanan Asgari Ücret</h3>
                                    <p className="text-4xl md:text-5xl font-bold text-gold-500">
                                        {formatCurrency(nispiResult.total)}
                                    </p>
                                </div>

                                {nispiResult.isBelowMin && (
                                    <div className="bg-gold-500/10 border border-gold-500/40 rounded-xl p-6 md:p-8 flex items-start gap-4">
                                        <svg className="w-6 h-6 text-gold-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="text-gold-200/90 text-sm leading-relaxed">
                                            <strong>Önemli Kural:</strong> Hesaplanan tutar ({formatCurrency(nispiResult.calculated)}),
                                            Asliye Hukuk Mahkemeleri için belirlenen maktu asgari ücretin ({formatCurrency(MIN_FEE_GENERAL)}) altında kaldığı için asgari maktu ücret uygulanmıştır.
                                        </p>
                                    </div>
                                )}

                                <div className="bg-slate-950/30 rounded-2xl border border-slate-800 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                                        <h4 className="text-sm font-semibold text-slate-300">Hesaplama Detayları (Kademeli)</h4>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {nispiResult.breakdown.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">{item.range} aralığı (%{item.rate})</span>
                                                    <span className="text-slate-300 font-medium">{formatCurrency(item.fee)}</span>
                                                </div>
                                            ))}
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
};

export default AttorneyFeeCalculator;
