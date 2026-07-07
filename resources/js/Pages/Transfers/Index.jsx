import { Head, router, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { PageHeader, EmptyState } from '../../Components/UI';

export default function TransfersIndex({ routes, locations, filters }) {
    const update = (key, value) => {
        router.get('/airport-transfers', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    return (
        <SiteLayout>
            <Head title="Airport Transfers" />
            <div className="max-w-5xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Airport & SGR Transfers"
                    title="A driver waiting at arrivals, every time"
                    description="Fixed, distance-based pricing from Mombasa, Ukunda and Malindi airports to your hotel, villa or residence."
                />

                <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-lg">
                    <select
                        className="rounded-lg border border-ink/20 px-4 py-2.5 text-sm bg-white"
                        value={filters.from || ''}
                        onChange={(e) => update('from', e.target.value)}
                    >
                        <option value="">From…</option>
                        {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                    <select
                        className="rounded-lg border border-ink/20 px-4 py-2.5 text-sm bg-white"
                        value={filters.to || ''}
                        onChange={(e) => update('to', e.target.value)}
                    >
                        <option value="">To…</option>
                        {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                </div>

                <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                    {routes.length === 0 ? (
                        <div className="py-10"><EmptyState title="No routes match that search" description="Try a different combination or ask us on WhatsApp." /></div>
                    ) : (
                        routes.map((r) => (
                            <div key={r.id} className="flex items-center justify-between py-5">
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
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-ink">${Number(r.price).toLocaleString()}</span>
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
        </SiteLayout>
    );
}
