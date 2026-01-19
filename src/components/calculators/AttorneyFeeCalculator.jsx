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
    { limit: 600000, rate: 0.16 },
    { limit: 600000, rate: 0.15 },
    { limit: 1200000, rate: 0.14 },
    { limit: 1200000, rate: 0.13 },
    { limit: 1800000, rate: 0.11 },
    { limit: 2400000, rate: 0.08 },
    { limit: 3000000, rate: 0.05 },
    { limit: 3600000, rate: 0.03 },
    { limit: 4200000, rate: 0.02 },
    { limit: Infinity, rate: 0.01 }
];

// Mahkeme türlerine göre minimum ücretler
const COURT_MIN_FEES = {
    davalar: [
        { name: "İcra Mahkemeleri", minFee: 18000 },
        { name: "Sulh Hukuk Mahkemeleri", minFee: 30000 },
        { name: "Sulh Ceza/İnfaz Hakimlikleri", minFee: 18000 },
        { name: "Asliye Mahkemeleri", minFee: 45000 },
        { name: "Tüketici Mahkemeleri", minFee: 22500 },
        { name: "Fikri ve Sınai Haklar Mahkemeleri", minFee: 55000 },
        { name: "İdare ve Vergi Mahkemeleri-Duruşmalı", minFee: 40000 },
        { name: "İdare ve Vergi Mahkemeleri-Duruşmasız", minFee: 30000 },
    ],
    icra: [
        { name: "İcra Takipleri", minFee: 11000 },
    ]
};

const AttorneyFeeCalculator = () => {
    const [calcType, setCalcType] = useState('fixed');
    const [selectedFixed, setSelectedFixed] = useState('');
    const [amount, setAmount] = useState('');
    const [courtType, setCourtType] = useState('davalar');
    const [nispiResult, setNispiResult] = useState(null);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(val);
    };

    const calculateNispi = (val, cType = courtType) => {
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

        // Her mahkeme türü için ayrı hesaplama
        const courts = COURT_MIN_FEES[cType];
        const courtFees = courts.map(court => {
            const finalFee = Math.max(totalFee, court.minFee);
            const isBelowMin = totalFee < court.minFee;
            return {
                name: court.name,
                minFee: court.minFee,
                calculatedFee: finalFee,
                isBelowMin: isBelowMin
            };
        });

        setNispiResult({
            calculated: totalFee,
            breakdown: breakdown,
            courtFees: courtFees
        });
    };

    const handleCourtTypeChange = (newType) => {
        setCourtType(newType);
        if (amount) {
            calculateNispi(amount, newType);
        }
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
                        {/* Court Type Radio Buttons */}
                        <div className="flex flex-wrap gap-6 justify-center">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="courtType"
                                    value="davalar"
                                    checked={courtType === 'davalar'}
                                    onChange={(e) => handleCourtTypeChange(e.target.value)}
                                    className="w-5 h-5 text-gold-500 bg-slate-950 border-slate-700 focus:ring-gold-500 focus:ring-2"
                                />
                                <span className={`font-medium transition-colors ${courtType === 'davalar' ? 'text-gold-500' : 'text-slate-400 group-hover:text-white'}`}>
                                    Konusu Para Olan Davalar için
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="courtType"
                                    value="icra"
                                    checked={courtType === 'icra'}
                                    onChange={(e) => handleCourtTypeChange(e.target.value)}
                                    className="w-5 h-5 text-gold-500 bg-slate-950 border-slate-700 focus:ring-gold-500 focus:ring-2"
                                />
                                <span className={`font-medium transition-colors ${courtType === 'icra' ? 'text-gold-500' : 'text-slate-400 group-hover:text-white'}`}>
                                    İcra Takipleri için
                                </span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-3">
                                Harca Esas Değer (TL)
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
                                {/* Court Type Fees Table */}
                                <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                                        <h4 className="text-sm font-semibold text-slate-300">
                                            {courtType === 'davalar' ? 'Mahkeme Türüne Göre Asgari Ücretler' : 'İcra Takipleri Asgari Ücreti'}
                                        </h4>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {nispiResult.courtFees.map((court, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                                                    <span className="text-slate-300 text-sm">{court.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-semibold ${court.isBelowMin ? 'text-gold-400' : 'text-green-400'}`}>
                                                            {formatCurrency(court.calculatedFee)}
                                                        </span>
                                                        {court.isBelowMin && (
                                                            <span className="text-xs text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded">
                                                                Maktu
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Calculation Breakdown */}
                                <div className="bg-slate-950/30 rounded-2xl border border-slate-800 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                                        <h4 className="text-sm font-semibold text-slate-300">Hesaplama Detayları (Kademeli)</h4>
                                        <p className="text-xs text-slate-500 mt-1">Nispi hesaplama sonucu: {formatCurrency(nispiResult.calculated)}</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {nispiResult.breakdown.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">{item.range} aralığı ({item.rate})</span>
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
