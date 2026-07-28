import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];

function bookableLabel(booking) {
    const b = booking.bookable;
    if (!b) return 'Unknown';

    if (booking.bookable_type.endsWith('TransferRoute')) {
        return `${b.from_location?.name ?? '?'} → ${b.to_location?.name ?? '?'}`;
    }

    return b.name ?? `#${b.id}`;
}

export default function BookingsShow({ booking, bookingType }) {
    const updateStatus = (field, value) => {
        router.patch(`/admin/bookings/${booking.id}`, { [field]: value }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title={`Booking ${booking.reference}`} />

            <Link href="/admin/bookings" className="text-sm text-ink/50 hover:text-tide">← Back to bookings</Link>

            <div className="mt-4 flex items-baseline justify-between flex-wrap gap-2">
                <h1 className="font-display text-2xl text-tide font-semibold">{booking.reference}</h1>
                <span className="px-3 py-1 rounded-full bg-sand text-sm font-medium">{bookingType}</span>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">What was booked</h2>
                        <p className="font-display text-lg text-tide font-semibold">{bookableLabel(booking)}</p>
                        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-ink/50">Start date</dt>
                                <dd className="font-medium">{booking.start_date}</dd>
                            </div>
                            <div>
                                <dt className="text-ink/50">End date</dt>
                                <dd className="font-medium">{booking.end_date}</dd>
                            </div>
                            {booking.guests && (
                                <div>
                                    <dt className="text-ink/50">Guests</dt>
                                    <dd className="font-medium">{booking.guests}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-ink/50">Total price</dt>
                                <dd className="font-medium">${Number(booking.total_price).toLocaleString()}</dd>
                            </div>
                        </dl>
                        {booking.notes && (
                            <div className="mt-4 pt-4 border-t border-ink/10">
                                <p className="text-sm text-ink/50 mb-1">Customer notes</p>
                                <p className="text-sm">{booking.notes}</p>
                            </div>
                        )}
                    </section>

                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">Customer</h2>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-ink/50">Name</dt>
                                <dd className="font-medium">{booking.customer_name}</dd>
                            </div>
                            <div>
                                <dt className="text-ink/50">Email</dt>
                                <dd className="font-medium">{booking.customer_email}</dd>
                            </div>
                            <div>
                                <dt className="text-ink/50">Phone</dt>
                                <dd className="font-medium">{booking.customer_phone}</dd>
                            </div>
                            {booking.user && (
                                <div>
                                    <dt className="text-ink/50">Account</dt>
                                    <dd className="font-medium">Registered user (#{booking.user.id})</dd>
                                </div>
                            )}
                        </dl>
                        
                       <a> href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-4 text-sm font-medium text-rust hover:underline"
                        
                            Message customer on WhatsApp →
                        </a>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">Status</h2>
                        <label className="block text-sm mb-1 text-ink/70">Booking status</label>
                        <select
                            className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm mb-4"
                            value={booking.status}
                            onChange={(e) => updateStatus('status', e.target.value)}
                        >
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <label className="block text-sm mb-1 text-ink/70">Payment status</label>
                        <select
                            className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
                            value={booking.payment_status}
                            onChange={(e) => updateStatus('payment_status', e.target.value)}
                        >
                            {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </section>

                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">Reference</h2>
                        <p className="font-mono text-sm">{booking.reference}</p>
                        <p className="text-xs text-ink/50 mt-3">Created {new Date(booking.created_at).toLocaleString()}</p>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}