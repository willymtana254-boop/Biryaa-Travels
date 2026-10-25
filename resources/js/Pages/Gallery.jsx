import { useEffect, useMemo, useState, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';

const WHATSAPP = '254728769798';

// Add your page addresses here. Empty ones are simply not shown.
const SOCIAL = [
    { name: 'Facebook', url: '' },
    { name: 'Instagram', url: '' },
    { name: 'TikTok', url: '' },
];

// Where "Book this" should lead for each kind of photo.
const BOOK_LINKS = {
    Stays: { href: '/villas', label: 'Find accommodation' },
    'Cars & Transfers': { href: '/car-hire', label: 'Hire a car' },
    Beaches: { href: '/villas', label: 'Plan a beach stay' },
};
const DEFAULT_LINK = { href: '/contact', label: 'Plan this trip' };

const quickLinks = [
    { href: '/car-hire', title: 'Car Hire', text: 'See which cars are free' },
    { href: '/airport-transfers', title: 'Transfers', text: 'Fixed airport & SGR prices' },
    { href: '/villas', title: 'Accommodation', text: 'Stays across the coast' },
    { href: '/contact', title: 'Talk to us', text: 'We reply fast' },
];

export default function Gallery({ photos, categories }) {
    const [filter, setFilter] = useState('All');
    const [active, setActive] = useState(null); // index into `shown`
    const [copied, setCopied] = useState(false);

    const shown = useMemo(
        () => (filter === 'All' ? photos : photos.filter((p) => p.category === filter)),
        [photos, filter]
    );

    const close = useCallback(() => setActive(null), []);
    const step = useCallback(
        (dir) => setActive((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
        [shown.length]
    );

    // Keyboard controls + stop the page scrolling behind the viewer
    useEffect(() => {
        if (active === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [active, close, step]);

    const current = active !== null ? shown[active] : null;
    const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/gallery` : '/gallery';
    const label = (p) => p.title || p.category || 'a Biryaa Travels photo';

    const enquire = (p) =>
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Biryaa Travels, I saw "${label(p)}" in your gallery and I would like to know more.`)}`;

    const share = async (p) => {
        const text = `${label(p)} — Biryaa Travels, Kenyan Coast`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Biryaa Travels', text, url: pageUrl });
                return;
            } catch {
                /* cancelled: fall through to copy */
            }
        }
        try {
            await navigator.clipboard.writeText(pageUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${pageUrl}`)}`, '_blank');
        }
    };

    const tabs = ['All', ...categories];
    const socials = SOCIAL.filter((s) => s.url);

    return (
        <SiteLayout>
            <Head title="Gallery" />

            {/* Page header (same as Contact Us) */}
            <section className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FCCA14] mb-3">Biryaa Travels Ltd</p>
                    <h1 className="font-display text-4xl md:text-5xl font-semibold">Gallery</h1>
                    <p className="mt-4 max-w-xl text-paper/80">The Kenyan Coast through our lens. Twende Tuzuru.</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] to-[#FCCA14]" />
            </section>

            <section className="max-w-6xl mx-auto px-6 py-14">
                <h2 className="font-display text-3xl text-tide font-semibold text-center">Take a look at our gallery</h2>

                {/* Category tabs */}
                {tabs.length > 2 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {tabs.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFilter(t)}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                                    filter === t ? 'bg-tide text-white' : 'bg-white border border-ink/15 text-ink/70 hover:border-tide'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}

                {/* Photo wall */}
                {shown.length === 0 ? (
                    <div className="mt-10 rounded-2xl bg-white border border-ink/10 p-10 text-center">
                        <p className="font-display text-xl text-tide font-semibold">Photos coming soon</p>
                        <p className="mt-2 text-sm text-ink/60">We are adding fresh photos of the coast. Meanwhile, tell us what you have in mind.</p>
                        <Link href="/contact" className="mt-5 inline-block rounded-full bg-[#FCCA14] text-ink px-6 py-2.5 text-sm font-medium">
                            Contact us
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
                        {shown.map((p, i) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setActive(i)}
                                className="group relative block w-full overflow-hidden rounded-2xl break-inside-avoid bg-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-tide-light"
                            >
                                <img
                                    src={p.url}
                                    alt={label(p)}
                                    loading="lazy"
                                    width={p.width || undefined}
                                    height={p.height || undefined}
                                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                                />
                                {(p.title || p.category) && (
                                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-left text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        {p.title || p.category}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Quick links: turn looking into booking */}
            <section className="bg-sand/60">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <h2 className="font-display text-2xl text-tide font-semibold text-center">Like what you see? Make it yours.</h2>
                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickLinks.map((q) => (
                            <Link
                                key={q.href}
                                href={q.href}
                                className="rounded-2xl bg-white border border-ink/10 p-5 hover:border-tide transition-colors"
                            >
                                <p className="font-display text-lg text-tide font-semibold">{q.title}</p>
                                <p className="mt-1 text-sm text-ink/60">{q.text}</p>
                                <p className="mt-3 text-sm font-medium text-tide">Go →</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust + social */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <p className="font-display text-xl text-tide font-semibold">Hear it from our guests</p>
                <p className="mt-2 text-sm text-ink/65">Real stories and photos from travellers who booked with us.</p>
                <Link href="/guest-stories" className="mt-4 inline-block rounded-full border border-tide text-tide px-6 py-2.5 text-sm font-medium hover:bg-tide hover:text-white transition-colors">
                    Read guest stories
                </Link>

                {socials.length > 0 && (
                    <div className="mt-8">
                        <p className="text-xs uppercase tracking-[0.25em] text-ink/50">Follow our journeys</p>
                        <div className="mt-3 flex justify-center gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full bg-white border border-ink/15 px-5 py-2 text-sm font-medium hover:border-tide hover:text-tide transition-colors"
                                >
                                    {s.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Photo viewer */}
            {current && (
                <div className="fixed inset-0 z-[60] flex flex-col bg-black/90" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-between px-4 py-3 text-white">
                        <p className="text-sm text-white/70">
                            {active + 1} / {shown.length}
                        </p>
                        <button type="button" onClick={close} aria-label="Close" className="p-2 text-white/80 hover:text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center min-h-0 px-2 sm:px-14" onClick={close}>
                        {shown.length > 1 && (
                            <button
                                type="button"
                                aria-label="Previous photo"
                                onClick={(e) => { e.stopPropagation(); step(-1); }}
                                className="absolute left-2 sm:left-4 z-10 rounded-full bg-white/15 hover:bg-white/30 text-white w-11 h-11 text-2xl leading-none"
                            >
                                ‹
                            </button>
                        )}
                        <img
                            src={current.url}
                            alt={label(current)}
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-full max-w-full object-contain rounded-lg"
                        />
                        {shown.length > 1 && (
                            <button
                                type="button"
                                aria-label="Next photo"
                                onClick={(e) => { e.stopPropagation(); step(1); }}
                                className="absolute right-2 sm:right-4 z-10 rounded-full bg-white/15 hover:bg-white/30 text-white w-11 h-11 text-2xl leading-none"
                            >
                                ›
                            </button>
                        )}
                    </div>

                    <div className="px-4 py-4 text-white text-center">
                        {current.title && <p className="font-display text-lg font-semibold">{current.title}</p>}
                        {current.caption && <p className="text-sm text-white/75 mt-1 max-w-xl mx-auto">{current.caption}</p>}

                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                            <a
                                href={enquire(current)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#25D366] px-5 py-2 text-sm font-medium text-white hover:brightness-95"
                            >
                                Ask about this on WhatsApp
                            </a>
                            <Link
                                href={(BOOK_LINKS[current.category] || DEFAULT_LINK).href}
                                className="rounded-full bg-[#FCCA14] px-5 py-2 text-sm font-medium text-ink hover:brightness-95"
                            >
                                {(BOOK_LINKS[current.category] || DEFAULT_LINK).label}
                            </Link>
                            <button
                                type="button"
                                onClick={() => share(current)}
                                className="rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white hover:bg-white/10"
                            >
                                {copied ? 'Link copied!' : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SiteLayout>
    );
}
