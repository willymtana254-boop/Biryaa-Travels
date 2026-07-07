import { Head, router } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';
import { PageHeader, FilterPill, EmptyState } from '../../Components/UI';

export default function VehiclesIndex({ vehicles, categories, filters }) {
    const setCategory = (category) => {
        router.get('/car-hire', category === filters.category ? {} : { category }, { preserveState: true, replace: true });
    };

    return (
        <SiteLayout>
            <Head title="Self-Drive Car Hire" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Self-Drive Car Hire"
                    title="Drive the coast at your own pace"
                    description="Economy, midsize, SUV, executive, van and bus options — 24-hour hire periods, roadside support included."
                />

                <div className="mt-8 flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <FilterPill key={c} active={filters.category === c} onClick={() => setCategory(c)}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </FilterPill>
                    ))}
                </div>

                <div className="mt-10">
                    {vehicles.length === 0 ? (
                        <EmptyState title="No vehicles match that filter" description="Try another category or message us on WhatsApp for a custom fit." />
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {vehicles.map((v) => (
                                <ListingCard
                                    key={v.id}
                                    href={`/car-hire/${v.id}`}
                                    title={v.name}
                                    eyebrow={v.category}
                                    meta={`${v.seats} seats · ${v.transmission}`}
                                    price={v.price_per_day}
                                    priceLabel="/ day"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
