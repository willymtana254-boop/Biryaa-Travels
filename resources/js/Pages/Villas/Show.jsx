import { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';

export default function VillasShow({ villa, related = [] }) {
    const images = villa.images ?? [];
    const [active, setActive] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);
    const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setLightbox(false);
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox, next, prev]);

    const askUrl = `https://wa.me/254728769798?text=${encodeURIComponent(
        `Hi Biryaa Travels, I'm interested in ${villa.name} in ${villa.location?.name}.`
    )}`;

    return (
        <SiteLayout>
            <Head title={villa.name} />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <Link href="/villas" className="text-sm text-ink/50 hover:text-tide">← All villas</Link>

                {/* Gallery */}
                <div className="mt-4">
                    {images.length > 0 ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setLightbox(true)}
                                className="relative block w-full aspect-[16/9] rounded-2xl overflow-hidden bg-sand group"
                                aria-label="Open photo viewer"
                            >
                                <img
                                    src={images[active]}
                                    alt={`${villa.name} photo ${active + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <span className="absolute bottom-4 right-4 rounded-full bg-ink/70 text-paper text-xs font-medium px-3 py-1.5">
                                    {active + 1} / {images.length} · View photos
                                </span>
                            </button>

                            {images.length > 1 && (
                                <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {images.map((src, i) => (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => setActive(i)}
                                            className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${
                                                i === active ? 'border-rust' : 'border-transparent opacity-80 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-tide to-lagoon flex flex-col items-center justify-center text-paper text-center px-6">
                            <p className="font-display text-2xl md:text-3xl font-semibold">{villa.name}</p>
                            <p className="mt-2 text-paper/70 text-sm">Photos coming soon — message us on WhatsApp and we'll send you pictures.</p>
                        </div>
                    )}
                </div>

                <div className="mt-10 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">{villa.location?.name}</p>
                        <h1 className="font-display text-3xl md:text-4xl text-tide font-semibold">{villa.name}</h1>
                        <p className="mt-3 text-ink/60">
                            {villa.bedrooms} bedrooms · {villa.bathrooms} bathrooms · sleeps {villa.max_guests}
                        </p>
                        <p className="mt-6 text-ink/70 leading-relaxed text-lg">{villa.description}</p>

                        {villa.amenities?.length > 0 && (
                            <div className="mt-8">
                                <h2 className="font-medium text-ink mb-3">What's included</h2>
                                <div className="flex flex-wrap gap-2">
                                    {villa.amenities.map((a) => (
                                        <span key={a} className="px-3 py-1.5 rounded-full bg-sand text-sm text-ink/70">{a}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 rounded-xl bg-sand/60 p-5 text-sm text-ink/70">
                            Need airport or SGR pick-up, a private chauffeur or a car for your stay? We can arrange it all
                            in the same booking.{' '}
                            <Link href="/airport-transfers" className="text-rust font-medium hover:underline">See transfers →</Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-ink/10 p-6 h-fit md:sticky md:top-24 bg-white/60">
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl text-ink font-semibold">${Number(villa.price_per_night).toLocaleString()}</span>
                            <span className="text-ink/50">/ night</span>
                        </div>
                        <Link
                            href={`/book/villa/${villa.id}`}
                            className="mt-5 w-full inline-flex justify-center items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                        >
                            Check availability
                        </Link>
                        <a
                            href={askUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 w-full inline-flex justify-center items-center rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:border-tide hover:text-tide transition-colors"
                        >
                            Ask about this villa
                        </a>
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="mt-16">
                        <h2 className="font-display text-2xl text-tide font-semibold mb-6">More stays in {villa.location?.name}</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {related.map((v) => (
                                <ListingCard
                                    key={v.id}
                                    href={`/villas/${v.slug}`}
                                    image={v.images?.[0]}
                                    title={v.name}
                                    eyebrow={v.location?.name}
                                    meta={`${v.bedrooms} bed · ${v.bathrooms} bath · sleeps ${v.max_guests}`}
                                    price={v.price_per_night}
                                    priceLabel="/ night"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Full-screen viewer */}
            {lightbox && images.length > 0 && (
                <div className="fixed inset-0 z-[60] bg-ink/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
                    <button
                        type="button"
                        onClick={() => setLightbox(false)}
                        className="absolute top-4 right-4 text-paper/80 hover:text-paper p-2 text-2xl leading-none"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-3 md:left-6 text-paper/80 hover:text-paper p-3 text-3xl"
                                aria-label="Previous photo"
                            >
                                ‹
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-3 md:right-6 text-paper/80 hover:text-paper p-3 text-3xl"
                                aria-label="Next photo"
                            >
                                ›
                            </button>
                        </>
                    )}
                    <img
                        src={images[active]}
                        alt={`${villa.name} photo ${active + 1}`}
                        className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <p className="absolute bottom-5 text-paper/70 text-sm">{active + 1} / {images.length}</p>
                </div>
            )}
        </SiteLayout>
    );
}