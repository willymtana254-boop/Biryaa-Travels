import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function DriversCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', phone: '', license_number: '', photo: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/drivers');
    };

    return (
        <AdminLayout>
            <Head title="Add Driver" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Add Driver</h1>

            <form onSubmit={submit} className="max-w-lg space-y-5 bg-white rounded-xl border border-ink/10 p-6">
                <div>
                    <label className="text-sm font-medium text-ink/80">Name</label>
                    <input className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    {errors.name && <p className="text-xs text-rust mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium text-ink/80">Phone (WhatsApp)</label>
                    <input className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.phone} onChange={(e) => setData('phone', e.target.value)} required placeholder="e.g. 254712345678" />
                    {errors.phone && <p className="text-xs text-rust mt-1">{errors.phone}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium text-ink/80">License Number</label>
                    <input className="mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} required />
                    {errors.license_number && <p className="text-xs text-rust mt-1">{errors.license_number}</p>}
                </div>
                <button type="submit" disabled={processing} className="rounded-full bg-tide text-paper px-6 py-2.5 font-medium hover:bg-tide-light disabled:opacity-60">
                    {processing ? 'Saving…' : 'Add Driver'}
                </button>
            </form>
        </AdminLayout>
    );
}