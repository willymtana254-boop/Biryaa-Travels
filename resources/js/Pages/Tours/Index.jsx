import { Head, router } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import ListingCard from '../../Components/ListingCard';
import { PageHeader, FilterPill, EmptyState } from '../../Components/UI';

const CATEGORY_INFO = {
    marine: {
        label: 'Marine',
        video: '/videos/experiences/marine.mp4',
        blurb: 'Reef dives, dolphin spotting and boat safaris across the Watamu and Diani marine parks.',
    },
    cultural: {
        label: 'Cultural',
        video: '/videos/experiences/cultural.mp4',
        blurb: 'Old Town walks, Swahili heritage sites and local craft markets along the coast.',
    },
    city: {
        label: 'City',
        video: '/videos/experiences/city.mp4',
        blurb: 'Guided tours through Mombasa\u2019s historic streets, markets and old port.',
    },
    golf: {
        label: 'Golf',
        video: '/videos/experiences/golf.mp4',
        blurb: 'Championship coastal courses at Vipingo Ridge and beyond.',
    },
    wildlife: {
        label: 'Wildlife',
        video: '/videos/experiences/wildlife.mp4',
        blurb: 'Forest reserves, primate sanctuaries and birdwatching across the region.',
    },
};

export default function ToursIndex({ tours, locations, categories, filters }) {
    const update = (key, value) => {
        const next = { ...filters };
        if (next[key] == value) delete next[key];
        else next[key] = value;
        router.get('/experiences', next, { preserveState: true, replace: true });
    };

    const activeCategory = filters.category && CATEGORY_INFO[filters.category] ? filters.category : null;

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

                {/* Category video panel */}
                <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        activeCategory ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr]'
                    }`}
                >
                    <div className="overflow-hidden">
                        {activeCategory && (
                            <div className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-end">
                                <video
                                    key={activeCategory}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    src={CATEGORY_INFO[activeCategory].video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    aria-label={`${CATEGORY_INFO[activeCategory].label} experiences preview`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                                <button
                                    type="button"
                                    onClick={() => update('category', activeCategory)}
                                    className="absolute top-4 right-4 rounded-full bg-ink/40 backdrop-blur px-3 py-1.5 text-xs font-medium text-paper hover:bg-ink/60 transition-colors"
                                >
                                    Close preview
                                </button>

                                <div className="relative p-6 sm:p-8 max-w-xl">
                                    <p className="text-rust font-medium text-xs uppercase tracking-wide mb-2">
                                        {CATEGORY_INFO[activeCategory].label} Experiences
                                    </p>
                                    <p className="text-paper text-lg sm:text-xl font-display font-semibold leading-snug">
                                        {CATEGORY_INFO[activeCategory].blurb}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
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