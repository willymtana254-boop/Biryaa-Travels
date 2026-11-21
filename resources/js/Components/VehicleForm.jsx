import { useState } from 'react';
import { router } from '@inertiajs/react';

const field = 'mt-1.5 w-full rounded-lg border border-ink/20 px-3 py-2 text-sm';

/** Shrinks a phone photo in the browser so it uploads fast and never hits the server size limit. */
function shrink(file, max = 1600) {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.min(1, max / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    resolve(blob ? new File([blob], 'car.jpg', { type: 'image/jpeg' }) : file);
                },
                'image/jpeg',
                0.85
            );
        };
        img.onerror = () => resolve(file);
        img.src = url;
    });
}

export default function VehicleForm({ form, categories, currentImage, submitLabel, onSubmit }) {
    const { data, setData, processing, errors } = form;
    const [preview, setPreview] = useState(null);

    const choose = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const small = await shrink(file);
        setData('photo', small);
        setPreview(URL.createObjectURL(small));
    };

    const shown = preview || currentImage;

    return (
        <form onSubmit={onSubmit} className="max-w-lg space-y-5 bg-white rounded-xl border border-ink/10 p-6">
            <div>
                <label className="text-sm font-medium text-ink/80">Car photo</label>
                <div className="mt-1.5 aspect-[4/3] w-full rounded-lg bg-sand overflow-hidden flex items-center justify-center text-ink/40 text-sm">
                    {shown ? <img src={shown} alt="Car preview" className="w-full h-full object-cover" /> : 'No photo chosen yet'}
                </div>
                <input type="file" accept="image/*" onChange={choose} className="mt-2 block w-full text-sm" />
                <p className="text-xs text-ink/50 mt-1">Use a clear side or front-three-quarter photo. It is resized automatically.</p>
                {errors.photo && <p className="text-xs text-rust mt-1">{errors.photo}</p>}
            </div>

            <div>
                <label className="text-sm font-medium text-ink/80">Name</label>
                <input className={field} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                {errors.name && <p className="text-xs text-rust mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="text-sm font-medium text-ink/80">Category</label>
                <select className={field} value={data.category} onChange={(e) => setData('category', e.target.value)}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-ink/80">Seats</label>
                    <input type="number" min="1" className={field} value={data.seats} onChange={(e) => setData('seats', e.target.value)} required />
                    {errors.seats && <p className="text-xs text-rust mt-1">{errors.seats}</p>}
                </div>
                <div>
                    <label className="text-sm font-medium text-ink/80">Transmission</label>
                    <select className={field} value={data.transmission} onChange={(e) => setData('transmission', e.target.value)}>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-ink/80">Price per day ($)</label>
                <input type="number" step="0.01" min="0" className={field} value={data.price_per_day} onChange={(e) => setData('price_per_day', e.target.value)} required />
                {errors.price_per_day && <p className="text-xs text-rust mt-1">{errors.price_per_day}</p>}
            </div>

            <div>
                <label className="text-sm font-medium text-ink/80">Description</label>
                <textarea rows={3} className={field} value={data.description} onChange={(e) => setData('description', e.target.value)} />
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!data.is_available} onChange={(e) => setData('is_available', e.target.checked)} />
                Available for hire (shown on the website)
            </label>

            <div className="flex items-center gap-3">
                <button type="submit" disabled={processing} className="rounded-full bg-tide text-paper px-6 py-2.5 font-medium hover:bg-tide-light disabled:opacity-60">
                    {processing ? 'Saving…' : submitLabel}
                </button>
                <button type="button" onClick={() => router.visit('/admin/vehicles')} className="text-sm text-ink/60 hover:underline">Cancel</button>
            </div>
        </form>
    );
}
