import { Money } from '../lib/currency';
import { Link } from '@inertiajs/react';
import Stars from './Stars';

export default function ListingCard({ image, eyebrow, title, meta, price, priceLabel, href, badge, rating }) {
    return (
        <Link
            href={href}
            className="group block rounded-2xl border border-ink/10 bg-white/60 overflow-hidden hover:shadow-lg hover:shadow-tide/5 hover:-translate-y-0.5 transition-all"
        >
            <div className="relative aspect-[4/3] bg-sand overflow-hidden">
                {image ? (
                    <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-tide/30 font-display text-2xl">
                        Biryaa Travels
                    </div>
                )}
                {badge && (
                    <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                            badge.tone === 'available' ? 'bg-lagoon text-paper' : 'bg-rust text-paper'
                        }`}
                    >
                        {badge.label}
                    </span>
                )}
            </div>
            <div className="p-5">
                {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-rust mb-1">{eyebrow}</p>}
                <h3 className="font-display text-lg text-tide font-semibold">{title}</h3>
                {meta && <p className="text-sm text-ink/60 mt-1">{meta}</p>}
                {rating && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm">
                        {Number(rating.count) > 0 ? (
                            <>
                                <Stars value={Number(rating.average)} size={14} />
                                <span className="font-medium text-ink">{Number(rating.average).toFixed(1)}</span>
                                <span className="text-ink/50">({rating.count})</span>
                            </>
                        ) : (
                            <span className="text-ink/40">New · no reviews yet</span>
                        )}
                    </p>
                )}
                {price != null && (
                    <p className="mt-3 text-sm">
                        <span className="font-semibold text-ink"><Money usd={price} /></span>
                        {priceLabel && <span className="text-ink/50"> {priceLabel}</span>}
                    </p>
                )}
            </div>
        </Link>
    );
}