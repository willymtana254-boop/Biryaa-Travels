import { Money } from '../../lib/currency';
import { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import Stars from '../../Components/Stars';

export default function ToursShow({ tour, cover, summary, reviews = [], photos = [] }) {
    const [viewer, setViewer] = useState(null); // { list, index }

    const open = (list, url) => setViewer({ list, index: Math.max(0, list.indexOf(url)) });
    const close = useCallback(() => setViewer(null), []);
    const step = useCallback(
        (d) => setViewer((v) => v && { ...v, index: (v.index + d + v.list.length) % v.list.length }),
        []
    );

    useEffect(() => {
        if (!viewer) return;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [viewer, close, step]);

    const hero = tour.images?.[0] || cover;
    const reviewUrl = `/experiences/${tour.slug}/review`;

    return (
        <SiteLayout>
            <Head title={tour.name} />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <Link href="/experiences" className="text-sm text-ink/50 hover:text-tide">← All experiences</Link>

                <div className="mt-4 aspect-[16/9] rounded-2xl overflow-hidden bg-sand">
                    {hero ? (
                        <img src={hero} alt={tour.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-tide to-lagoon flex items-center justify-center text-paper font-display text-2xl md:text-3xl px-6 text-center">
                            {tour.name}
                        </div>
                    )}
                </div>

                <div className="mt-10 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">
                            {tour.location?.name} · {tour.category}
                        </p>
                        <h1 className="font-display text-3xl md:text-4xl text-tide font-semibold">{tour.name}</h1>

                        {summary.count > 0 ? (
                            <div className="mt-3 flex items-center gap-2">
                                <Stars value={summary.average} size={18} />
                                <span className="font-medium">{Number(summary.average).toFixed(1)}</span>
                                <span className="text-sm text-ink/50">
                                    ({summary.count} {summary.count === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-ink/50">No reviews yet — be the first to share yours.</p>
                        )}

                        <p className="mt-3 text-ink/60">Approx. {tour.duration_hours} hours</p>
                        <p className="mt-6 text-ink/70 leading-relaxed text-lg">{tour.description}</p>
                    </div>

                    <div className="rounded-2xl border border-ink/10 p-6 h-fit md:sticky md:top-24 bg-white/60">
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-3xl text-ink font-semibold"><Money usd={tour.price} /></span>
                            <span className="text-ink/50">/ person</span>
                        </div>
                        <Link
                            href={`/book/tour/${tour.id}`}
                            className="mt-5 w-full inline-flex justify-center items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                        >
                            Reserve this experience
                        </Link>
                        <Link
                            href={reviewUrl}
                            className="mt-3 w-full inline-flex justify-center items-center rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:border-tide hover:text-tide transition-colors"
                        >
                            Been here? Share your photos
                        </Link>
                    </div>
                </div>

                {photos.length > 0 && (
                    <section className="mt-14">
                        <h2 className="font-display text-2xl text-tide font-semibold mb-4">Photos from our guests</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {photos.slice(0, 8).map((url) => (
                                <button
                                    key={url}
                                    type="button"
                                    onClick={() => open(photos, url)}
                                    className="aspect-square rounded-xl overflow-hidden bg-sand"
                                >
                                    <img src={url} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mt-14">
                    <h2 className="font-display text-2xl text-tide font-semibold mb-6">Guest reviews</h2>

                    {summary.count > 0 && (
                        <div className="mb-8 max-w-sm space-y-1.5">
                            {summary.distribution.map((row) => (
                                <div key={row.stars} className="flex items-center gap-3 text-sm">
                                    <span className="w-8 text-ink/60">{row.stars} ★</span>
                                    <div className="flex-1 h-2 rounded-full bg-ink/10 overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${(row.count / summary.count) * 100}%` }} />
                                    </div>
                                    <span className="w-6 text-right text-ink/50">{row.count}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {reviews.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-ink/15 p-10 text-center">
                            <p className="font-display text-xl text-tide">No reviews yet</p>
                            <p className="mt-2 text-sm text-ink/60">Went on this experience? Tell other travellers what it was really like.</p>
                            <Link href={reviewUrl} className="inline-block mt-4 text-sm font-medium text-rust hover:underline">
                                Write the first review →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-ink/10 border-y border-ink/10">
                            {reviews.map((r) => (
                                <article key={r.id} className="py-6">
                                    <div className="flex items-center gap-3">
                                        <Stars value={r.rating} size={16} />
                                        <span className="text-sm font-medium">{r.name}</span>
                                        {r.visited_on && <span className="text-xs text-ink/40">· Visited {r.visited_on}</span>}
                                    </div>
                                    {r.title && <h3 className="mt-2 font-medium text-ink">{r.title}</h3>}
                                    <p className="mt-2 text-ink/70 leading-relaxed whitespace-pre-line">{r.body}</p>

                                    {r.photos.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {r.photos.map((url) => (
                                                <button key={url} type="button" onClick={() => open(r.photos, url)} className="w-24 h-24 rounded-lg overflow-hidden bg-sand">
                                                    <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {r.reply && (
                                        <div className="mt-4 rounded-lg bg-sand/60 p-4 text-sm">
                                            <p className="font-medium text-tide mb-1">Reply from Biryaa Travels</p>
                                            <p className="text-ink/70 whitespace-pre-line">{r.reply}</p>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {viewer && (
                <div className="fixed inset-0 z-[60] bg-ink/95 flex items-center justify-center" onClick={close}>
                    <button type="button" onClick={close} className="absolute top-4 right-4 text-paper/80 hover:text-paper p-2 text-2xl leading-none" aria-label="Close">✕</button>
                    {viewer.list.length > 1 && (
                        <>
                            <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 md:left-6 text-paper/80 hover:text-paper p-3 text-3xl" aria-label="Previous">‹</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 md:right-6 text-paper/80 hover:text-paper p-3 text-3xl" aria-label="Next">›</button>
                        </>
                    )}
                    <img
                        src={viewer.list[viewer.index]}
                        alt=""
                        className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <p className="absolute bottom-5 text-paper/70 text-sm">{viewer.index + 1} / {viewer.list.length}</p>
                </div>
            )}
        </SiteLayout>
    );
}