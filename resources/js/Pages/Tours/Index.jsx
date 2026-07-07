import { Head, router } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';
import { PageHeader, FilterPill, EmptyState } from '../../Components/UI';

export default function ToursIndex({ tours, locations, categories, filters }) {
    const update = (key, value) => {
        const next = { ...filters };
        if (next[key] == value) delete next[key];
        else next[key] = value;
        router.get('/experiences', next, { preserveState: true, replace: true });
    };

    return (
        <SiteLayout>
            <Head title="Tours & Experiences" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Experiences & Excursions"
                    title="The Kenyan Coast, curated"
                    description="Marine parks, cultural walks, city tours, golf and private chauffeur-driven excursions."
                />

                <div className="mt-8 flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <FilterPill key={c} active={filters.category === c} onClick={() => update('category', c)}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </FilterPill>
                    ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {locations.map((loc) => (
                        <FilterPill key={loc.id} active={filters.location == loc.id} onClick={() => update('location', loc.id)}>
                            {loc.name}
                        </FilterPill>
                    ))}
                </div>

                <div className="mt-10">
                    {tours.length === 0 ? (
                        <EmptyState title="No experiences match that filter" description="Try clearing a filter or ask us on WhatsApp for ideas." />
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {tours.map((t) => (
                                <ListingCard
                                    key={t.id}
                                    href={`/experiences/${t.slug}`}
                                    title={t.name}
                                    eyebrow={t.location?.name}
                                    meta={`${t.duration_hours}h · ${t.category}`}
                                    price={t.price}
                                    priceLabel="/ person"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
