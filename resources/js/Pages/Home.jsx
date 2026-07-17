import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import CoastRoute from '../Components/CoastRoute';
import ListingCard from '../Components/ListingCard';
import AboutServices from '../Components/AboutServices';
import Testimonials from '../Components/Testimonials';

export default function Home({ locations = [], featuredVehicles = [], featuredVillas = [], featuredTours = [] }) {
    return (
        <SiteLayout>
            <Head title="Car Hire, Transfers, Villas & Experiences on the Kenyan Coast" />

            <section className="relative overflow-hidden min-h-[85vh] flex items-center">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/videos/15923194_1080_1920_30fps.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/40 to-ink/10" />

                <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
                    <p className="text-rust font-medium text-sm tracking-wide uppercase mb-4">Kenyan Coast, one booking at a time</p>
                    <h1 className="font-display text-5xl md:text-6xl text-paper font-semibold leading-[1.05] max-w-3xl">
                        Book your coastline, stop by stop.
                    </h1>
                    <p className="mt-6 text-lg text-paper/80 max-w-2xl leading-relaxed">
                        Self-drive cars, airport transfers, beachfront villas and curated experiences —
                        reserved online, confirmed in minutes, across Kilifi, Mombasa, Diani, Watamu, Malindi and Vipingo.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link href="/car-hire" className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors">
                            Hire a Car
                        </Link>
                        <Link href="/villas" className="rounded-full border border-paper/40 text-paper px-6 py-3 font-medium hover:border-paper hover:bg-paper/10 transition-colors">
                            Find a Villa
                        </Link>
                    </div>

                    <div className="mt-16 text-paper hidden md:block">
                        <CoastRoute className="w-full max-w-3xl h-24" />
                    </div>
                </div>
            </section>

            <AboutServices />

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

            <Testimonials />

            <section id="destinations" className="bg-tide py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-baseline justify-between mb-4">
                        <h2 className="font-display text-2xl text-paper font-semibold">Where we serve</h2>
                        <span className="text-sm text-paper/50">{locations.length} destinations along the coast</span>
                    </div>
                    <p className="text-paper/60 max-w-xl mb-12">
                        Every booking is anchored to a real stop on the coast — pick a destination or let a
                        route pick you.
                    </p>

                    <div className="text-paper">
                        <CoastRoute className="w-full h-40" />
                    </div>

                    {locations.length > 0 && (
                        <div className="mt-10 flex flex-wrap gap-3">
                            {locations.map((loc) => (
                                <span key={loc.id} className="px-4 py-2 rounded-full border border-paper/20 text-sm text-paper/70">
                                    {loc.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
