import { useState } from 'react';

// Notice period rules based on tenure (Turkish Labor Law)
function getNoticePeriod(tenureYears) {
    if (tenureYears < 0.5) return { weeks: 2, label: '2 Hafta' };
    if (tenureYears < 1.5) return { weeks: 4, label: '4 Hafta' };
    if (tenureYears < 3) return { weeks: 6, label: '6 Hafta' };
    return { weeks: 8, label: '8 Hafta' };
}

// Calculate tenure in years
function calculateTenure(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const totalYears = years + (months / 12) + (days / 365);
    return { years, months, days, totalYears };
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    }).format(amount);
}

// Tax rate options
const TAX_RATES = [
    { value: 15, label: '%15 (Varsayılan)' },
    { value: 20, label: '%20' },
    { value: 27, label: '%27' },
    { value: 35, label: '%35' },
    { value: 40, label: '%40' },
];

export default function NoticePayCalculator() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [grossSalary, setGrossSalary] = useState('');
    const [taxRate, setTaxRate] = useState(15);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        // Validations
        if (!startDate || !endDate || !grossSalary) {
            setError('Lütfen tüm alanları doldurunuz.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const salary = parseFloat(grossSalary);

        if (end <= start) {
            setError('İşten çıkış tarihi, işe giriş tarihinden sonra olmalıdır.');
            return;
        }

        if (salary <= 0) {
            setError('Geçerli bir brüt ücret giriniz.');
            return;
        }

        // Calculate tenure
        const tenure = calculateTenure(startDate, endDate);

        // Get notice period
        const noticePeriod = getNoticePeriod(tenure.totalYears);

        // Calculate daily gross
        const dailyGross = salary / 30;

        // Calculate gross notice pay
        const noticeDays = noticePeriod.weeks * 7;
        const grossNoticePay = dailyGross * noticeDays;

        // Calculate deductions
        const incomeTax = grossNoticePay * (taxRate / 100);
        const stampTax = grossNoticePay * 0.00759;
        const totalDeductions = incomeTax + stampTax;

        // Calculate net
        const netNoticePay = grossNoticePay - totalDeductions;

        setResult({
            tenure,
            noticePeriod,
            noticeDays,
            dailyGross,
            grossNoticePay,
            incomeTax,
            stampTax,
            totalDeductions,
            netNoticePay,
            appliedTaxRate: taxRate
        });
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10">
            <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-400 mb-2">
                            İşe Giriş Tarihi
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            style={{ colorScheme: 'dark' }}
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-400 mb-2">
                            İşten Çıkış Tarihi
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            style={{ colorScheme: 'dark' }}
                            required
                        />
                    </div>
                </div>

                {/* Gross Salary */}
                <div>
                    <label htmlFor="grossSalary" className="block text-sm font-medium text-slate-400 mb-2">
                        Brüt Ücret (TL)
                    </label>
                    <input
                        type="number"
                        id="grossSalary"
                        value={grossSalary}
                        onChange={(e) => setGrossSalary(e.target.value)}
                        placeholder="Örn: 50000"
                        min="0"
                        step="0.01"
                        className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        required
                    />
                </div>

                {/* Tax Rate Selector */}
                <div>
                    <label htmlFor="taxRate" className="block text-sm font-medium text-slate-400 mb-2">
                        Gelir Vergisi Oranı (%)
                    </label>
                    <select
                        id="taxRate"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseInt(e.target.value))}
                        className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    >
                        {TAX_RATES.map((rate) => (
                            <option key={rate.value} value={rate.value}>
                                {rate.label}
                            </option>
                        ))}
                    </select>
                    <p className="text-slate-500 text-xs mt-2">
                        Varsayılan %15'tir. Vergi diliminizi biliyorsanız değiştirebilirsiniz.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Calculate Button */}
                <button
                    type="submit"
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                >
                    HESAPLA
                </button>
            </form>

            {/* Results */}
            {result && (
                <div className="mt-8 space-y-6">
                    <div className="border-t border-slate-800 pt-8">
                        <h3 className="text-xl font-bold text-white mb-6 font-serif">Hesaplama Sonucu</h3>

                        {/* Tenure & Notice Period */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm mb-1">Hizmet Süresi</p>
                                <p className="text-white text-lg font-semibold">
                                    {result.tenure.years} Yıl, {result.tenure.months} Ay, {result.tenure.days} Gün
                                </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4">
                                <p className="text-slate-400 text-sm mb-1">İhbar Süresi</p>
                                <p className="text-amber-500 text-lg font-semibold">
                                    {result.noticePeriod.label} ({result.noticeDays} Gün)
                                </p>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Günlük Brüt Ücret</span>
                                <span className="text-white font-medium">{formatCurrency(result.dailyGross)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Brüt İhbar Tazminatı</span>
                                <span className="text-white font-medium">{formatCurrency(result.grossNoticePay)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Gelir Vergisi (%{result.appliedTaxRate})</span>
                                <span className="text-red-400 font-medium">- {formatCurrency(result.incomeTax)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Damga Vergisi (%0,759)</span>
                                <span className="text-red-400 font-medium">- {formatCurrency(result.stampTax)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400 font-semibold">Kesintiler Toplamı</span>
                                <span className="text-red-400 font-semibold">{formatCurrency(result.totalDeductions)}</span>
                            </div>
                        </div>

                        {/* Net Result */}
                        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl p-6 text-center">
                            <p className="text-slate-300 text-sm mb-2">NET İHBAR TAZMİNATI</p>
                            <p className="text-3xl md:text-4xl font-bold text-amber-500">{formatCurrency(result.netNoticePay)}</p>
                        </div>

                        {/* Cross-link to Severance Calculator */}
                        <div className="mt-6 text-center">
                            <a
                                href="/hesaplama-araclari/kidem-tazminati"
                                className="inline-flex items-center px-6 py-3 border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all font-medium"
                            >
                                Kıdem Tazminatınızı da Hesaplayın 👉
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
