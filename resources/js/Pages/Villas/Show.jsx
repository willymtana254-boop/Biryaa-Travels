import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function VillasShow({ villa }) {
    return (
        <SiteLayout>
            <Head title={villa.name} />
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="aspect-[16/9] rounded-2xl bg-sand overflow-hidden mb-10">
                    {villa.images?.[0] ? (
                        <img src={villa.images[0]} alt={villa.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-tide/30 font-display text-2xl">
                            {villa.name}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">{villa.location?.name}</p>
                        <h1 className="font-display text-3xl text-tide font-semibold">{villa.name}</h1>
                        <p className="mt-3 text-ink/60">
                            {villa.bedrooms} bedrooms · {villa.bathrooms} bathrooms · sleeps {villa.max_guests}
                        </p>
                        <p className="mt-6 text-ink/70 leading-relaxed">{villa.description}</p>

                        {villa.amenities?.length > 0 && (
                            <div className="mt-8">
                                <h2 className="font-medium text-ink mb-3">Amenities</h2>
                                <div className="flex flex-wrap gap-2">
                                    {villa.amenities.map((a) => (
                                        <span key={a} className="px-3 py-1 rounded-full bg-sand text-sm text-ink/70">{a}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-ink/10 p-6 h-fit sticky top-24">
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-2xl text-ink font-semibold">${Number(villa.price_per_night).toLocaleString()}</span>
                            <span className="text-ink/50">/ night</span>
                        </div>
                        <Link
                            href={`/book/villa/${villa.id}`}
                            className="mt-5 w-full inline-flex justify-center items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                        >
                            Check availability
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
