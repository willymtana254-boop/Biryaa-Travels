import { Head, router } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';
import { PageHeader, FilterPill, EmptyState } from '../../Components/UI';

export default function VillasIndex({ villas, locations, filters }) {
    const setLocation = (locationId) => {
        router.get('/villas', locationId === filters.location ? {} : { location: locationId }, { preserveState: true, replace: true });
    };

    return (
        <SiteLayout>
            <Head title="Villa Concierge & Holiday Homes" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Villa Concierge"
                    title="Handpicked villas along the coast"
                    description="Beachfront villas and holiday homes, matched to your destination, group size and budget."
                />

                <div className="mt-8 flex flex-wrap gap-2">
                    {locations.map((loc) => (
                        <FilterPill key={loc.id} active={filters.location == loc.id} onClick={() => setLocation(loc.id)}>
                            {loc.name}
                        </FilterPill>
                    ))}
                </div>

                <div className="mt-10">
                    {villas.length === 0 ? (
                        <EmptyState title="No villas match that filter" description="Try a different destination or message us for something custom." />
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {villas.map((v) => (
                                <ListingCard
                                    key={v.id}
                                    href={`/villas/${v.slug}`}
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
