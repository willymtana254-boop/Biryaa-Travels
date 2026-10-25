import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { StatusBadge, PaymentBadge } from '../../Components/AdminBadges';
import { kes } from '../../lib/kes';

function StatCard({ label, value, note, href, accent }) {
    const body = (
        <div className={`bg-white rounded-xl border border-ink/10 p-5 h-full ${href ? 'hover:border-tide/40 transition-colors' : ''}`}>
            <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
            <p className={`mt-2 font-display text-2xl font-semibold ${accent || 'text-tide'}`}>{value}</p>
            {note && <p className="mt-1 text-xs text-ink/50">{note}</p>}
        </div>
    );
    return href ? <Link href={href}>{body}</Link> : body;
}

function BookingRow({ b }) {
    return (
        <Link
            href={`/admin/bookings/${b.id}`}
            className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-sand/50 transition-colors"
        >
            <div className="min-w-0">
                <p className="font-medium truncate">{b.customer_name}</p>
                <p className="text-ink/50 text-xs truncate">
                    {b.type} · {b.title}
                </p>
                <p className="text-ink/40 text-xs">
                    {b.reference} · {b.start_date}
                </p>
            </div>
            <div className="text-right shrink-0 space-y-1">
                <p className="font-medium">{kes(b.total_price)}</p>
                <div className="flex gap-1 justify-end">
                    <StatusBadge value={b.status} />
                    <PaymentBadge value={b.payment_status} />
                </div>
            </div>
        </Link>
    );
}

export default function Dashboard({ stats, upcoming, recentBookings }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <StatCard label="New today" value={stats.newToday} href="/admin/bookings" />
                <StatCard label="Pending bookings" value={stats.pendingBookings} href="/admin/bookings?status=pending" accent="text-[#a07c00]" />
                <StatCard label="Confirmed bookings" value={stats.confirmedBookings} href="/admin/bookings?status=confirmed" />
                <StatCard
                    label="Waiting for payment"
                    value={stats.unpaidCount}
                    note={`${kes(stats.unpaidAmount)} to collect`}
                    href="/admin/bookings?payment=unpaid"
                    accent="text-rust"
                />
                <StatCard label="Revenue this month" value={kes(stats.revenueThisMonth)} note="Paid bookings only" />
                <StatCard label="Reviews to approve" value={stats.pendingReviews} href="/admin/reviews" accent={stats.pendingReviews ? 'text-rust' : 'text-tide'} />
            </div>

            <p className="text-xs text-ink/50 mb-10">
                {stats.vehicles} vehicles · {stats.villas} accommodation listings · {stats.tours} experiences
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
                <section>
                    <h2 className="font-display text-lg text-tide font-semibold mb-3">Arriving in the next 7 days</h2>
                    <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                        {upcoming.length === 0 ? (
                            <p className="px-5 py-6 text-sm text-ink/50">Nothing scheduled this week.</p>
                        ) : (
                            upcoming.map((b) => <BookingRow key={b.id} b={b} />)
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="font-display text-lg text-tide font-semibold mb-3">Latest bookings</h2>
                    <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                        {recentBookings.length === 0 ? (
                            <p className="px-5 py-6 text-sm text-ink/50">No bookings yet.</p>
                        ) : (
                            recentBookings.map((b) => <BookingRow key={b.id} b={b} />)
                        )}
                    </div>
                    <Link href="/admin/bookings" className="inline-block mt-4 text-sm font-medium text-tide hover:underline">
                        View all bookings →
                    </Link>
                </section>
            </div>
        </AdminLayout>
    );
}
