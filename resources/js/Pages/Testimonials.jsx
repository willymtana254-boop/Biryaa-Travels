import { Head, useForm, usePage } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';
import StarRating from '../Components/StarRating';
import TestimonialCard from '../Components/TestimonialCard';
import PrivacyNotice from '../Components/PrivacyNotice';

const inputClass =
    'mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tide-light/40';

export default function Testimonials({ testimonials, stats, services }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', location: '', service: '', rating: 0, message: '', reference: '', email: '', consent: false, website: '',
    });

    const border = (k) => (errors[k] ? 'border-rust' : 'border-ink/20 focus:border-tide');

    const submit = (e) => {
        e.preventDefault();
        post('/testimonials', { preserveScroll: true, onSuccess: () => reset() });
    };

    return (
        <SiteLayout>
            <Head title="Guest testimonials" />
            <div className="max-w-6xl mx-auto px-6 py-16">
                <p className="text-rust font-medium text-sm uppercase tracking-wide">Testimonials</p>
                <h1 className="mt-1 font-display text-3xl text-tide font-semibold">What our guests say</h1>
                {stats.count > 0 && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-ink/70">
                        <StarRating value={Math.round(stats.average)} />
                        <span><span className="font-semibold">{stats.average.toFixed(1)}</span> from {stats.count} {stats.count === 1 ? 'review' : 'reviews'}</span>
                    </p>
                )}

                {testimonials.length > 0 ? (
                    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t) => <TestimonialCard key={t.id} t={t} />)}
                    </div>
                ) : (
                    <p className="mt-8 text-ink/60">No testimonials yet. Be the first to share your experience below.</p>
                )}

                <section className="mt-16 max-w-xl">
                    <h2 className="font-display text-2xl text-tide font-semibold">Share your experience</h2>
                    <p className="mt-1 text-sm text-ink/60">Your words help other travellers choose with confidence. We read every testimonial before it is shown.</p>

                    {flash?.success && <p className="mt-4 rounded-lg bg-green-50 text-green-800 text-sm px-4 py-2">{flash.success}</p>}

                    <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                        {/* Honeypot: hidden from people */}
                        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => setData('website', e.target.value)} className="hidden" aria-hidden="true" />

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-ink/80">Your name <span className="text-rust">*</span></label>
                                <input className={`${inputClass} ${border('name')}`} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="mt-1 text-xs text-rust">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-ink/80">Where are you from?</label>
                                <input className={`${inputClass} ${border('location')}`} placeholder="e.g. Nairobi, London" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-ink/80">Service you used <span className="text-rust">*</span></label>
                            <select className={`${inputClass} ${border('service')}`} value={data.service} onChange={(e) => setData('service', e.target.value)}>
                                <option value="">Choose…</option>
                                {Object.entries(services).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            {errors.service && <p className="mt-1 text-xs text-rust">{errors.service}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-ink/80">Your rating <span className="text-rust">*</span></label>
                            <div className="mt-1.5"><StarRating value={data.rating} onChange={(n) => setData('rating', n)} size={28} /></div>
                            {errors.rating && <p className="mt-1 text-xs text-rust">{errors.rating}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-ink/80">Your experience <span className="text-rust">*</span></label>
                            <textarea rows={4} maxLength={600} className={`${inputClass} ${border('message')}`} value={data.message} onChange={(e) => setData('message', e.target.value)} />
                            <p className="mt-1 text-xs text-ink/45">{data.message.length}/600</p>
                            {errors.message && <p className="mt-1 text-xs text-rust">{errors.message}</p>}
                        </div>

                        <div className="rounded-xl bg-sand/60 p-4">
                            <p className="text-sm font-medium text-ink/80">Booked with us? Get a “Verified booking” badge (optional)</p>
                            <div className="mt-3 grid sm:grid-cols-2 gap-4">
                                <input className={`${inputClass} mt-0 ${border('reference')}`} placeholder="Booking reference" value={data.reference} onChange={(e) => setData('reference', e.target.value)} />
                                <input type="email" className={`${inputClass} mt-0 ${border('email')}`} placeholder="Email used to book" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-rust">{errors.email}</p>}
                            <p className="mt-2 text-xs text-ink/50">Your email is only used to check the booking. It is never shown.</p>
                        </div>

                        <label className="flex gap-3 text-xs text-ink/75">
                            <input type="checkbox" className="mt-0.5" checked={data.consent} onChange={(e) => setData('consent', e.target.checked)} />
                            <span>I agree that Biryaa Travels may show my name, town and testimonial on its website.</span>
                        </label>
                        {errors.consent && <p className="text-xs text-rust">{errors.consent}</p>}

                        <PrivacyNotice />

                        <button type="submit" disabled={processing} className="rounded-full bg-tide text-paper px-6 py-3 text-sm font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                            {processing ? 'Sending…' : 'Send my testimonial'}
                        </button>
                    </form>
                </section>
            </div>
        </SiteLayout>
    );
}
