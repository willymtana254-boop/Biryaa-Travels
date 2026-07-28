import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function DriversIndex({ drivers, unassignedVehicles }) {
    return (
        <AdminLayout>
            <Head title="Drivers" />
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-tide font-semibold">Drivers</h1>
                <Link href="/admin/drivers/create" className="rounded-full bg-tide text-paper px-4 py-2 text-sm font-medium hover:bg-tide-light">
                    Add Driver
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                {drivers.map((d) => (
                    <DriverRow key={d.id} driver={d} unassignedVehicles={unassignedVehicles} />
                ))}
            </div>
        </AdminLayout>
    );
}

function DriverRow({ driver, unassignedVehicles }) {
    const { data, setData, patch, processing } = useForm({ vehicle_id: '' });

    const assign = (e) => {
        e.preventDefault();
        if (!data.vehicle_id) return;
        patch(`/admin/drivers/${driver.id}/assign`, { preserveScroll: true });
    };

    const unassign = () => {
        patch(`/admin/drivers/${driver.id}/assign`, { vehicle_id: null }, { preserveScroll: true });
    };

    return (
        <div className="flex items-center justify-between px-5 py-4 gap-4">
            <div>
                <p className="font-medium">{driver.name}</p>
                <p className="text-xs text-ink/50">{driver.phone} · License {driver.license_number}</p>
            </div>

            {driver.vehicle ? (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-ink/70">{driver.vehicle.name}</span>
                    <button onClick={unassign} className="text-sm text-rust hover:underline">Unassign</button>
                </div>
            ) : (
                <form onSubmit={assign} className="flex items-center gap-2">
                    <select
                        className="rounded-lg border border-ink/20 px-2 py-1.5 text-sm"
                        value={data.vehicle_id}
                        onChange={(e) => setData('vehicle_id', e.target.value)}
                    >
                        <option value="">Assign vehicle…</option>
                        {unassignedVehicles.map((v) => (
                            <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                        ))}
                    </select>
                    <button type="submit" disabled={processing || !data.vehicle_id} className="rounded-full bg-tide text-paper px-4 py-1.5 text-sm font-medium hover:bg-tide-light disabled:opacity-50">
                        Assign
                    </button>
                </form>
            )}
        </div>
    );
}