import { useRef, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

const field = 'w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm';

// Shrink a photo in the browser before uploading (phone photos are huge),
// so uploads are fast and fit the server's size limit.
async function shrink(file) {
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.84));
        if (!blob) return file;
        return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
    } catch {
        return file; // the server will still process it
    }
}

function PhotoCard({ photo, index, total, categories }) {
    const [title, setTitle] = useState(photo.title || '');
    const [caption, setCaption] = useState(photo.caption || '');
    const [category, setCategory] = useState(photo.category || '');

    const dirty =
        title !== (photo.title || '') || caption !== (photo.caption || '') || category !== (photo.category || '');

    const save = () =>
        router.patch(`/admin/gallery/${photo.id}`, { title, caption, category }, { preserveScroll: true });

    const move = (direction) =>
        router.patch(`/admin/gallery/${photo.id}/move`, { direction }, { preserveScroll: true });

    const remove = () => {
        if (window.confirm('Delete this photo from the gallery?')) {
            router.delete(`/admin/gallery/${photo.id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-ink/10 overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] bg-sand">
                <img src={photo.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-white">#{index + 1}</span>
            </div>

            <div className="p-4 space-y-3 flex-1">
                <input className={field} placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
                <input className={field} placeholder="Short caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} />
                <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">No category</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="px-4 pb-4 flex items-center gap-2">
                <button
                    type="button"
                    onClick={save}
                    disabled={!dirty}
                    className="rounded-full bg-tide text-white px-4 py-1.5 text-sm font-medium disabled:opacity-40"
                >
                    Save
                </button>
                <button type="button" onClick={() => move('up')} disabled={index === 0} title="Move earlier" className="rounded-full border border-ink/20 w-8 h-8 disabled:opacity-30">
                    ↑
                </button>
                <button type="button" onClick={() => move('down')} disabled={index === total - 1} title="Move later" className="rounded-full border border-ink/20 w-8 h-8 disabled:opacity-30">
                    ↓
                </button>
                <button type="button" onClick={remove} className="ml-auto text-sm text-rust hover:underline">
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function GalleryIndex({ photos, max, categories }) {
    const { errors } = usePage().props;
    const fileInput = useRef(null);
    const [files, setFiles] = useState([]);
    const [category, setCategory] = useState('');
    const [busy, setBusy] = useState(false);

    const remaining = max - photos.length;
    const firstError = errors && Object.values(errors)[0];

    const choose = async (e) => {
        const picked = Array.from(e.target.files || []).slice(0, remaining);
        setBusy(true);
        setFiles(await Promise.all(picked.map(shrink)));
        setBusy(false);
    };

    const upload = () => {
        router.post(
            '/admin/gallery',
            { photos: files, category },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setBusy(true),
                onFinish: () => setBusy(false),
                onSuccess: () => {
                    setFiles([]);
                    if (fileInput.current) fileInput.current.value = '';
                },
            }
        );
    };

    return (
        <AdminLayout>
            <Head title="Gallery" />

            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
                <h1 className="font-display text-2xl text-tide font-semibold">Gallery</h1>
                <p className="text-sm text-ink/60">
                    {photos.length} of {max} photos used
                </p>
            </div>
            <p className="text-sm text-ink/60 mb-6">
                These photos appear on the public Gallery page, in the order shown here. Large photos are shrunk automatically.
            </p>

            {/* Upload */}
            <section className="bg-white rounded-xl border border-ink/10 p-5 mb-8">
                <h2 className="font-display text-lg text-tide font-semibold mb-3">Add photos</h2>

                {remaining <= 0 ? (
                    <p className="text-sm text-rust">The gallery is full. Delete a photo below to add a new one.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm mb-1 text-ink/70">Choose up to {remaining} photo(s)</label>
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={choose}
                                className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-tide file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-ink/70">Category for these photos</label>
                            <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">No category</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={upload}
                            disabled={busy || files.length === 0}
                            className="rounded-full bg-[#FCCA14] text-ink px-6 py-2.5 text-sm font-medium hover:brightness-95 disabled:opacity-50"
                        >
                            {busy ? 'Working…' : files.length ? `Upload ${files.length} photo(s)` : 'Upload'}
                        </button>
                    </div>
                )}

                {firstError && <p className="mt-3 text-sm text-rust">{firstError}</p>}
            </section>

            {/* Current photos */}
            {photos.length === 0 ? (
                <div className="bg-white rounded-xl border border-ink/10 px-5 py-10 text-center text-ink/50">
                    No photos yet. Add your first photos above.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {photos.map((p, i) => (
                        <PhotoCard key={`${p.id}-${p.url}`} photo={p} index={i} total={photos.length} categories={categories} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
