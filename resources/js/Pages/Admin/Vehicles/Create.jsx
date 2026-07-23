import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function VehiclesCreate({ categories, rates }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: categories[0] ?? '',
        seats: 4,
        transmission: 'automatic',
        price_per_day: rates[categories[0]] ?? '',
        description: '',
    });

    // Auto-fill the rate card price when category changes, unless admin already typed an override.
    useEffect(() => {
        setData('price_per_day', rates[data.category] ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.category]);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/vehicles');
    };

    return (
        <AdminLayout>
            <Head title="Add Vehicle" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Add a car</h1>

            <form onSubmit={submit} className="max-w-lg space-y-5 bg-white rounded-xl border border-ink/10 p-6">
                <Field label="Name" error={errors.name}>
                    <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g. Toyota RAV4" required />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Category" error={errors.category}>
                        <select className="input" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Transmission" error={errors.transmission}>
                        <select className="input" value={data.transmission} onChange={(e) => setData('transmission', e.target.value)}>
                            <option value="automatic">Automatic</option>
                            <option value="manual">Manual</option>
                        </select>
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Seats" error={errors.seats}>
                        <input type="number" min="1" max="60" className="input" value={data.seats} onChange={(e) => setData('seats', e.target.value)} required />
                    </Field>
                    <Field label="Rate per day (KES)" error={errors.price_per_day}>
                        <input type="number" min="0" className="input" value={data.price_per_day} onChange={(e) => setData('price_per_day', e.target.value)} />
                    </Field>
                </div>
                <p className="text-xs text-ink/50 -mt-3">Auto-filled from the {data.category} rate card — edit to override for this car.</p>

                <Field label="Description (optional)" error={errors.description}>
                    <textarea className="input" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                </Field>

                <button type="submit" disabled={processing} className="rounded-full bg-tide text-paper px-6 py-2.5 font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                    {processing ? 'Saving…' : 'Add car'}
                </button>
            </form>

            <style>{`
                .input { width: 100%; border-radius: 0.5rem; border: 1px solid rgb(28 35 33 / 0.2); padding: 0.55rem 0.9rem; font-size: 0.875rem; }
                .input:focus { outline: 2px solid #C1502E; outline-offset: 1px; }
            `}</style>
        </AdminLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-ink/80">{label}</span>
            <div className="mt-1.5">{children}</div>
            {error && <p className="mt-1 text-xs text-rust">{error}</p>}
        </label>
    );
}
