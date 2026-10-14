import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import Stars from '../Components/Stars';
import { PageHeader } from '../Components/UI';

export default function GuestStories({ photos = [] }) {
    return (
        <SiteLayout>
            <Head title="Guest Stories" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Guest Stories"
                    title="The coast, through our guests' eyes"
                    description="Real photos from travellers who've been out with us — shared by them, after their trip."
                />

                {photos.length === 0 ? (
                    <div className="mt-12 rounded-2xl border border-dashed border-ink/15 p-12 text-center">
                        <p className="font-display text-xl text-tide">Guest photos will appear here</p>
                        <p className="mt-2 text-sm text-ink/60">As travellers share their experiences, their photos will fill this page.</p>
                        <Link href="/experiences" className="inline-block mt-4 text-sm font-medium text-rust hover:underline">
                            Explore experiences →
                        </Link>
                    </div>
                ) : (
                    <div className="mt-12 columns-2 md:columns-3 gap-4">
                        {photos.map((p) => (
                            <Link
                                key={p.id}
                                href={`/experiences/${p.slug}`}
                                className="group relative block mb-4 break-inside-avoid rounded-xl overflow-hidden bg-sand"
                            >
                                <img src={p.url} alt={p.tour || 'Guest photo'} loading="lazy" className="w-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink/80 to-transparent text-paper opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-sm font-medium">{p.tour}</p>
                                    <div className="mt-0.5 flex items-center gap-2 text-xs text-paper/80">
                                        <Stars value={p.rating} size={12} />
                                        <span>{p.name}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-paper/70 line-clamp-2">{p.quote}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}