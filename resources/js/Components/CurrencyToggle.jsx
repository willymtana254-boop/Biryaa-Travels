import { useMoney } from '../lib/currency';

export default function CurrencyToggle({ className = '' }) {
    const { currency, setCurrency } = useMoney();

    return (
        <div className={`inline-flex rounded-full border border-ink/20 p-0.5 text-xs font-medium ${className}`} role="group" aria-label="Currency">
            {['KES', 'USD'].map((c) => (
                <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    aria-pressed={currency === c}
                    className={`px-3 py-1 rounded-full transition-colors ${currency === c ? 'bg-tide text-paper' : 'text-ink/60 hover:text-tide'}`}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}