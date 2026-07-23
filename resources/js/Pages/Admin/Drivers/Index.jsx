import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function DriversIndex({ drivers, unassignedVehicles }) {
    const assign = (driver, vehicleId) => {
        router.patch(`/admin/drivers/${driver.id}/assign`, { vehicle_id: vehicleId || null }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Drivers" />
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-tide font-semibold">Drivers</h1>
                <Link
                    href="/admin/drivers/create"
                    className="rounded-full bg-tide text-paper px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors"
                >
                    + Add driver
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-ink/50 border-b border-ink/10">
                            <th className="px-5 py-3 font-medium">Driver</th>
                            <th className="px-5 py-3 font-medium">Phone</th>
                            <th className="px-5 py-3 font-medium">License</th>
                            <th className="px-5 py-3 font-medium">Availability</th>
                            <th className="px-5 py-3 font-medium">Assigned car</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                        {drivers.map((d) => {
                            // The dropdown needs the currently-assigned car included even though
                            // it's excluded from `unassignedVehicles` (it's taken — by this driver).
                            const options = d.vehicle
                                ? [{ id: d.vehicle.id, name: d.vehicle.name }, ...unassignedVehicles]
                                : unassignedVehicles;

                            return (
                                <tr key={d.id}>
                                    <td className="px-5 py-3 font-medium text-ink">{d.name}</td>
                                    <td className="px-5 py-3 text-ink/70">{d.phone}</td>
                                    <td className="px-5 py-3 text-ink/70 font-mono text-xs">{d.license_number}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                d.is_available ? 'bg-lagoon/15 text-tide' : 'bg-ink/10 text-ink/60'
                                            }`}
                                        >
                                            {d.is_available ? 'Available' : 'Off duty'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <select
                                            className="rounded-lg border border-ink/20 px-2 py-1 text-xs"
                                            value={d.vehicle?.id ?? ''}
                                            onChange={(e) => assign(d, e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">— unassigned —</option>
                                            {options.map((v) => (
                                                <option key={v.id} value={v.id}>{v.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
