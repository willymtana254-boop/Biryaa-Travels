import { Money } from '../../lib/currency';
import { useState, useEffect, useRef } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { PageHeader, EmptyState } from '../../Components/UI';

function TypeaheadField({ options, value, onSelect, placeholder }) {
    const selected = options.find((o) => String(o.id) === String(value));
    const [query, setQuery] = useState(selected?.name || '');
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const match = options.find((o) => String(o.id) === String(value));
        setQuery(match?.name || '');
    }, [value, options]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('touchstart', onClickOutside);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('touchstart', onClickOutside);
        };
    }, []);

    const filtered = query
        ? options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
        : options;

    const choose = (option) => {
        onSelect(option.id);
        setQuery(option.name);
        setOpen(false);
    };

    return (
        <div className="flex-1 relative" ref={containerRef}>
            <input
                value={query}
                placeholder={placeholder}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    if (e.target.value === '') onSelect('');
                }}
                className="w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm bg-white"
                autoComplete="off"
            />
            {open && filtered.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-ink/10 bg-white shadow-lg">
                    {filtered.map((o) => (
                        <button
                            key={o.id}
                            type="button"
                            onClick={() => choose(o)}
                            className="block w-full text-left px-4 py-2.5 text-sm hover:bg-sand transition-colors"
                        >
                            {o.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TransfersIndex({ routes, locations = [], filters }) {
    const update = (key, id) => {
        router.get('/airport-transfers', { ...filters, [key]: id || undefined }, { preserveState: true, replace: true });
    };

    const swap = () => {
        router.get('/airport-transfers', { from: filters.to, to: filters.from }, { preserveState: true, replace: true });
    };

    return (
        <SiteLayout>
            <Head title="Airport & SGR Transfers" />

            <div className="relative">
                <div className="fixed inset-0 z-0 overflow-hidden">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src="/videos/transfers-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-tide/70" />
                </div>

                <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
                    <PageHeader
                        eyebrow="Airport & SGR Transfers"
                        title="A driver waiting the moment you arrive"
                        description="Fixed, distance-based pricing between airports, SGR stations and any town on the Kenyan Coast — pick either point in either field."
                    />

                    {locations.length === 0 && (
                        <p className="mt-6 text-sm text-rust bg-rust/10 rounded-lg px-4 py-3">
                            No locations found in the database. Run <code className="font-mono">php artisan migrate:fresh --seed</code> and refresh this page.
                        </p>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-2xl relative z-20">
                        <TypeaheadField
                            options={locations}
                            value={filters.from}
                            onSelect={(id) => update('from', id)}
                            placeholder="From: town, airport or station…"
                        />

                        <button
                            type="button"
                            onClick={swap}
                            className="shrink-0 self-center rounded-full border border-ink/20 p-2 text-ink/60 hover:text-tide hover:border-tide transition-colors bg-white"
                            aria-label="Swap"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>

                        <TypeaheadField
                            options={locations}
                            value={filters.to}
                            onSelect={(id) => update('to', id)}
                            placeholder="To: town, airport or station…"
                        />
                    </div>

                    <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10 relative z-10">
                        {routes.length === 0 ? (
                            <div className="py-10">
                                <EmptyState title="No routes match that search" description="Try a different pair, or ask us on WhatsApp for a custom quote." />
                            </div>
                        ) : (
                            routes.map((r) => (
                                <div key={r.id} className="flex items-center justify-between py-5 gap-4">
                                    <div>
                                        <p className="font-display text-lg text-tide font-semibold">
                                            {r.from_location.name} → {r.to_location.name}
                                        </p>
                                        <p className="text-sm text-ink/60 mt-1">
                                            {r.vehicle_category.replace('_', ' ')}
                                            {r.distance_km && ` · ${r.distance_km} km`}
                                            {r.duration_minutes && ` · ~${r.duration_minutes} min`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="font-semibold text-ink"><Money usd={r.price} /></span>
                                        <Link
                                            href={`/book/transfer/${r.id}`}
                                            className="rounded-full bg-tide text-paper px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors"
                                        >
                                            Book
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}