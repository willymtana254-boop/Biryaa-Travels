import { useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

const captions = [
    { eyebrow: 'Explore the Kenyan Coast', line: 'Here you will enjoy the sand beaches' },
    { eyebrow: 'Explore the Kenyan Coast', line: 'Crystal waters and coral shores' },
    { eyebrow: 'Stay & dine', line: 'Beautiful restaurants and hotels' },
    { eyebrow: 'Stay & dine', line: 'Warm coastal hospitality' },
    { eyebrow: 'Discover Kwale', line: 'The beautiful Shimba Hills' },
    { eyebrow: 'Discover Kwale', line: 'And the Shimoni Caves' },
];

const SLIDE_SECONDS = 5; // each photo lasts 5 seconds, plus a 1 second fade

export default function DestinationsIndex() {
    const videoRef = useRef(null);
    const [index, setIndex] = useState(0);

    const onTime = () => {
        const t = videoRef.current?.currentTime || 0;
        const next = Math.min(captions.length - 1, Math.floor(t / SLIDE_SECONDS));
        if (next !== index) setIndex(next);
    };

    const c = captions[index];

    return (
        <SiteLayout>
            <Head title="Explore Destinations" />

            <style>{`
                @keyframes floatIn {
                    0%   { opacity: 0; transform: translateY(28px); }
                    18%  { opacity: 1; transform: translateY(0); }
                    82%  { opacity: 1; transform: translateY(-6px); }
                    100% { opacity: 0; transform: translateY(-18px); }
                }
            `}</style>

            <section className="relative h-[calc(100vh-7rem)] min-h-[520px] overflow-hidden bg-ink">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/destinations-poster.jpg"
                    onTimeUpdate={onTime}
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/destinations-slideshow.mp4" type="video/mp4" />
                </video>

                {/* Soft dark fade at the bottom only, so the photos keep their colours */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Floating words */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-16 md:pb-24">
                    <div className="max-w-5xl mx-auto text-white" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.7)' }}>
                        <div
                            key={index}
                            style={{ animation: `floatIn ${SLIDE_SECONDS + 1}s ease-in-out forwards` }}
                        >
                            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#FCCA14] mb-3">
                                {c.eyebrow}
                            </p>
                            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight max-w-3xl">
                                {c.line}
                            </h1>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/villas"
                                className="rounded-full bg-[#FCCA14] text-ink px-6 py-3 text-sm font-medium hover:brightness-95 transition"
                            >
                                Find accommodation
                            </Link>
                            <Link
                                href="/airport-transfers"
                                className="rounded-full bg-white/90 text-ink px-6 py-3 text-sm font-medium hover:bg-white transition"
                            >
                                Book a transfer
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}