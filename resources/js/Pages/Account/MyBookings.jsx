import { Head } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { PageHeader, EmptyState } from '../../Components/UI';

export default function MyBookings({ bookings }) {
    return (
        <SiteLayout>
            <Head title="My Bookings" />
            <div className="max-w-4xl mx-auto px-6 py-16">
                <PageHeader eyebrow="Your Account" title="My Bookings" />

                <div className="mt-10">
                    {bookings.length === 0 ? (
                        <EmptyState title="No bookings yet" description="Once you hire a car, it'll show up here." />
                    ) : (
                        <div className="divide-y divide-ink/10 border-y border-ink/10">
                            {bookings.map((b) => (
                                <div key={b.id} className="flex items-center justify-between py-5">
                                    <div>
                                        <p className="font-display text-lg text-tide font-semibold">{b.bookable?.name}</p>
                                        <p className="text-sm text-ink/60 mt-1">{b.start_date} → {b.end_date} · {b.reference}</p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-sand text-xs font-medium">{b.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}