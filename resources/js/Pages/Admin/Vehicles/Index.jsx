import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function VehiclesIndex({ vehicles }) {
    return (
        <AdminLayout>
            <Head title="Vehicles" />
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-tide font-semibold">Vehicles</h1>
                <Link
                    href="/admin/vehicles/create"
                    className="rounded-full bg-tide text-paper px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors"
                >
                    + Add car
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-ink/50 border-b border-ink/10">
                            <th className="px-5 py-3 font-medium">Vehicle</th>
                            <th className="px-5 py-3 font-medium">Category</th>
                            <th className="px-5 py-3 font-medium">Rate</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                            <th className="px-5 py-3 font-medium">Driver</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {vehicles.map((v) => (
                            <tr key={v.id}>
                                <td className="px-5 py-3 font-medium text-ink">{v.name}</td>
                                <td className="px-5 py-3 text-ink/70 capitalize">{v.category}</td>
                                <td className="px-5 py-3 text-ink/70">${Number(v.price_per_day).toLocaleString()}/day</td>
                                <td className="px-5 py-3">
                                    {!v.is_available ? (
                                        <span className="px-2.5 py-1 rounded-full bg-ink/10 text-ink/60 text-xs font-medium">
                                            Disabled
                                        </span>
                                    ) : v.is_booked ? (
                                        <span className="px-2.5 py-1 rounded-full bg-rust/15 text-rust text-xs font-medium">
                                            Booked
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full bg-lagoon/15 text-tide text-xs font-medium">
                                            Available
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-ink/70">
                                    {v.driver ? v.driver.name : <span className="text-ink/30">— unassigned</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
