import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function imageSrc(src) {
    if (!src) return null;
    return /^(https?:)?\//.test(src) ? src : `/${src}`;
}

export default function VehiclesIndex({ vehicles, unassignedDrivers }) {
    const remove = (v) => {
        if (window.confirm(`Delete ${v.name}? This cannot be undone.`)) {
            router.delete(`/admin/vehicles/${v.id}`, { preserveScroll: true });
        }
    };

    const removeDriver = (v) => router.post(`/admin/vehicles/${v.id}/deassign-driver`, {}, { preserveScroll: true });

    return (
        <AdminLayout>
            <Head title="Vehicles & Drivers" />
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl text-tide font-semibold">Vehicles &amp; Drivers</h1>
                <Link href="/admin/vehicles/create" className="rounded-full bg-tide text-paper px-5 py-2 text-sm font-medium hover:bg-tide-light">
                    + Add vehicle
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                {vehicles.length === 0 && <p className="px-5 py-8 text-sm text-ink/50">No vehicles yet. Add your first car.</p>}

                {vehicles.map((v) => (
                    <div key={v.id} className="flex flex-wrap items-center justify-between px-5 py-4 gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-20 h-14 rounded-lg bg-sand overflow-hidden shrink-0">
                                {imageSrc(v.images?.[0]) && <img src={imageSrc(v.images[0])} alt={v.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium truncate">{v.name}</p>
                                <p className="text-xs text-ink/50">
                                    {v.category} · ${v.price_per_day}/day
                                    {!v.is_available && <span className="ml-2 text-rust">Hidden</span>}
                                    {!v.images?.length && <span className="ml-2 text-rust">No photo</span>}
                                </p>
                                <div className="mt-1 flex gap-3 text-xs">
                                    <Link href={`/admin/vehicles/${v.id}/edit`} className="text-tide hover:underline">Edit</Link>
                                    <button type="button" onClick={() => remove(v)} className="text-rust hover:underline">Delete</button>
                                </div>
                            </div>
                        </div>

                        {v.driver ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium">{v.driver.name}</p>
                                    <p className="text-xs text-ink/50">{v.driver.phone}</p>
                                </div>
                                <button type="button" onClick={() => removeDriver(v)} className="text-sm text-rust hover:underline">Remove</button>
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
