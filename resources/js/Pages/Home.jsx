import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import CoastRoute from '../Components/CoastRoute';
import ListingCard from '../Components/ListingCard';

const services = [
    { href: '/car-hire', title: 'Self-Drive Car Hire', copy: 'Economy, midsize, SUV and executive vehicles by the day.' },
    { href: '/airport-transfers', title: 'Airport Transfers', copy: 'Fixed-price rides from Mombasa, Ukunda and Malindi airports.' },
    { href: '/villas', title: 'Villa Concierge', copy: 'Handpicked beachfront villas and holiday homes.' },
    { href: '/experiences', title: 'Tours & Experiences', copy: 'Marine parks, old-town walks, golf and private excursions.' },
];

export default function Home({ locations = [], featuredVehicles = [], featuredVillas = [], featuredTours = [] }) {
    return (
        <SiteLayout>
            <Head title="Car Hire, Transfers, Villas & Experiences on the Kenyan Coast" />

            <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
                <p className="text-rust font-medium text-sm tracking-wide uppercase mb-4">Kenyan Coast, one booking at a time</p>
                <h1 className="font-display text-5xl md:text-6xl text-tide font-semibold leading-[1.05] max-w-3xl">
                    Book your coastline, stop by stop.
                </h1>
                <p className="mt-6 text-lg text-ink/70 max-w-2xl leading-relaxed">
                    Self-drive cars, airport transfers, beachfront villas and curated experiences —
                    reserved online, confirmed in minutes, across Kilifi, Mombasa, Diani, Watamu, Malindi and Vipingo.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/car-hire" className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors">
                        Hire a Car
                    </Link>
                    <Link href="/villas" className="rounded-full border border-ink/20 px-6 py-3 font-medium hover:border-tide hover:text-tide transition-colors">
                        Find a Villa
                    </Link>
                </div>

                <div className="mt-16 text-tide/70">
                    <CoastRoute className="w-full max-w-3xl h-28" />
                </div>
            </section>

            <section className="bg-sand/60 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="font-display text-2xl text-tide font-semibold mb-8">Everything for the trip, in one place</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {services.map((s) => (
                            <Link key={s.href} href={s.href} className="block rounded-2xl bg-white/70 border border-ink/10 p-6 hover:-translate-y-0.5 hover:shadow-md transition-all">
                                <h3 className="font-display text-lg text-tide font-semibold">{s.title}</h3>
                                <p className="mt-2 text-sm text-ink/60 leading-relaxed">{s.copy}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {featuredVehicles.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-16">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="font-display text-2xl text-tide font-semibold">Popular vehicles</h2>
                        <Link href="/car-hire" className="text-sm font-medium text-rust hover:underline">View all →</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {featuredVehicles.map((v) => (
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
                </section>
            )}

            {featuredVillas.length > 0 && (
                <section className="bg-tide/5 py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex items-baseline justify-between mb-8">
                            <h2 className="font-display text-2xl text-tide font-semibold">Featured villas</h2>
                            <Link href="/villas" className="text-sm font-medium text-rust hover:underline">View all →</Link>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {featuredVillas.map((v) => (
                                <ListingCard
                                    key={v.id}
                                    href={`/villas/${v.slug}`}
                                    title={v.name}
                                    eyebrow={v.location?.name}
                                    meta={`${v.bedrooms} bed · sleeps ${v.max_guests}`}
                                    price={v.price_per_night}
                                    priceLabel="/ night"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {featuredTours.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-16">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="font-display text-2xl text-tide font-semibold">Experiences worth the trip</h2>
                        <Link href="/experiences" className="text-sm font-medium text-rust hover:underline">View all →</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {featuredTours.map((t) => (
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
                </section>
            )}

            <section className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="font-display text-2xl text-tide font-semibold mb-8">Where we serve</h2>
                <div className="flex flex-wrap gap-3">
                    {locations.map((loc) => (
                        <span key={loc.id} className="px-4 py-2 rounded-full border border-ink/15 text-sm text-ink/70">
                            {loc.name}
                        </span>
                    ))}
                </div>
            </section>
        </SiteLayout>
    );
}
