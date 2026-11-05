import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { kes, waNumber } from '../../../lib/kes';

const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];

export default function BookingsShow({ booking, bookingType, title, verification, verificationRequired }) {
    const isCar = booking.bookable_type?.endsWith('Vehicle');
    const [note, setNote] = useState('');
    const verifyLink = `${window.location.origin}/verify?ref=${booking.reference}`;
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

                    {isCar && (
                        <section className="bg-white rounded-xl border border-ink/10 p-6">
                            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                                <h2 className="text-sm font-medium text-ink/50 uppercase tracking-wide">Hirer verification</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    verification?.status === 'approved' ? 'bg-green-100 text-green-800'
                                    : verification?.status === 'pending' ? 'bg-sun/40 text-ink'
                                    : verification?.status === 'rejected' ? 'bg-rust/10 text-rust'
                                    : 'bg-sand text-ink/70'}`}>
                                    {verification?.status === 'pending' ? 'Waiting for review' : verification?.status || 'Not started'}
                                </span>
                            </div>

                            {!verification || verification.status === 'incomplete' ? (
                                <div className="text-sm text-ink/70 space-y-3">
                                    <p>The hirer has not sent their ID, licence and selfie yet.{verificationRequired && ' You cannot confirm this booking until they do.'}</p>
                                    <a
                                        href={`https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${firstName}, to confirm your car hire ${booking.reference} please complete verification (ID, driving licence and a live selfie): ${verifyLink}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block rounded-full bg-[#25D366] text-white px-5 py-2 text-sm font-medium hover:brightness-95 transition"
                                    >
                                        Request verification on WhatsApp
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-5 text-sm">
                                    <dl className="grid sm:grid-cols-2 gap-4">
                                        <div><dt className="text-ink/50">Name on ID</dt><dd className="font-medium">{verification.full_name}</dd></div>
                                        <div><dt className="text-ink/50">{verification.id_type === 'passport' ? 'Passport no.' : 'National ID no.'}</dt><dd className="font-medium">{verification.id_number}</dd></div>
                                        <div><dt className="text-ink/50">Licence no.</dt><dd className="font-medium">{verification.licence_number}</dd></div>
                                        <div><dt className="text-ink/50">Licence expires</dt><dd className="font-medium">{verification.licence_expiry}</dd></div>
                                        <div className="sm:col-span-2"><dt className="text-ink/50">Address</dt><dd className="font-medium">{verification.address_line}, {verification.town}, {verification.country}</dd></div>
                                        <div>
                                            <dt className="text-ink/50">Phone</dt>
                                            <dd className="font-medium">
                                                {verification.phone}{' '}
                                                {verification.phone_verified_at
                                                    ? <span className="text-green-700">✓ confirmed ({verification.phone_verified_by})</span>
                                                    : <span className="text-rust">not confirmed</span>}
                                            </dd>
                                        </div>
                                    </dl>

                                    {!verification.phone_verified_at && (
                                        <button
                                            type="button"
                                            onClick={() => router.post(`/admin/verifications/${verification.id}/phone`, {}, { preserveScroll: true })}
                                            className="rounded-full border border-tide text-tide px-4 py-1.5 text-xs font-medium hover:bg-tide hover:text-white transition-colors"
                                        >
                                            I called or messaged them: mark phone confirmed
                                        </button>
                                    )}

                                    {verification.documents.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {verification.documents.map((kind) => (
                                                <a key={kind} href={`/admin/verifications/${verification.id}/image/${kind}`} target="_blank" rel="noreferrer" className="block">
                                                    <img
                                                        src={`/admin/verifications/${verification.id}/image/${kind}`}
                                                        alt={kind}
                                                        className="w-full h-32 object-cover rounded-lg border border-ink/10"
                                                    />
                                                    <span className="text-xs text-ink/60">{kind.replace('_', ' ')}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-ink/50">Documents have been deleted.</p>
                                    )}

                                    <p className="text-xs text-ink/50">
                                        Compare the selfie with the photo on the ID and licence. Check the names match and the licence is valid for the whole hire.
                                        {verification.purge_after && ` Images are deleted automatically on ${verification.purge_after}.`}
                                    </p>

                                    {verification.status === 'pending' && (
                                        <div className="space-y-2">
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                rows={2}
                                                placeholder="If rejecting, tell the hirer what to fix"
                                                className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
                                            />
                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => router.post(`/admin/verifications/${verification.id}/decide`, { decision: 'approved', note }, { preserveScroll: true })} className="rounded-full bg-tide text-white px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors">Approve</button>
                                                <button type="button" onClick={() => router.post(`/admin/verifications/${verification.id}/decide`, { decision: 'rejected', note }, { preserveScroll: true })} className="rounded-full border border-rust text-rust px-5 py-2 text-sm font-medium hover:bg-rust hover:text-white transition-colors">Reject</button>
                                            </div>
                                        </div>
                                    )}

                                    {verification.reviewer_note && <p className="text-ink/70">Note: {verification.reviewer_note}</p>}

                                    {verification.documents.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => window.confirm('Delete the ID, licence and selfie images now? This cannot be undone.') && router.delete(`/admin/verifications/${verification.id}`, { preserveScroll: true })}
                                            className="text-xs text-rust underline"
                                        >
                                            Delete documents now
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    )}
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
