import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function DriversCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        license_number: '',
        photo: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/drivers');
    };

    return (
        <AdminLayout>
            <Head title="Add Driver" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Add a driver</h1>

            <form onSubmit={submit} className="max-w-lg space-y-5 bg-white rounded-xl border border-ink/10 p-6">
                <Field label="Full name" error={errors.name}>
                    <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                </Field>
                <Field label="Phone" error={errors.phone}>
                    <input className="input" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required />
                </Field>
                <Field label="License number" error={errors.license_number}>
                    <input className="input" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} required />
                </Field>
                <Field label="Photo URL (optional)" error={errors.photo}>
                    <input className="input" value={data.photo} onChange={(e) => setData('photo', e.target.value)} />
                </Field>

                <button type="submit" disabled={processing} className="rounded-full bg-tide text-paper px-6 py-2.5 font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                    {processing ? 'Saving…' : 'Add driver'}
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
