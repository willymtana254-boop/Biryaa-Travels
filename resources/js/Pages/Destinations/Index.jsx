import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { PageHeader, EmptyState } from '../../Components/UI';

export default function DestinationsIndex({ towns = [] }) {
    return (
        <SiteLayout>
            <Head title="Explore Destinations" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Explore Destinations"
                    title="Every town we serve, and how to get there"
                    description="Villas available in each destination, plus the airports and SGR stations our drivers connect it to."
                />

                <div className="mt-12 space-y-10">
                    {towns.length === 0 ? (
                        <EmptyState title="No destinations found" description="Run the seeders to populate towns and villas." />
                    ) : (
                        towns.map((town) => (
                            <div key={town.id} className="rounded-2xl border border-ink/10 p-6 md:p-8">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h2 className="font-display text-2xl text-tide font-semibold">{town.name}</h2>
                                    {town.tagline && <span className="text-sm text-rust font-medium">{town.tagline}</span>}
                                </div>
                                {town.description && (
                                    <p className="mt-2 text-ink/60 text-sm max-w-2xl">{town.description}</p>
                                )}

                                <div className="mt-6 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-sm font-medium text-ink/80 mb-3">
                                            Villas in {town.name} {town.villas.length > 0 && `(${town.villas.length})`}
                                        </h3>
                                        {town.villas.length === 0 ? (
                                            <p className="text-sm text-ink/50">No villas listed yet.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {town.villas.map((v) => (
                                                    <li key={v.id}>
                                                        <Link
                                                            href={`/villas/${v.slug}`}
                                                            className="flex items-center justify-between text-sm rounded-lg px-3 py-2 hover:bg-sand transition-colors"
                                                        >
                                                            <span className="text-ink/80">{v.name}</span>
                                                            <span className="text-ink/50">${Number(v.price_per_night).toLocaleString()}/night</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <Link
                                            href={`/villas?location=${town.id}`}
                                            className="inline-block mt-3 text-sm font-medium text-rust hover:underline"
                                        >
                                            View all villas in {town.name} →
                                        </Link>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-ink/80 mb-3">Reachable via</h3>
                                        {town.routes.length === 0 ? (
                                            <p className="text-sm text-ink/50">No transfer routes listed yet.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {town.routes.map((r) => (
                                                    <li key={r.route_id} className="flex items-center justify-between text-sm rounded-lg px-3 py-2">
                                                        <span className="text-ink/80">{r.hub}</span>
                                                        <span className="text-ink/50">from ${Number(r.price).toLocaleString()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <Link
                                            href={`/airport-transfers?to=${town.id}`}
                                            className="inline-block mt-3 text-sm font-medium text-rust hover:underline"
                                        >
                                            See transfer options →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}