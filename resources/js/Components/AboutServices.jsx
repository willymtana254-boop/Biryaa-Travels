import { Link } from '@inertiajs/react';
import { PageHeader } from './UI';

const WHATSAPP = 'https://wa.me/254728769798';

const services = [
    {
        title: 'Airport & SGR Transfers',
        href: '/airport-transfers',
        items: ['Airport pickups & drop-offs', 'Hotel & villa transfers', 'SGR station transfers', 'Intercity travel'],
    },
    {
        title: 'Self-Drive Car Hire',
        href: '/car-hire',
        items: ['Economy & compact cars', 'SUVs & 4x4s', 'Executive vehicles', 'Long-term rentals'],
    },
    {
        title: 'Chauffeur Services',
        href: WHATSAPP,
        external: true,
        items: ['Executive transport', 'Weddings & events', 'Corporate travel', 'VIP transfers'],
    },
    {
        title: 'Villa Concierge',
        href: '/villas',
        items: ['Beach villas', 'Holiday homes', 'Family stays', 'Luxury retreats'],
    },
    {
        title: 'Experiences & Excursions',
        href: '/experiences',
        items: ['Island tours', 'Marine adventures', 'Sunset cruises', 'Cultural experiences'],
    },
];

const whyChoose = [
    {
        title: 'Coast-Wide Coverage',
        description: 'Serving Mombasa, Diani, Watamu, Malindi, Kilifi, Vipingo and surrounding destinations.',
    },
    {
        title: 'Verified Partners',
        description: 'We work with trusted transport providers, accommodation partners and experience operators.',
    },
    {
        title: 'Personalised Support',
        description: 'Receive recommendations and assistance tailored to your travel needs and preferences.',
    },
    {
        title: 'Seamless Planning',
        description: 'Coordinate transport, accommodation and experiences through one dedicated team.',
    },
    {
        title: 'Flexible Travel Solutions',
        description: 'Whether you\u2019re travelling for business, leisure or a special occasion, we adapt to your itinerary.',
    },
    {
        title: 'Reliable & Responsive Service',
        description: 'Our team is available to assist before, during and after your journey, ensuring a smooth travel experience from start to finish.',
    },
];

function Check({ className = 'text-rust' }) {
    return (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={`shrink-0 ${className}`}>
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function AboutServices() {
    return (
        <section id="services" className="bg-sand/60 py-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <PageHeader
                    eyebrow="About Biryaa Travels"
                    title="We Know This Coast Like Home"
                    description="Because it is. Biryaa Travels was built by people who live, work, and travel along Kenya's six coastal counties every day — not by a corporate office somewhere inland."
                />

                {/* Services */}
                <div className="mt-16">
                    <h3 className="font-display text-2xl text-tide font-semibold">Explore Our Core Services</h3>
                    <p className="mt-3 text-ink/70 max-w-2xl leading-relaxed">
                        From airport transfers and car hire to accommodation support and curated experiences,
                        discover the services that make travelling across the Kenyan Coast seamless and
                        stress-free.
                    </p>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((s) => {
                            const Card = s.external ? 'a' : Link;
                            const linkProps = s.external
                                ? { href: s.href, target: '_blank', rel: 'noreferrer' }
                                : { href: s.href };

                            return (
                                <Card
                                    key={s.title}
                                    {...linkProps}
                                    className="block rounded-2xl bg-white/70 border border-ink/10 p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
                                >
                                    <h4 className="font-display text-lg text-tide font-semibold mb-4">{s.title}</h4>
                                    <ul className="space-y-2">
                                        {s.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                                                <Check />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            );
                        })}
                    </div>

                    <a
                        href={WHATSAPP}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-10 inline-flex items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                    >
                        Plan Your Trip Now on WhatsApp
                    </a>
                </div>

                {/* Mission */}
                <div className="mt-24 max-w-2xl">
                    <p className="text-rust font-medium text-sm tracking-wide uppercase mb-3">Our Mission</p>
                    <h3 className="font-display text-2xl md:text-3xl text-tide font-semibold leading-tight">
                        Make the Kenyan Coast Accessible to Everyone
                    </h3>
                    <p className="mt-5 text-ink/70 leading-relaxed">
                        We believe the beauty of this coastline — the reefs, the ruins, the fishing towns, the
                        forest reserves — should not be locked behind confusing logistics. Our job is to get you
                        there safely, on time, and at a price you agreed to before you got in the car.
                    </p>
                </div>

                {/* Why choose */}
                <div className="mt-24">
                    <h3 className="font-display text-2xl text-tide font-semibold">Why Travellers Choose Biryaa Travels</h3>
                    <p className="mt-3 text-ink/70 max-w-2xl leading-relaxed">
                        From airport arrivals and self-drive rentals to villas and curated experiences, we make
                        travel across the Kenyan Coast simple, reliable and personalised.
                    </p>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whyChoose.map((f) => (
                            <div key={f.title} className="flex gap-3 p-1">
                                <Check className="text-tide mt-1" />
                                <div>
                                    <h4 className="font-medium text-ink">{f.title}</h4>
                                    <p className="mt-1 text-sm text-ink/60 leading-relaxed">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <a
                        href={WHATSAPP}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-10 inline-flex items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                    >
                        Plan Your Trip Now on WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}
