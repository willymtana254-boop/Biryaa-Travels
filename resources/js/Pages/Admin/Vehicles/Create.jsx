import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function VehiclesCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: 'economy',
        seats: 4,
        transmission: 'automatic',
        price_per_day: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/vehicles');
    };

    return (
        <AdminLayout>
            <Head title="Add Vehicle" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Add Vehicle</h1>

            <form onSubmit={submit} className="max-w-lg space-y-5 bg-white rounded-xl border border-ink/10 p-6">
                <div>
                    <label className="text-sm font-medium text-ink/80">Name</label>
                    <input className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    {errors.name && <p className="text-xs text-rust mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-ink/80">Category</label>
                    <select className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-ink/80">Seats</label>
                        <input type="number" min="1" className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.seats} onChange={(e) => setData('seats', e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-ink/80">Transmission</label>
                        <select className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.transmission} onChange={(e) => setData('transmission', e.target.value)}>
                            <option value="automatic">Automatic</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-ink/80">Price per day ($)</label>
                    <input type="number" step="0.01" min="0" className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.price_per_day} onChange={(e) => setData('price_per_day', e.target.value)} required />
                    {errors.price_per_day && <p className="text-xs text-rust mt-1">{errors.price_per_day}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-ink/80">Description</label>
                    <textarea rows={3} className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                </div>

                <button type="submit" disabled={processing} className="rounded-full bg-tide text-paper px-6 py-2.5 font-medium hover:bg-tide-light disabled:opacity-60">
                    {processing ? 'Saving…' : 'Add Vehicle'}
                </button>
            </form>
        </AdminLayout>
    );
}