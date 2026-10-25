import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { kes } from '../../../lib/kes';

const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];
const types = [
    { value: 'car', label: 'Car hire' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'experience', label: 'Experiences' },
];

const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null));

const field = 'rounded-lg border border-ink/20 px-3 py-2 text-sm bg-white';

export default function BookingsIndex({ bookings, filters }) {
    const [form, setForm] = useState({
        q: filters.q || '',
        status: filters.status || '',
        payment: filters.payment || '',
        type: filters.type || '',
        from: filters.from || '',
        to: filters.to || '',
    });

    const apply = (next) =>
        router.get('/admin/bookings', clean(next), { preserveState: true, replace: true });

    const change = (key, value) => {
        const next = { ...form, [key]: value };
        setForm(next);
        if (key !== 'q') apply(next); // search waits for Enter / Search button
    };

    const reset = () => {
        const empty = { q: '', status: '', payment: '', type: '', from: '', to: '' };
        setForm(empty);
        apply(empty);
    };

    const update = (booking, key, value) =>
        router.patch(`/admin/bookings/${booking.id}`, { [key]: value }, { preserveScroll: true });

    const exportUrl = `/admin/bookings/export?${new URLSearchParams(clean(form)).toString()}`;
    const hasFilters = Object.values(form).some(Boolean);

    return (
        <AdminLayout>
            <Head title="Bookings" />

            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h1 className="font-display text-2xl text-tide font-semibold">Bookings</h1>
                <a href={exportUrl} className="rounded-full bg-[#FCCA14] text-ink px-5 py-2 text-sm font-medium hover:brightness-95 transition">
                    Download Excel (CSV)
                </a>
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {[{ value: '', label: 'All' }, ...statuses.map((s) => ({ value: s, label: s }))].map((t) => (
                    <button
                        key={t.label}
                        type="button"
                        onClick={() => change('status', t.value)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                            form.status === t.value ? 'bg-tide text-white' : 'bg-white border border-ink/15 text-ink/70 hover:border-tide'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    apply(form);
                }}
                className="bg-white rounded-xl border border-ink/10 p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
            >
                <input
                    className={`${field} lg:col-span-2`}
                    placeholder="Search name, phone, email or reference"
                    value={form.q}
                    onChange={(e) => setForm({ ...form, q: e.target.value })}
                />
                <select className={field} value={form.type} onChange={(e) => change('type', e.target.value)}>
                    <option value="">All types</option>
                    {types.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
                <select className={field} value={form.payment} onChange={(e) => change('payment', e.target.value)}>
                    <option value="">Any payment</option>
                    {paymentStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <input type="date" className={field} value={form.from} onChange={(e) => change('from', e.target.value)} title="Starts from" />
                <input type="date" className={field} value={form.to} onChange={(e) => change('to', e.target.value)} title="Starts until" />

                <div className="sm:col-span-2 lg:col-span-6 flex items-center gap-3">
                    <button type="submit" className="rounded-full bg-tide text-white px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors">
                        Search
                    </button>
                    {hasFilters && (
                        <button type="button" onClick={reset} className="text-sm text-ink/60 underline">
                            Clear filters
                        </button>
                    )}
                    <span className="ml-auto text-xs text-ink/50">{bookings.total} found</span>
                </div>
            </form>

            <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]">
                    <thead>
                        <tr className="text-left text-ink/50 border-b border-ink/10">
                            <th className="px-5 py-3 font-medium">Reference</th>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Booking</th>
                            <th className="px-5 py-3 font-medium">Dates</th>
                            <th className="px-5 py-3 font-medium">Total</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium">Payment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {bookings.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-5 py-10 text-center text-ink/50">
                                    No bookings match these filters.
                                </td>
                            </tr>
                        )}
                        {bookings.data.map((b) => (
                            <tr key={b.id} className="align-top">
                                <td className="px-5 py-3 font-mono text-xs">
                                    <Link href={`/admin/bookings/${b.id}`} className="text-tide hover:underline">
                                        {b.reference}
                                    </Link>
                                </td>
                                <td className="px-5 py-3">
                                    <p className="font-medium">{b.customer_name}</p>
                                    <p className="text-ink/50 text-xs">{b.customer_phone}</p>
                                    <p className="text-ink/40 text-xs">{b.customer_email}</p>
                                </td>
                                <td className="px-5 py-3">
                                    <p className="text-xs uppercase tracking-wide text-ink/50">{b.type}</p>
                                    <p>{b.title}</p>
                                </td>
                                <td className="px-5 py-3 text-ink/70 whitespace-nowrap">
                                    {b.start_date} → {b.end_date}
                                </td>
                                <td className="px-5 py-3 font-medium whitespace-nowrap">{kes(b.total_price)}</td>
                                <td className="px-5 py-3">
                                    <select
                                        className="rounded-lg border border-ink/20 px-2 py-1 text-xs"
                                        value={b.status}
                                        onChange={(e) => update(b, 'status', e.target.value)}
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-5 py-3">
                                    <select
                                        className="rounded-lg border border-ink/20 px-2 py-1 text-xs"
                                        value={b.payment_status}
                                        onChange={(e) => update(b, 'payment_status', e.target.value)}
                                    >
                                        {paymentStatuses.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {bookings.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between text-sm">
                    {bookings.prev_page_url ? (
                        <Link href={bookings.prev_page_url} className="text-tide hover:underline">← Previous</Link>
                    ) : (
                        <span />
                    )}
                    <span className="text-ink/50">
                        Page {bookings.current_page} of {bookings.last_page}
                    </span>
                    {bookings.next_page_url ? (
                        <Link href={bookings.next_page_url} className="text-tide hover:underline">Next →</Link>
                    ) : (
                        <span />
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
