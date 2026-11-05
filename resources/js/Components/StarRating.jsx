const Star = ({ filled, size }) => (
    <svg viewBox="0 0 20 20" width={size} height={size} className={filled ? 'text-sun' : 'text-ink/15'} fill="currentColor" aria-hidden="true">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
);

/** Read-only stars, or clickable when onChange is given. */
export default function StarRating({ value = 0, onChange, size = 18 }) {
    return (
        <div className="inline-flex gap-0.5" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) =>
                onChange ? (
                    <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} className="p-0.5">
                        <Star filled={n <= value} size={size} />
                    </button>
                ) : (
                    <Star key={n} filled={n <= value} size={size} />
                ),
            )}
        </div>
    );
}
