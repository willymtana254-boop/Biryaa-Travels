import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard({ stats, recentBookings }) {
    const cards = [
        { label: 'Pending bookings', value: stats.pendingBookings },
        { label: 'Confirmed bookings', value: stats.confirmedBookings },
        { label: 'Vehicles', value: stats.vehicles },
        { label: 'Villas', value: stats.villas },
        { label: 'Tours', value: stats.tours },
        { label: 'Revenue this month', value: `$${Number(stats.revenueThisMonth).toLocaleString()}` },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Dashboard</h1>

            <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
                {cards.map((c) => (
                    <div key={c.label} className="bg-white rounded-xl border border-ink/10 p-4">
                        <p className="text-2xl font-display font-semibold text-tide">{c.value}</p>
                        <p className="text-xs text-ink/60 mt-1">{c.label}</p>
                    </div>
                ))}
            </div>

            <h2 className="font-display text-xl text-tide font-semibold mb-4">Recent bookings</h2>
            <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                {recentBookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between px-5 py-3 text-sm">
                        <div>
                            <p className="font-medium">{b.customer_name}</p>
                            <p className="text-ink/50">{b.reference}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-sand text-xs font-medium">{b.status}</span>
                        <span className="font-medium">${Number(b.total_price).toLocaleString()}</span>
                    </div>
                ))}
            </div>
            <Link href="/admin/bookings" className="inline-block mt-6 text-sm font-medium text-rust hover:underline">
                View all bookings →
            </Link>
        </AdminLayout>
    );
}
