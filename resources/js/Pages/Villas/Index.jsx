import { Head, router } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';
import { PageHeader, FilterPill, EmptyState } from '../../Components/UI';

const selectClass = 'rounded-lg border border-ink/20 px-3 py-2 text-sm bg-white';

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
            <img src="/images/Accommodation background.jpg" alt="Accommodation background" className="w-full h-96 object-cover" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Accommodation"
                    title="Stay anywhere along the Kenyan Coast"
                    description="From Lamu's old stone houses to Diani's beachfront retreats — handpicked accommodation and holiday homes matched to your destination, group size and budget."
                />

                <div className="mt-8 flex flex-wrap gap-2">
                    {locations.map((loc) => (
                        <FilterPill
                            key={loc.id}
                            active={String(filters.location) === String(loc.id)}
                            onClick={() => toggleLocation(loc.id)}
                        >
                            {loc.name}
                        </FilterPill>
                    ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <select className={selectClass} value={filters.guests || ''} onChange={(e) => setFilter('guests', e.target.value)}>
                        <option value="">Any group size</option>
                        {[2, 4, 6, 8, 10, 12].map((n) => <option key={n} value={n}>{n}+ guests</option>)}
                    </select>

                    <select className={selectClass} value={filters.bedrooms || ''} onChange={(e) => setFilter('bedrooms', e.target.value)}>
                        <option value="">Any bedrooms</option>
                        {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}+ bedrooms</option>)}
                    </select>

                    <select className={selectClass} value={filters.max_price || ''} onChange={(e) => setFilter('max_price', e.target.value)}>
                        <option value="">Any budget</option>
                        {[150, 200, 250, 300, 400].map((n) => <option key={n} value={n}>Up to ${n}/night</option>)}
                    </select>

                    <select className={selectClass} value={filters.sort || ''} onChange={(e) => setFilter('sort', e.target.value)}>
                        <option value="">Price: low to high</option>
                        <option value="price_desc">Price: high to low</option>
                    </select>

                    {hasFilters && (
                        <button type="button" onClick={() => apply({})} className="text-sm font-medium text-rust hover:underline">
                            Clear filters
                        </button>
                    )}
                </div>

                <p className="mt-6 text-sm text-ink/50">
                    {villas.length} {villas.length === 1 ? 'stay' : 'stays'} found
                </p>

                <div className="mt-4">
                    {villas.length === 0 ? (
                        <EmptyState title="No accommodation matches those filters" description="Try widening your budget or group size, or message us for something custom." />
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
        </SiteLayout>
    );
}