import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';

// Edit the wording here. Everything on the page comes from these lists.
const about = {
    heading: 'Your coastal travel partner',
    paragraphs: [
        'Biryaa Travels Ltd is a Mombasa-based travel company serving visitors and residents across the Kenyan Coast, from Diani and Mombasa to Kilifi, Watamu and Malindi.',
        'We bring car hire, airport and SGR transfers, accommodation and local experiences together in one place, with clear prices in Kenya shillings and a real person to talk to.',
    ],
    slogan: 'Twende Tuzuru',
};

const services = [
    {
        title: 'Car Hire',
        text: 'Economy cars to SUVs and vans, with live availability so you can see which cars are free and when the booked ones return.',
        href: '/car-hire',
        cta: 'Browse cars',
    },
    {
        title: 'Airport & SGR Transfers',
        text: 'A driver waiting at Moi International, Ukunda, Malindi or the SGR stations, with a fixed price shown before you book.',
        href: '/airport-transfers',
        cta: 'Get a transfer price',
    },
    {
        title: 'Accommodation',
        text: 'Villas, cottages and beach stays across the coast, with photos, guest numbers and prices per night.',
        href: '/villas',
        cta: 'Find a place to stay',
    },
    {
        title: 'Tours & Experiences',
        text: 'Local experiences with ratings and photos from guests who have actually taken them.',
        href: '/experiences',
        cta: 'See experiences',
    },
];

const reasons = [
    { title: 'Clear prices', text: 'See the total in Kenya shillings before you book. No surprises at pickup.' },
    { title: 'Real availability', text: 'Cars and stays show what is free, so your booking is not double-booked.' },
    { title: 'Honest reviews', text: 'Only guests with a real booking can leave a review, and we check each one.' },
    { title: 'Local knowledge', text: 'We live and work on the coast and know the roads, the beaches and the best times to go.' },
    { title: 'Easy payment', text: 'Pay by bank transfer or cash on arrival, with M-Pesa on the way.' },
    { title: 'Help on WhatsApp', text: 'Message us any time and a real person will answer.' },
];

const mission =
    'To make exploring the Kenyan Coast simple, safe and memorable, by giving every traveller honest prices, reliable service and a warm welcome.';

function Check() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
        </svg>
    );
}

export default function About() {
    return (
        <SiteLayout>
            <Head title="About Us & Services" />

            {/* Page header (same as Contact Us) */}
            <section className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FCCA14] mb-3">Biryaa Travels Ltd</p>
                    <h1 className="font-display text-4xl md:text-5xl font-semibold">About Us &amp; Services</h1>
                    <p className="mt-4 max-w-xl text-paper/80">Who we are, what we do and why travellers choose us.</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] to-[#FCCA14]" />
            </section>

            {/* Who we are */}
            <section className="max-w-6xl mx-auto px-6 pt-14 grid lg:grid-cols-5 gap-10 items-center">
                <div className="lg:col-span-3">
                    <h2 className="font-display text-3xl text-tide font-semibold">{about.heading}</h2>
                    <div className="mt-4 space-y-4 text-ink/75 leading-relaxed">
                        {about.paragraphs.map((p) => (
                            <p key={p}>{p}</p>
                        ))}
                    </div>
                    <p className="mt-5 italic font-display text-xl text-tide">“{about.slogan}”</p>
                </div>
                <div className="lg:col-span-2 flex justify-center">
                    <div className="rounded-2xl bg-white border border-ink/10 p-8">
                        <img src="/images/biryaa-logo.png" alt="Biryaa Travels" className="h-40 w-auto" />
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="max-w-6xl mx-auto px-6 py-14">
                <p className="text-xs uppercase tracking-[0.25em] text-tide-light mb-2">What we do</p>
                <h2 className="font-display text-3xl text-tide font-semibold">Our Services</h2>

                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                    {services.map((s) => (
                        <div key={s.title} className="rounded-2xl bg-white border border-ink/10 p-6 flex flex-col">
                            <p className="font-display text-xl text-tide font-semibold">{s.title}</p>
                            <p className="mt-2 text-sm text-ink/70 leading-relaxed flex-1">{s.text}</p>
                            <Link href={s.href} className="mt-4 text-sm font-medium text-tide hover:underline">
                                {s.cta} →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why choose us */}
            <section className="bg-sand/60">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <p className="text-xs uppercase tracking-[0.25em] text-tide-light mb-2">The Biryaa difference</p>
                    <h2 className="font-display text-3xl text-tide font-semibold">Why Choose Us</h2>

                    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {reasons.map((r) => (
                            <div key={r.title} className="flex gap-4 rounded-2xl bg-white border border-ink/10 p-5">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-tide/10 text-tide flex items-center justify-center">
                                    <Check />
                                </div>
                                <div className="text-sm">
                                    <p className="font-display text-base text-tide font-semibold">{r.title}</p>
                                    <p className="mt-1 text-ink/70 leading-relaxed">{r.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="bg-tide text-paper">
                <div className="max-w-4xl mx-auto px-6 py-14 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FCCA14] mb-3">Our Mission</p>
                    <p className="font-display text-2xl md:text-3xl leading-snug">{mission}</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] to-[#FCCA14]" />
            </section>

            {/* Call to action */}
            <section className="max-w-6xl mx-auto px-6 py-14 text-center">
                <h2 className="font-display text-2xl text-tide font-semibold">Ready to plan your trip?</h2>
                <p className="mt-2 text-ink/70">Book online or talk to us. We are happy to help.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/contact" className="rounded-full bg-[#FCCA14] text-ink px-7 py-3 text-sm font-medium hover:brightness-95 transition">
                        Contact us
                    </Link>
                    <a
                        href="https://wa.me/254728769798"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[#25D366] text-white px-7 py-3 text-sm font-medium hover:brightness-95 transition"
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            </section>
        </SiteLayout>
    );
}
