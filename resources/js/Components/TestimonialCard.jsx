import StarRating from './StarRating';

export default function TestimonialCard({ t }) {
    const initial = (t.name || '?').trim().charAt(0).toUpperCase();

    return (
        <figure className="h-full min-w-0 flex flex-col overflow-hidden rounded-2xl bg-white border border-ink/10 p-6 shadow-sm">
            <StarRating value={t.rating} />

            <blockquote className="mt-3 flex-1 text-sm text-ink/80 leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line">
                “{t.message}”
            </blockquote>

            <figcaption className="mt-5 flex items-center gap-3 min-w-0">
                <span className="shrink-0 w-10 h-10 rounded-full bg-tide text-paper flex items-center justify-center font-display font-semibold">
                    {initial}
                </span>
                <span className="min-w-0 text-sm">
                    <span className="block font-medium text-ink [overflow-wrap:anywhere]">
                        {t.name}
                        {t.location ? <span className="text-ink/50 font-normal">, {t.location}</span> : null}
                    </span>
                    <span className="block text-xs text-ink/50">
                        {[t.service, t.date].filter(Boolean).join(' · ')}
                    </span>
                    {t.verified && (
                        <span className="mt-0.5 block text-xs font-medium text-tide">✓ Verified booking</span>
                    )}
                </span>
            </figcaption>
        </figure>
    );
}