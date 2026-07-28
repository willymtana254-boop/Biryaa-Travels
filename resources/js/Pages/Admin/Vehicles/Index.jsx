import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function VehiclesIndex({ vehicles, unassignedDrivers }) {
    const { data, setData, post, processing } = useForm({ driver_id: '' });

    const assign = (vehicleId) => {
        if (!data.driver_id) return;
        post(`/admin/vehicles/${vehicleId}/assign-driver`, { preserveScroll: true });
    };

    const deassign = (vehicleId) => {
        useForm().post(`/admin/vehicles/${vehicleId}/deassign-driver`, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Vehicles & Drivers" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Vehicles &amp; Drivers</h1>

            <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                {vehicles.map((v) => (
                    <div key={v.id} className="flex items-center justify-between px-5 py-4 gap-4">
                        <div>
                            <p className="font-medium">{v.name}</p>
                            <p className="text-xs text-ink/50">{v.category}</p>
                        </div>

                        {v.driver ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium">{v.driver.name}</p>
                                    <p className="text-xs text-ink/50">{v.driver.phone}</p>
                                </div>
                                <form method="post" action={`/admin/vehicles/${v.id}/deassign-driver`}>
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name=csrf-token]')?.content} />
                                    <button type="submit" className="text-sm text-rust hover:underline">Remove</button>
                                </form>
                            </div>
                        ) : (
                            <AssignForm vehicleId={v.id} drivers={unassignedDrivers} />
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}

function AssignForm({ vehicleId, drivers }) {
    const { data, setData, post, processing } = useForm({ driver_id: '' });

    const submit = (e) => {
        e.preventDefault();
        if (!data.driver_id) return;
        post(`/admin/vehicles/${vehicleId}/assign-driver`, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex items-center gap-2">
            <select
                className="rounded-lg border border-ink/20 px-2 py-1.5 text-sm"
                value={data.driver_id}
                onChange={(e) => setData('driver_id', e.target.value)}
            >
                <option value="">Assign driver…</option>
                {drivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.phone}</option>
                ))}
            </select>
            <button
                type="submit"
                disabled={processing || !data.driver_id}
                className="rounded-full bg-tide text-paper px-4 py-1.5 text-sm font-medium hover:bg-tide-light disabled:opacity-50"
            >
                Assign
            </button>
        </form>
    );
}