export default function Stars({ value = 0, size = 16, className = '' }) {
    const pct = (Math.max(0, Math.min(5, Number(value) || 0)) / 5) * 100;

    return (
        <span
            className={`relative inline-block leading-none whitespace-nowrap ${className}`}
            style={{ fontSize: size }}
            role="img"
            aria-label={`${Number(value || 0).toFixed(1)} out of 5 stars`}
        >
            <span className="text-ink/20">★★★★★</span>
            <span className="absolute left-0 top-0 overflow-hidden text-amber-500" style={{ width: `${pct}%` }}>
                ★★★★★
            </span>
        </span>
    );
}