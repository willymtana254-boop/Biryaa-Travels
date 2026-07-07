import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function VehiclesShow({ vehicle }) {
    return (
        <SiteLayout>
            <Head title={vehicle.name} />
            <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                <div className="aspect-[4/3] rounded-2xl bg-sand overflow-hidden">
                    {vehicle.images?.[0] ? (
                        <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-tide/30 font-display text-2xl">
                            {vehicle.name}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">{vehicle.category}</p>
                    <h1 className="font-display text-3xl text-tide font-semibold">{vehicle.name}</h1>
                    <p className="mt-3 text-ink/60">{vehicle.seats} seats · {vehicle.transmission} transmission</p>
                    <p className="mt-6 text-ink/70 leading-relaxed">{vehicle.description || 'A reliable, well-maintained vehicle ready for your coastal journey.'}</p>

                    <div className="mt-8 flex items-baseline gap-2">
                        <span className="font-display text-3xl text-ink font-semibold">${Number(vehicle.price_per_day).toLocaleString()}</span>
                        <span className="text-ink/50">/ day</span>
                    </div>

                    <Link
                        href={`/book/vehicle/${vehicle.id}`}
                        className="mt-6 inline-flex items-center rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors"
                    >
                        Book this vehicle
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
