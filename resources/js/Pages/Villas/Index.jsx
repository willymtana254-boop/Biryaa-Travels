import { Head, router } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';
import { FilterPill, EmptyState } from '../../Components/UI';

const selectClass = 'rounded-lg border border-white/40 px-3 py-2 text-sm bg-white/90 text-ink';
const shadow = { textShadow: '0 2px 10px rgba(0,0,0,0.8)' };

export default function VillasIndex({ villas, locations, filters }) {
    const apply = (next) => router.get('/villas', next, { preserveState: true, replace: true });

    const setFilter = (key, value) => {
        const next = { ...filters };
        if (value === '' || value === undefined || value === null) delete next[key];
        else next[key] = value;
        apply(next);
    };

    const toggleLocation = (id) =>
        setFilter('location', String(filters.location) === String(id) ? '' : id);

    const hasFilters = Object.keys(filters).length > 0;

    return (
        <SiteLayout>
            <Head title="Accommodation & Holiday Homes" />

            <div className="relative">
                {/* Background photo, original colours */}
                <div className="fixed inset-0 z-0 overflow-hidden">
                    <img src="/images/accommodation-bg.jpg" alt="" className="w-full h-full object-cover" />
                </div>

                {/* Page content sits above the photo */}
                <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
                    <div className="mb-10 text-white" style={shadow}>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/90 mb-3">Accommodation</p>
                        <h1 className="font-display text-4xl md:text-5xl font-semibold">
                            Stay anywhere along the Kenyan Coast
                        </h1>
                        <p className="mt-4 max-w-2xl text-white/90">
                            Hand-picked villas, cottages and beach stays from Diani to Lamu.
                        </p>
                    </div>

                    {/* Location pills */}
<div className="flex flex-wrap gap-2 mb-4">
    {locations.map((l) => {
        const active = String(filters.location) === String(l.id);
        return (
            <button
                key={l.id}
                type="button"
                onClick={() => toggleLocation(l.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium shadow transition-colors ${
                    active
                        ? 'bg-tide text-white'
                        : 'bg-white text-ink hover:bg-sand'
                }`}
            >
                {l.name}
            </button>
        );
    })}
</div>

                    {/* Other filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select className={selectClass} value={filters.guests || ''} onChange={(e) => setFilter('guests', e.target.value)}>
                            <option value="">Any guests</option>
                            {[2, 4, 6, 8, 10].map((n) => <option key={n} value={n}>{n}+ guests</option>)}
                        </select>
                        <select className={selectClass} value={filters.bedrooms || ''} onChange={(e) => setFilter('bedrooms', e.target.value)}>
                            <option value="">Any bedrooms</option>
                            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ bedrooms</option>)}
                        </select>
                        <select className={selectClass} value={filters.max_price || ''} onChange={(e) => setFilter('max_price', e.target.value)}>
                            <option value="">Any price</option>
                            {[5000, 10000, 20000, 40000].map((n) => <option key={n} value={n}>Up to KES {n.toLocaleString()}</option>)}
                        </select>
                        <select className={selectClass} value={filters.sort || ''} onChange={(e) => setFilter('sort', e.target.value)}>
                            <option value="">Sort: recommended</option>
                            <option value="price_asc">Price: low to high</option>
                            <option value="price_desc">Price: high to low</option>
                        </select>
                        {hasFilters && (
                            <button onClick={() => apply({})} className="text-sm text-white underline" style={shadow}>
                                Clear filters
                            </button>
                        )}
                    </div>

                    <p className="mt-6 text-sm text-white" style={shadow}>
                        {villas.length} {villas.length === 1 ? 'stay' : 'stays'} found
                    </p>

                    {/* Listings */}
                    <div className="mt-4">
                        {villas.length === 0 ? (
                            <div className="rounded-2xl bg-white/95 p-6">
                                <EmptyState
                                    title="No accommodation matches those filters"
                                    description="Try widening your budget or group size, or message us for something custom."
                                />
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {villas.map((v) => (
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
                        )}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}