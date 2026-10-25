import { Head } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import NearbyMap from '../../Components/NearbyMap';
import LiveHotelLinks from '../../Components/LiveHotelLinks';

const shadow = { textShadow: '0 2px 14px rgba(0,0,0,0.75)' };

function SectionTitle({ eyebrow, title, text }) {
    return (
        <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-tide-light mb-2">{eyebrow}</p>
            <h2 className="font-display text-3xl text-tide font-semibold">{title}</h2>
            {text && <p className="mt-2 max-w-2xl text-ink/65">{text}</p>}
        </div>
    );
}

export default function VillasIndex() {
    return (
        <SiteLayout>
            <Head title="Accommodation & Holiday Homes" />

            {/* Hero: the photo at the top of the page */}
            <section className="relative h-[68vh] min-h-[440px] max-h-[640px] overflow-hidden bg-ink">
                <img
                    src="/images/accommodation-bg.jpg"
                    alt="A wooden beach cabin bedroom with a canopy bed and mosquito net"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Soft dark fade at the bottom only, so the photo keeps its colours */}
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/65 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:pb-16">
                    <div className="max-w-6xl mx-auto text-white" style={shadow}>
                        <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#FCCA14] mb-3">
                            Accommodation on the Kenyan Coast
                        </p>
                        <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight max-w-3xl">
                            Wake up to the sound of the Indian Ocean
                        </h1>
                        <p className="mt-4 max-w-xl text-white/90 md:text-lg">
                            Hand-picked villas, cottages and beach stays from Diani to Lamu, with clear prices in shillings and a team that knows the coast.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a href="#nearby" className="rounded-full bg-[#FCCA14] text-ink px-6 py-3 text-sm font-medium hover:brightness-95 transition">
                                Find places near me
                            </a>
                            <a href="#live" className="rounded-full bg-white/90 text-ink px-6 py-3 text-sm font-medium hover:bg-white transition">
                                Search live hotel listings
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real-time map: stays, hotels and restaurants near the visitor */}
            <section id="nearby" className="bg-sand/60 scroll-mt-24">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <SectionTitle
                        eyebrow="Live on Google Maps"
                        title="Find places near you"
                        text="Share your location and see villas, hotels and restaurants around you right now, or pick any coast town."
                    />
                    <NearbyMap />
                </div>
            </section>

            {/* Live hotel search links */}
            <section id="live" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-24">
                <SectionTitle
                    eyebrow="More choice"
                    title="Search live hotel listings"
                    text="Compare hotels and holiday homes in every coast town, with up-to-date prices and availability."
                />
                <LiveHotelLinks />
            </section>
        </SiteLayout>
    );
}