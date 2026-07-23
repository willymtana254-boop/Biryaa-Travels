import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { PageHeader, EmptyState } from '../../Components/UI';

const statusColor = {
    pending: 'bg-sand text-ink/80',
    confirmed: 'bg-lagoon/15 text-tide',
    cancelled: 'bg-rust/15 text-rust',
    completed: 'bg-tide/10 text-tide',
};

export default function MyBookings({ bookings }) {
    return (
        <SiteLayout>
            <Head title="My Car Hire Bookings" />
            <div className="max-w-4xl mx-auto px-6 py-16">
                <PageHeader
                    eyebrow="Your Account"
                    title="My Car Hire Record"
                    description="Every self-drive booking you've made with Biryaa Travels, in one place."
                />

                <div className="mt-10">
                    {bookings.length === 0 ? (
                        <EmptyState
                            title="No car hire bookings yet"
                            description="Once you request a car, it'll show up here."
                        />
                    ) : (
                        <div className="divide-y divide-ink/10 border-y border-ink/10">
                            {bookings.map((b) => (
                                <div key={b.id} className="flex items-center justify-between py-5 gap-4 flex-wrap">
                                    <div>
                                        <p className="font-display text-lg text-tide font-semibold">
                                            {b.bookable?.name ?? 'Vehicle'}
                                        </p>
                                        <p className="text-sm text-ink/60 mt-1">
                                            {b.start_date} → {b.end_date} · Ref {b.reference}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-ink">
                                            ${Number(b.total_price).toLocaleString()}
                                        </span>
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                                                statusColor[b.status] ?? 'bg-sand text-ink/70'
                                            }`}
                                        >
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Link href="/car-hire" className="inline-block mt-8 text-sm font-medium text-rust hover:underline">
                    Browse cars →
                </Link>
            </div>
        </SiteLayout>
    );
}
