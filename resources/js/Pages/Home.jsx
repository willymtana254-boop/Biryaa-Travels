import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import CoastRoute from '../Components/CoastRoute';
import AboutServices from '../Components/AboutServices';

export default function Home({ locations = [] }) {
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
        </SiteLayout>
    );
}