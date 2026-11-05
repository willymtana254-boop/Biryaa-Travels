import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import StarRating from '../../../Components/StarRating';

const tabs = [['pending', 'Waiting for approval'], ['approved', 'Approved'], ['all', 'All']];
const inputClass = 'w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm';

export default function TestimonialsIndex({ items, filter, pendingCount, services }) {
    const [adding, setAdding] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', location: '', service: 'car_hire', rating: 5, message: '',
    });

    const act = (method, url) => router[method](url, {}, { preserveScroll: true });

    return (
        <AdminLayout>
            <Head title="Testimonials" />
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="font-display text-2xl text-tide font-semibold">Testimonials</h1>
                <button type="button" onClick={() => setAdding((a) => !a)} className="rounded-full bg-tide text-white px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors">
                    {adding ? 'Close' : 'Add a testimonial'}
                </button>
            </div>

            {adding && (
                <form
                    onSubmit={(e) => { e.preventDefault(); post('/admin/testimonials', { preserveScroll: true, onSuccess: () => { reset(); setAdding(false); } }); }}
                    className="mt-5 bg-white rounded-xl border border-ink/10 p-5 space-y-4"
                >
                    <p className="text-xs text-ink/60">Only add real testimonials a guest has agreed to share (for example sent to you on WhatsApp). These are shown as approved straight away.</p>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div><input className={inputClass} placeholder="Guest name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-xs text-rust mt-1">{errors.name}</p>}</div>
                        <input className={inputClass} placeholder="Town / country" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                        <select className={inputClass} value={data.service} onChange={(e) => setData('service', e.target.value)}>
                            {Object.entries(services).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <StarRating value={data.rating} onChange={(n) => setData('rating', n)} size={24} />
                    <div><textarea rows={3} className={inputClass} placeholder="Their words" value={data.message} onChange={(e) => setData('message', e.target.value)} />{errors.message && <p className="text-xs text-rust mt-1">{errors.message}</p>}</div>
                    <button disabled={processing} className="rounded-full bg-tide text-white px-5 py-2 text-sm font-medium disabled:opacity-60">Save</button>
                </form>
            )}

            <div className="mt-6 flex gap-2 flex-wrap">
                {tabs.map(([key, label]) => (
                    <Link key={key} href={`/admin/testimonials?filter=${key}`} className={`rounded-full px-4 py-1.5 text-sm ${filter === key ? 'bg-tide text-white' : 'bg-white border border-ink/15 text-ink/70'}`}>
                        {label}{key === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
                    </Link>
                ))}
            </div>

            <div className="mt-5 space-y-4">
                {items.data.length === 0 && <p className="text-sm text-ink/50">Nothing here.</p>}
                {items.data.map((t) => (
                    <div key={t.id} className="bg-white rounded-xl border border-ink/10 p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <p className="font-medium">{t.name}{t.location ? <span className="text-ink/50 font-normal">, {t.location}</span> : null}</p>
                                <p className="text-xs text-ink/50">{services[t.service] || '—'} · {new Date(t.created_at).toLocaleDateString()} · {t.source === 'manual' ? 'added by admin' : 'from website'}{t.verified ? ' · ✓ verified booking' : ''}</p>
                            </div>
                            <StarRating value={t.rating} size={16} />
                        </div>
                        <p className="mt-3 text-sm text-ink/80">“{t.message}”</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <button type="button" onClick={() => act('patch', `/admin/testimonials/${t.id}/approve`)} className={`rounded-full px-4 py-1.5 font-medium ${t.is_approved ? 'border border-ink/20 text-ink/70' : 'bg-tide text-white'}`}>
                                {t.is_approved ? 'Hide from website' : 'Approve'}
                            </button>
                            {t.is_approved && (
                                <button type="button" onClick={() => act('patch', `/admin/testimonials/${t.id}/feature`)} className={`rounded-full px-4 py-1.5 font-medium ${t.is_featured ? 'bg-sun text-ink' : 'border border-ink/20 text-ink/70'}`}>
                                    {t.is_featured ? '★ On home page' : 'Show on home page'}
                                </button>
                            )}
                            <button type="button" onClick={() => window.confirm('Delete this testimonial?') && act('delete', `/admin/testimonials/${t.id}`)} className="rounded-full border border-rust text-rust px-4 py-1.5 font-medium hover:bg-rust hover:text-white transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
