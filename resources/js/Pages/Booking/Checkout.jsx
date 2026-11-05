import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { Money, useMoney } from '../../lib/currency';
import PhoneInput from '../../Components/PhoneInput';
import PrivacyNotice from '../../Components/PrivacyNotice';
import { phoneError } from '../../lib/phone';

const FIELD_NAMES = {
    customer_name: 'Full name',
    customer_phone: 'Phone',
    customer_email: 'Email',
    start_date: 'Start date',
    end_date: 'End date',
    pickup_time: 'Pickup time',
    guests: 'Guests',
    flight_or_train_number: 'Flight / train number',
    pickup_address: 'Address',
    notes: 'Notes',
    accept_terms: 'Terms',
};

const titleFor = (type, bookable) =>
    type === 'transfer' ? `${bookable.from_location?.name} → ${bookable.to_location?.name}` : bookable.name;

const needsEndDate = (type) => type === 'vehicle' || type === 'villa';

export default function Checkout({ type, bookable, pricePerUnit, vehicles = [], extraOptions = [], driverFeePerDay = 0, discountTiers = [] }) {
    const { data, setData, post, processing, errors, transform, setError, clearErrors } = useForm({
        type,
        bookable_id: bookable.id,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        start_date: '',
        end_date: '',
        guests: type === 'tour' ? 1 : '',
        pickup_time: '',
        pickup_address: '',
        flight_or_train_number: '',
        with_driver: false,
        extras: {},
        notes: '',
        accept_terms: false,
    });

    const [preferredVehicle, setPreferredVehicle] = useState('');
    const [quote, setQuote] = useState(null);
    const [quoting, setQuoting] = useState(false);
    const { fmt } = useMoney();

    // Fold the preferred vehicle into the notes the admin sees.
    transform((d) => {
        let notes = d.notes;
        if (type === 'transfer' && preferredVehicle) {
            const name = vehicles.find((v) => String(v.id) === String(preferredVehicle))?.name;
            if (name) notes = `Preferred vehicle: ${name}.${d.notes ? ' ' + d.notes : ''}`;
        }
        return { ...d, notes };
    });

    // Live price: ask the server whenever something that affects the price changes.
    const extrasKey = JSON.stringify(data.extras);
    useEffect(() => {
        if (!data.start_date) {
            setQuote(null);
            return;
        }

        const params = new URLSearchParams({ type, id: String(bookable.id), start_date: data.start_date });
        if (data.end_date) params.set('end_date', data.end_date);
        if (data.guests) params.set('guests', String(data.guests));
        if (data.with_driver) params.set('with_driver', '1');
        Object.entries(data.extras).forEach(([k, q]) => {
            if (q > 0) params.set(`extras[${k}]`, String(q));
        });

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setQuoting(true);
            try {
                const res = await fetch(`/booking/quote?${params}`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                    signal: controller.signal,
                });
                setQuote(res.ok ? await res.json() : null);
            } catch (e) {
                if (e.name !== 'AbortError') setQuote(null);
            } finally {
                setQuoting(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [data.start_date, data.end_date, data.guests, data.with_driver, extrasKey]);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        // Check the phone here first so the person sees the exact problem straight away.
        const problem = phoneError(data.customer_phone);
        if (problem) {
            setError('customer_phone', problem);
            document.getElementById('customer_phone')?.focus();
            return;
        }

        if (!data.accept_terms) {
            setError('accept_terms', 'Please tick the box to accept the Terms & Conditions.');
            document.getElementById('accept_terms')?.focus();
            return;
        }

        post('/bookings', {
            onError: (errs) => {
                const first = Object.keys(errs)[0];
                if (first) document.getElementById(first)?.focus();
            },
        });
    };

    const unavailable = quote?.available === false;

    return (
        <SiteLayout>
            <Head title={`Book ${titleFor(type, bookable)}`} />
            <div className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-rust font-medium text-sm uppercase tracking-wide mb-2">Booking request</p>
                <h1 className="font-display text-3xl text-tide font-semibold">{titleFor(type, bookable)}</h1>
                <p className="mt-2 text-ink/60">
                    <Money usd={pricePerUnit} />
                    {type === 'vehicle' && ' / day'}
                    {type === 'villa' && ' / night'}
                    {type === 'tour' && ' / person'}
                    {type === 'transfer' && ' per vehicle'}
                </p>
                {discountTiers.length > 0 && (
                    <p className="mt-1 text-xs text-lagoon font-medium">
                        Stay longer, pay less: {discountTiers.map((t) => `${t.min_days}+ ${type === 'villa' ? 'nights' : 'days'} → ${t.percent}% off`).join(' · ')}
                    </p>
                )}

                <form onSubmit={submit} className="mt-10 space-y-6" noValidate>
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-lg bg-rust/10 px-4 py-3 text-sm text-rust" role="alert">
                            <p className="font-medium">Please fix the following:</p>
                            <ul className="mt-1 list-disc pl-5 space-y-0.5">
                                {Object.entries(errors).map(([key, message]) => (
                                    <li key={key}>{FIELD_NAMES[key] ? `${FIELD_NAMES[key]}: ` : ''}{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Field label="Full name" error={errors.customer_name}>
                            <input id="customer_name" className="input" value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} required />
                        </Field>
                        <Field label="Phone (WhatsApp)">
                            <PhoneInput id="customer_phone" value={data.customer_phone} onChange={(v) => setData('customer_phone', v)} error={errors.customer_phone} required />
                        </Field>
                    </div>

                    <Field label="Email" error={errors.customer_email}>
                        <input id="customer_email" type="email" className="input" value={data.customer_email} onChange={(e) => setData('customer_email', e.target.value)} required />
                    </Field>

                    <PrivacyNotice />

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Field label={needsEndDate(type) ? (type === 'villa' ? 'Check-in' : 'Pick-up date') : 'Date'} error={errors.start_date}>
                            <input id="start_date" type="date" className="input" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                        </Field>
                        {needsEndDate(type) && (
                            <Field label={type === 'villa' ? 'Check-out' : 'Return date'} error={errors.end_date}>
                                <input id="end_date" type="date" className="input" min={data.start_date || undefined} value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            </Field>
                        )}
                        {type === 'transfer' && (
                            <Field label="Pickup time" error={errors.pickup_time}>
                                <input type="time" className="input" value={data.pickup_time} onChange={(e) => setData('pickup_time', e.target.value)} required />
                            </Field>
                        )}
                        {(type === 'tour' || type === 'villa' || type === 'transfer') && (
                            <Field label={type === 'tour' ? 'Number of guests' : 'Guests'} error={errors.guests}>
                                <input type="number" min="1" className="input" value={data.guests} onChange={(e) => setData('guests', e.target.value)} required={type === 'tour'} />
                            </Field>
                        )}
                    </div>

                    {type === 'transfer' && (
                        <>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <Field label="Flight or train number (optional)" error={errors.flight_or_train_number}>
                                    <input className="input" placeholder="e.g. KQ612 or Madaraka Express" value={data.flight_or_train_number} onChange={(e) => setData('flight_or_train_number', e.target.value)} />
                                </Field>
                                <Field label="Hotel / villa / address (optional)" error={errors.pickup_address}>
                                    <input className="input" value={data.pickup_address} onChange={(e) => setData('pickup_address', e.target.value)} />
                                </Field>
                            </div>
                            {vehicles.length > 0 && (
                                <Field label="Preferred vehicle (optional)">
                                    <select className="input" value={preferredVehicle} onChange={(e) => setPreferredVehicle(e.target.value)}>
                                        <option value="">No preference — any available car</option>
                                        {vehicles.map((v) => (
                                            <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                                        ))}
                                    </select>
                                </Field>
                            )}
                        </>
                    )}

                    {type === 'vehicle' && driverFeePerDay > 0 && (
                        <label className="flex items-start gap-3 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm">
                            <input type="checkbox" className="mt-1" checked={data.with_driver} onChange={(e) => setData('with_driver', e.target.checked)} />
                            <span>
                                <span className="font-medium">Add a professional driver</span>
                                <span className="block text-xs text-ink/50">+ {fmt(driverFeePerDay)} per day</span>
                            </span>
                        </label>
                    )}

                    {extraOptions.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-ink/80">Add-ons</p>
                            <div className="mt-2 space-y-2">
                                {extraOptions.map((o) => (
                                    <label key={o.key} className="flex items-center justify-between gap-4 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm">
                                        <span>
                                            <span className="font-medium">{o.label}</span>
                                            <span className="block text-xs text-ink/50">{fmt(o.price)} {o.unit === 'day' ? 'per day' : 'per trip'}, each</span>
                                        </span>
                                        <select
                                            className="rounded-lg border border-ink/20 px-2 py-1"
                                            value={data.extras[o.key] ?? 0}
                                            onChange={(e) => setData('extras', { ...data.extras, [o.key]: Number(e.target.value) })}
                                        >
                                            {Array.from({ length: o.max + 1 }, (_, i) => i).map((n) => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <Field label="Notes (optional)" error={errors.notes}>
                        <textarea className="input" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                    </Field>

                    <div className="rounded-2xl border border-ink/10 bg-white/70 p-5">
                        <p className="text-sm font-medium text-ink/80">Your price</p>
                        {!data.start_date ? (
                            <p className="mt-2 text-sm text-ink/50">Choose a date to see your total.</p>
                        ) : !quote ? (
                            <p className="mt-2 text-sm text-ink/50">{quoting ? 'Calculating…' : 'Enter valid dates to see your total.'}</p>
                        ) : (
                            <>
                                {unavailable && (
                                    <p className="mt-2 rounded-lg bg-rust/10 px-3 py-2 text-sm text-rust">
                                        This is already booked for some of those dates. Please pick different dates.
                                    </p>
                                )}
                                <div className="mt-3 space-y-1 text-sm">
                                    {quote.lines.map((l, i) => (
                                        <div key={i} className="flex justify-between gap-4">
                                            <span className="text-ink/70">{l.label}</span>
                                            <span className={l.amount < 0 ? 'text-lagoon' : ''}>{fmt(l.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-3">
                                    <span className="font-medium">Total</span>
                                    <span className="font-display text-2xl text-tide font-semibold">{fmt(quote.total)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <label className="flex items-start gap-3 text-sm text-ink/80">
                            <input
                                id="accept_terms"
                                type="checkbox"
                                className="mt-1"
                                checked={data.accept_terms}
                                onChange={(e) => setData('accept_terms', e.target.checked)}
                            />
                            <span>
                                I have read and accept the{' '}
                                <Link href="/terms" target="_blank" className="underline text-tide">Terms &amp; Conditions</Link>
                                {type === 'vehicle' && ', including the car hire rules and cancellation terms'}.
                            </span>
                        </label>
                        {errors.accept_terms && <p className="mt-1 text-xs text-rust">{errors.accept_terms}</p>}
                    </div>

                    {type === 'vehicle' && (
                        <p className="rounded-lg bg-sun/30 px-4 py-3 text-xs text-ink/80">
                            Car hire requires verification: after booking you will be asked for your ID or passport, driving licence, address and a live selfie. Please have them ready.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={processing || unavailable}
                        className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60"
                    >
                        {processing ? 'Sending…' : quote ? `Request booking · ${fmt(quote.total)}` : 'Request booking'}
                    </button>
                    <p className="text-xs text-ink/50">
                        This confirms interest. Our team will follow up on WhatsApp or email to finalize payment and details.
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