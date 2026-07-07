import { Link } from '@inertiajs/react';

export default function ListingCard({ image, eyebrow, title, meta, price, priceLabel, href }) {
    return (
        <Link
            href={href}
            className="group block rounded-2xl border border-ink/10 bg-white/60 overflow-hidden hover:shadow-lg hover:shadow-tide/5 hover:-translate-y-0.5 transition-all"
        >
            <div className="aspect-[4/3] bg-sand overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-tide/30 font-display text-2xl">
                        Biryaa Travels
                    </div>
                )}
            </div>
            <div className="p-5">
                {eyebrow && <p className="text-xs font-medium uppercase tracking-wide text-rust mb-1">{eyebrow}</p>}
                <h3 className="font-display text-lg text-tide font-semibold">{title}</h3>
                {meta && <p className="text-sm text-ink/60 mt-1">{meta}</p>}
                {price != null && (
                    <p className="mt-3 text-sm">
                        <span className="font-semibold text-ink">${Number(price).toLocaleString()}</span>
                        {priceLabel && <span className="text-ink/50"> {priceLabel}</span>}
                    </p>
                )}
            </div>
        </Link>
    );
}