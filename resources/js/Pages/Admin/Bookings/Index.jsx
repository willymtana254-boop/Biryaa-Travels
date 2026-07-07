import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
const paymentStatuses = ['unpaid', 'paid', 'refunded'];

export default function BookingsIndex({ bookings }) {
    const updateStatus = (booking, field, value) => {
        router.patch(`/admin/bookings/${booking.id}`, { [field]: value }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Bookings" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Bookings</h1>

            <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-ink/50 border-b border-ink/10">
                            <th className="px-5 py-3 font-medium">Reference</th>
                            <th className="px-5 py-3 font-medium">Customer</th>
                            <th className="px-5 py-3 font-medium">Dates</th>
                            <th className="px-5 py-3 font-medium">Total</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium">Payment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {bookings.data.map((b) => (
                            <tr key={b.id}>
                                <td className="px-5 py-3 font-mono text-xs">{b.reference}</td>
                                <td className="px-5 py-3">
                                    <p className="font-medium">{b.customer_name}</p>
                                    <p className="text-ink/50 text-xs">{b.customer_email}</p>
                                </td>
                                <td className="px-5 py-3 text-ink/70">{b.start_date} → {b.end_date}</td>
                                <td className="px-5 py-3 font-medium">${Number(b.total_price).toLocaleString()}</td>
                                <td className="px-5 py-3">
                                    <select
                                        className="rounded-lg border border-ink/20 px-2 py-1 text-xs"
                                        value={b.status}
                                        onChange={(e) => updateStatus(b, 'status', e.target.value)}
                                    >
                                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="px-5 py-3">
                                    <select
                                        className="rounded-lg border border-ink/20 px-2 py-1 text-xs"
                                        value={b.payment_status}
                                        onChange={(e) => updateStatus(b, 'payment_status', e.target.value)}
                                    >
                                        {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}