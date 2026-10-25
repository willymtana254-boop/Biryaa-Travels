import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { kes, waNumber } from '../../../lib/kes';

const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];

export default function BookingsShow({ booking, bookingType, title }) {
    const update = (field, value) => {
        router.patch(`/admin/bookings/${booking.id}`, { [field]: value }, { preserveScroll: true });
    };

    const remove = () => {
        if (window.confirm(`Delete booking ${booking.reference} permanently? This cannot be undone.`)) {
            router.delete(`/admin/bookings/${booking.id}`);
        }
    };

    const phone = waNumber(booking.customer_phone);
    const firstName = (booking.customer_name || '').split(' ')[0];
    const isTour = booking.bookable_type?.endsWith('Tour');
    const reviewable = isTour && ['confirmed', 'completed'].includes(booking.status);

    const reviewMessage = reviewable
        ? `Hi ${firstName}, thanks for joining ${booking.bookable?.name}! We'd love your rating and photos: ${window.location.origin}/experiences/${booking.bookable?.slug}/review?ref=${booking.reference}`
        : '';

    return (
        <AdminLayout>
            <Head title={`Booking ${booking.reference}`} />

            <Link href="/admin/bookings" className="text-sm text-ink/50 hover:text-tide">
                ← Back to bookings
            </Link>

            <div className="mt-4 flex items-baseline justify-between flex-wrap gap-2">
                <h1 className="font-display text-2xl text-tide font-semibold">{booking.reference}</h1>
                <span className="px-3 py-1 rounded-full bg-sand text-sm font-medium">{bookingType}</span>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">What was booked</h2>
                        <p className="font-display text-lg text-tide font-semibold">{title}</p>

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
                                <dd className="font-medium">{kes(booking.total_price)}</dd>
                            </div>
                            {booking.pickup_time && (
                                <div>
                                    <dt className="text-ink/50">Pickup time</dt>
                                    <dd className="font-medium">{booking.pickup_time.slice(0, 5)}</dd>
                                </div>
                            )}
                            {booking.flight_or_train_number && (
                                <div>
                                    <dt className="text-ink/50">Flight / train</dt>
                                    <dd className="font-medium">{booking.flight_or_train_number}</dd>
                                </div>
                            )}
                            {booking.pickup_address && (
                                <div>
                                    <dt className="text-ink/50">Address</dt>
                                    <dd className="font-medium">{booking.pickup_address}</dd>
                                </div>
                            )}
                            {booking.with_driver && (
                                <div>
                                    <dt className="text-ink/50">Driver</dt>
                                    <dd className="font-medium">Requested</dd>
                                </div>
                            )}
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
                                <dd className="font-medium break-all">{booking.customer_email}</dd>
                            </div>
                            <div>
                                <dt className="text-ink/50">Phone</dt>
                                <dd className="font-medium">
                                    <a href={`tel:+${phone}`} className="hover:underline">{booking.customer_phone}</a>
                                </dd>
                            </div>
                            {booking.user && (
                                <div>
                                    <dt className="text-ink/50">Account</dt>
                                    <dd className="font-medium">Registered user (#{booking.user.id})</dd>
                                </div>
                            )}
                        </dl>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <a
                                href={`https://wa.me/${phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-[#25D366] text-white px-5 py-2 text-sm font-medium hover:brightness-95 transition"
                            >
                                Message on WhatsApp
                            </a>
                            {reviewable && (
                                <a
                                    href={`https://wa.me/${phone}?text=${encodeURIComponent(reviewMessage)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-tide text-tide px-5 py-2 text-sm font-medium hover:bg-tide hover:text-white transition-colors"
                                >
                                    Ask for a review
                                </a>
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">Status</h2>
                        <label className="block text-sm mb-1 text-ink/70">Booking status</label>
                        <select
                            className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm mb-4"
                            value={booking.status}
                            onChange={(e) => update('status', e.target.value)}
                        >
                            {statuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <label className="block text-sm mb-1 text-ink/70">Payment status</label>
                        <select
                            className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
                            value={booking.payment_status}
                            onChange={(e) => update('payment_status', e.target.value)}
                        >
                            {paymentStatuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </section>

                    <section className="bg-white rounded-xl border border-ink/10 p-6">
                        <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-4">Reference</h2>
                        <p className="font-mono text-sm">{booking.reference}</p>
                        <p className="text-xs text-ink/50 mt-3">
                            Created {new Date(booking.created_at).toLocaleString()}
                        </p>
                    </section>

                    <section className="bg-white rounded-xl border border-rust/20 p-6">
                        <h2 className="text-sm font-medium text-rust uppercase tracking-wide mb-2">Danger zone</h2>
                        <p className="text-xs text-ink/60 mb-3">
                            Use this for test bookings. For real customers, set the status to Cancelled instead.
                        </p>
                        <button
                            type="button"
                            onClick={remove}
                            className="rounded-full border border-rust text-rust px-4 py-2 text-sm font-medium hover:bg-rust hover:text-white transition-colors"
                        >
                            Delete booking
                        </button>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
