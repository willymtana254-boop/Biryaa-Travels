import { useState, useMemo, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Resize in the browser (max 1600px, JPEG) so uploads stay small and GPS data is dropped.
async function shrink(file, maxSide = 1600, quality = 0.82) {
    try {
        const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
        const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (!blob) return file;
        return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
    } catch {
        return file;
    }
}

export default function ReviewCreate({ tour, prefill, maxPhotos }) {
    const { data, setData, post, processing, errors } = useForm({
        reference: prefill?.reference || '',
        email: '',
        rating: 0,
        title: '',
        body: '',
        marketing_consent: false,
        photos: [],
    });
    const [preparing, setPreparing] = useState(false);

    const previews = useMemo(() => data.photos.map((f) => URL.createObjectURL(f)), [data.photos]);
    useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

    const addPhotos = async (e) => {
        const chosen = Array.from(e.target.files || []).slice(0, Math.max(0, maxPhotos - data.photos.length));
        e.target.value = '';
        if (!chosen.length) return;
        setPreparing(true);
        const ready = await Promise.all(chosen.map((f) => shrink(f)));
        setData('photos', [...data.photos, ...ready]);
        setPreparing(false);
    };

    const removePhoto = (i) => setData('photos', data.photos.filter((_, idx) => idx !== i));

    const submit = (e) => {
        e.preventDefault();
        post(`/experiences/${tour.slug}/review`, { forceFormData: true });
    };

    const photoErrorKey = Object.keys(errors).find((k) => k.startsWith('photos'));

    return (
        <SiteLayout>
            <Head title={`Review ${tour.name}`} />
            <div className="max-w-2xl mx-auto px-6 py-16">
                <Link href={`/experiences/${tour.slug}`} className="text-sm text-ink/50 hover:text-tide">← Back to experience</Link>
                <p className="mt-6 text-rust font-medium text-sm uppercase tracking-wide mb-2">Share your experience</p>
                <h1 className="font-display text-3xl text-tide font-semibold">{tour.name}</h1>
                <p className="mt-3 text-ink/60 text-sm leading-relaxed">
                    Only guests who've taken this experience can review it — that's what keeps our ratings honest.
                    Use the booking reference from your confirmation and the email you booked with.
                </p>

                <form onSubmit={submit} className="mt-10 space-y-7">
                    <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Booking reference" error={errors.reference}>
                            <input className="input" placeholder="GBR-XXXXXXXX" value={data.reference} onChange={(e) => setData('reference', e.target.value)} required />
                        </Field>
                        <Field label="Email used to book" error={errors.email}>
                            <input type="email" className="input" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        </Field>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-ink/80">Your rating</p>
                        <div className="mt-2 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setData('rating', n)}
                                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                                    aria-pressed={data.rating === n}
                                    className={`text-4xl leading-none transition-colors ${n <= data.rating ? 'text-amber-500' : 'text-ink/20 hover:text-amber-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                            <span className="ml-3 text-sm text-ink/60">{LABELS[data.rating]}</span>
                        </div>
                        {errors.rating && <p className="mt-1 text-xs text-rust">{errors.rating}</p>}
                    </div>

                    <Field label="Headline (optional)" error={errors.title}>
                        <input className="input" maxLength={120} placeholder="e.g. Dolphins at sunrise!" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    </Field>

                    <Field label="Tell us about it" error={errors.body}>
                        <textarea className="input" rows={5} value={data.body} onChange={(e) => setData('body', e.target.value)} required />
                    </Field>

                    <div>
                        <p className="text-sm font-medium text-ink/80">Photos (up to {maxPhotos})</p>
                        <p className="text-xs text-ink/50 mt-1">On your phone you can take a photo now or pick from your gallery. Please only upload photos you took yourself.</p>

                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {previews.map((src, i) => (
                                <div key={src} className="relative aspect-square rounded-lg overflow-hidden bg-sand">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(i)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink/70 text-paper text-xs leading-none"
                                        aria-label="Remove photo"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {data.photos.length < maxPhotos && (
                                <label className="aspect-square rounded-lg border-2 border-dashed border-ink/20 flex flex-col items-center justify-center text-ink/50 text-xs cursor-pointer hover:border-tide hover:text-tide transition-colors text-center px-1">
                                    <span className="text-2xl leading-none">＋</span>
                                    <span className="mt-1">{preparing ? 'Preparing…' : 'Add photo'}</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
                                </label>
                            )}
                        </div>
                        {photoErrorKey && <p className="mt-2 text-xs text-rust">{errors[photoErrorKey]}</p>}
                    </div>

                    <label className="flex items-start gap-3 text-sm text-ink/70">
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={data.marketing_consent}
                            onChange={(e) => setData('marketing_consent', e.target.checked)}
                        />
                        <span>
                            Biryaa Travels may also feature my photos on its website and social media (credited by first name only).
                        </span>
                    </label>
                    <p className="text-xs text-ink/50 -mt-3">
                        Your review and photos are shown publicly on this experience's page once our team has approved them.
                    </p>

                    <button
                        type="submit"
                        disabled={processing || preparing}
                        className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60"
                    >
                        {processing ? 'Submitting…' : 'Submit review'}
                    </button>
                </form>
            </div>

            <style>{`
                .input {
                    width: 100%;
                    border-radius: 0.5rem;
                    border: 1px solid rgb(28 35 33 / 0.2);
                    padding: 0.625rem 1rem;
                    background: white;
                    font-size: 0.9rem;
                }
                .input:focus { outline: 2px solid #C1502E; outline-offset: 1px; }
            `}</style>
        </SiteLayout>
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