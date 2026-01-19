import { useState } from 'react';

// Historical Severance Ceilings (Kıdem Tavanı)
const CEILING_HISTORY = [
    { start: '2026-01-01', end: '2026-06-30', amount: 64948.77 },
    { start: '2025-07-01', end: '2025-12-31', amount: 53919.68 },
    { start: '2025-01-01', end: '2025-06-30', amount: 46655.43 },
    { start: '2024-07-01', end: '2024-12-31', amount: 41828.42 },
    { start: '2024-01-01', end: '2024-06-30', amount: 35058.58 },
    { start: '2023-07-01', end: '2023-12-31', amount: 23489.83 },
    { start: '2023-01-01', end: '2023-06-30', amount: 19982.83 },
    { start: '2022-07-01', end: '2022-12-31', amount: 15371.40 },
    { start: '2022-01-01', end: '2022-06-30', amount: 10848.59 },
    { start: '2021-07-01', end: '2021-12-31', amount: 8284.51 },
    { start: '2021-01-01', end: '2021-06-30', amount: 7638.96 },
    { start: '2020-07-01', end: '2020-12-31', amount: 7117.17 }
];

// Get the appropriate ceiling for a given exit date
function getCeiling(exitDateStr) {
    const exitDate = new Date(exitDateStr);

    // Find matching period
    for (const period of CEILING_HISTORY) {
        const start = new Date(period.start);
        const end = new Date(period.end);
        end.setHours(23, 59, 59, 999); // Include the entire end day

        if (exitDate >= start && exitDate <= end) {
            return { amount: period.amount, period: `${period.start.slice(0, 4)}/${period.start.slice(5, 7) <= '06' ? '1' : '2'}. Dönem` };
        }
    }

    // If newer than latest entry (future), use latest
    const latestPeriod = CEILING_HISTORY[0];
    if (exitDate > new Date(latestPeriod.end)) {
        return { amount: latestPeriod.amount, period: 'Güncel Dönem' };
    }

    // If older than oldest entry, use oldest
    const oldestPeriod = CEILING_HISTORY[CEILING_HISTORY.length - 1];
    return { amount: oldestPeriod.amount, period: '2020/2. Dönem (En Eski)' };
}

// Calculate tenure in years, months, days
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

    // Total years as decimal for calculation
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

export default function SeveranceCalculator() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [grossSalary, setGrossSalary] = useState('');
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

        // Get ceiling for exit date
        const ceilingInfo = getCeiling(endDate);
        const ceiling = ceilingInfo.amount;

        // Calculate tenure
        const tenure = calculateTenure(startDate, endDate);

        // Check minimum tenure (1 year)
        if (tenure.totalYears < 1) {
            setError('Kıdem tazminatı hakkı için en az 1 yıl çalışmış olmanız gerekmektedir.');
            return;
        }

        // Base salary (min of gross salary and ceiling)
        const baseSalary = Math.min(salary, ceiling);
        const isCeilingApplied = salary > ceiling;

        // Calculate gross severance
        const grossSeverance = baseSalary * tenure.totalYears;

        // Stamp tax (Damga Vergisi) - 0.759%
        const stampTax = grossSeverance * 0.00759;

        // Net severance
        const netSeverance = grossSeverance - stampTax;

        setResult({
            tenure,
            ceiling,
            ceilingPeriod: ceilingInfo.period,
            baseSalary,
            isCeilingApplied,
            grossSeverance,
            stampTax,
            netSeverance
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
                            className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
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
                            className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
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
                        className="w-full h-12 px-4 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                        required
                    />
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
                    className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold rounded-lg transition-all shadow-lg shadow-gold-500/20 active:scale-[0.98]"
                >
                    HESAPLA
                </button>
            </form>

            {/* Results */}
            {result && (
                <div className="mt-8 space-y-6">
                    <div className="border-t border-slate-800 pt-8">
                        <h3 className="text-xl font-bold text-white mb-6 font-serif">Hesaplama Sonucu</h3>

                        {/* Tenure */}
                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                            <p className="text-slate-400 text-sm mb-1">Hizmet Süresi</p>
                            <p className="text-white text-lg font-semibold">
                                {result.tenure.years} Yıl, {result.tenure.months} Ay, {result.tenure.days} Gün
                            </p>
                        </div>

                        {/* Ceiling Info */}
                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                            <p className="text-slate-400 text-sm mb-1">Kullanılan Kıdem Tavanı ({result.ceilingPeriod})</p>
                            <p className="text-gold-500 text-lg font-semibold">{formatCurrency(result.ceiling)}</p>
                        </div>

                        {/* Ceiling Applied Notice */}
                        {result.isCeilingApplied && (
                            <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4 mb-4">
                                <p className="text-gold-400 text-sm">
                                    <strong>Bilgi:</strong> Brüt ücretiniz kıdem tavanını aştığı için, hesaplama{' '}
                                    <strong>{formatCurrency(result.ceiling)}</strong> üzerinden yapılmıştır.
                                </p>
                            </div>
                        )}

                        {/* Breakdown */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Hesaba Esas Ücret</span>
                                <span className="text-white font-medium">{formatCurrency(result.baseSalary)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Brüt Kıdem Tazminatı</span>
                                <span className="text-white font-medium">{formatCurrency(result.grossSeverance)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-400">Damga Vergisi (%0,759)</span>
                                <span className="text-red-400 font-medium">- {formatCurrency(result.stampTax)}</span>
                            </div>
                        </div>

                        {/* Net Result */}
                        <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30 rounded-xl p-6 text-center">
                            <p className="text-slate-300 text-sm mb-2">NET KIDEM TAZMİNATI</p>
                            <p className="text-3xl md:text-4xl font-bold text-gold-500">{formatCurrency(result.netSeverance)}</p>
                        </div>

                        {/* Cross-link to Notice Pay Calculator */}
                        <div className="mt-6 text-center">
                            <a
                                href="/hesaplama-araclari/ihbar-tazminati"
                                className="inline-flex items-center px-6 py-3 border border-gold-500/50 text-gold-500 hover:bg-gold-500/10 rounded-lg transition-all font-medium"
                            >
                                Sırada İhbar Tazminatı Var 👉
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
