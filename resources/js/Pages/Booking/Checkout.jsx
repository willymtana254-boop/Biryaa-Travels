import SiteLayout from '../../Layouts/SiteLayout';
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

const titleFor = (type, bookable) => {
    if (type === 'transfer') return `${bookable.from_location?.name} → ${bookable.to_location?.name}`;
    return bookable.name;
};

const needsEndDate = (type) => type === 'vehicle' || type === 'villa';
const needsGuests = (type) => type === 'villa' || type === 'tour' || type === 'transfer';

export default function Checkout({ type, bookable, pricePerUnit, vehicles = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        type,
        bookable_id: bookable.id,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        start_date: '',
        end_date: '',
        guests: '',
        notes: '',
    });

    const [preferredVehicle, setPreferredVehicle] = useState('');

    const submit = (e) => {
        e.preventDefault();

        let finalNotes = data.notes;
        if (type === 'transfer' && preferredVehicle) {
            const vehicleName = vehicles.find((v) => String(v.id) === String(preferredVehicle))?.name;
            if (vehicleName) {
                finalNotes = `Preferred vehicle: ${vehicleName}.${data.notes ? ' ' + data.notes : ''}`;
            }
        }

        post('/bookings', {
            ...data,
            notes: finalNotes,
            transform: (formData) => ({ ...formData, notes: finalNotes }),
        });
    };

    return (
        <SiteLayout>
            <Head title={`Book ${titleFor(type, bookable)}`} />
            <div className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">Booking request</p>
                <h1 className="font-display text-3xl text-tide font-semibold">{titleFor(type, bookable)}</h1>
                <p className="mt-2 text-ink/60">
                    ${Number(pricePerUnit).toLocaleString()}
                    {type === 'vehicle' && ' / day'}
                    {type === 'villa' && ' / night'}
                    {type === 'tour' && ' / person'}
                </p>

                <form onSubmit={submit} className="mt-10 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Field label="Full name" error={errors.customer_name}>
                            <input className="input" value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} required />
                        </Field>
                        <Field label="Phone (WhatsApp)" error={errors.customer_phone}>
                            <input className="input" value={data.customer_phone} onChange={(e) => setData('customer_phone', e.target.value)} required />
                        </Field>
                    </div>

                    <Field label="Email" error={errors.customer_email}>
                        <input type="email" className="input" value={data.customer_email} onChange={(e) => setData('customer_email', e.target.value)} required />
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Field label={needsEndDate(type) ? 'Start date' : 'Date'} error={errors.start_date}>
                            <input type="date" className="input" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                        </Field>
                        {needsEndDate(type) && (
                            <Field label="End date" error={errors.end_date}>
                                <input type="date" className="input" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            </Field>
                        )}
                        {needsGuests(type) && (
                            <Field label="Guests" error={errors.guests}>
                                <input type="number" min="1" className="input" value={data.guests} onChange={(e) => setData('guests', e.target.value)} />
                            </Field>
                        )}
                    </div>

                    {type === 'transfer' && vehicles.length > 0 && (
                        <Field label="Preferred vehicle (optional)">
                            <select className="input" value={preferredVehicle} onChange={(e) => setPreferredVehicle(e.target.value)}>
                                <option value="">No preference — any available car</option>
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                                ))}
                            </select>
                        </Field>
                    )}

                    <Field label="Notes (optional)" error={errors.notes}>
                        <textarea className="input" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                    </Field>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60"
                    >
                        {processing ? 'Sending…' : 'Request booking'}
                    </button>
                    <p className="text-xs text-ink/50">
                        This confirms interest — our team will follow up on WhatsApp or email to finalize payment and details.
                    </p>
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