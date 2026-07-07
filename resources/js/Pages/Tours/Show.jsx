import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function ToursShow({ tour }) {
    return (
        <SiteLayout>
            <Head title={tour.name} />
            <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                <div className="aspect-[4/3] rounded-2xl bg-sand overflow-hidden">
                    {tour.images?.[0] ? (
                        <img src={tour.images[0]} alt={tour.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-tide/30 font-display text-2xl">
                            {tour.name}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">{tour.location?.name} · {tour.category}</p>
                    <h1 className="font-display text-3xl text-tide font-semibold">{tour.name}</h1>
                    <p className="mt-3 text-ink/60">Approx. {tour.duration_hours} hours</p>
                    <p className="mt-6 text-ink/70 leading-relaxed">{tour.description}</p>

                    <div className="mt-8 flex items-baseline gap-2">
                        <span className="font-display text-3xl text-ink font-semibold">${Number(tour.price).toLocaleString()}</span>
                        <span className="text-ink/50">/ person</span>
                    </div>

                    <Link
                        href={`/book/tour/${tour.id}`}
                        className="mt-6 inline-flex items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                    >
                        Reserve this experience
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
