import { Head, useForm } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

const inputClass =
    'w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm focus:border-tide focus:outline-none focus:ring-2 focus:ring-tide-light/40';

export default function Lookup({ reference }) {
    const { data, setData, post, processing, errors } = useForm({ reference: reference || '', email: '' });

    return (
        <SiteLayout>
            <Head title="Verify your car hire" />
            <div className="max-w-lg mx-auto px-4 py-16">
                <h1 className="font-display text-3xl text-tide font-semibold">Verify your car hire</h1>
                <p className="mt-2 text-ink/70 text-sm">
                    For everyone's safety we need to confirm who is hiring the car. Enter your booking reference and the email you booked with.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); post('/verify'); }} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Booking reference</label>
                        <input className={inputClass} value={data.reference} onChange={(e) => setData('reference', e.target.value)} required />
                        {errors.reference && <p className="mt-1 text-xs text-rust">{errors.reference}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email used for the booking</label>
                        <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="mt-1 text-xs text-rust">{errors.email}</p>}
                    </div>
                    <button disabled={processing} className="rounded-full bg-tide text-white px-6 py-2.5 text-sm font-medium hover:bg-tide-light transition-colors disabled:opacity-50">
                        Continue
                    </button>
                </form>
            </div>
        </SiteLayout>
    );
}
