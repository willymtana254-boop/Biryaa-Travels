import { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import PhoneInput from '../../Components/PhoneInput';
import LiveSelfie from '../../Components/LiveSelfie';
import { shrinkImage } from '../../lib/shrinkImage';

const inputClass =
    'w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm focus:border-tide focus:outline-none focus:ring-2 focus:ring-tide-light/40';

const DOCS = [
    { kind: 'id_front', label: 'ID / passport photo page (front)', passportLabel: 'Passport photo page' },
    { kind: 'id_back', label: 'ID (back)', hideForPassport: true },
    { kind: 'licence_front', label: 'Driving licence (front)' },
    { kind: 'licence_back', label: 'Driving licence (back) – optional', optional: true },
];

function Step({ n, title, done, children }) {
    return (
        <section className="rounded-2xl bg-white border border-ink/10 p-6">
            <h2 className="font-display text-lg text-tide font-semibold flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full text-sm flex items-center justify-center ${done ? 'bg-green-600 text-white' : 'bg-tide/10 text-tide'}`}>{done ? '✓' : n}</span>
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

export default function Form({ booking, verification: v, smsEnabled, missing }) {
    const { flash } = usePage().props;
    const base = `/verify/${booking.reference}`;
    const locked = !v.editable;

    const { data, setData, post, processing, errors } = useForm({
        full_name: v.full_name || '',
        id_type: v.id_type,
        id_number: v.id_number || '',
        address_line: v.address_line || '',
        town: v.town || '',
        country: v.country || '',
        licence_number: v.licence_number || '',
        licence_expiry: v.licence_expiry || '',
        phone: v.phone || '',
        consent: v.consent,
    });

    const [code, setCode] = useState('');
    const [busy, setBusy] = useState('');
    const [localErrors, setLocalErrors] = useState({});

    const uploadDoc = async (kind, file) => {
        if (!file) return;
        setBusy(kind);
        const small = await shrinkImage(file);
        router.post(`${base}/document`, { kind, file: small }, {
            forceFormData: true,
            preserveScroll: true,
            onError: (e) => setLocalErrors(e),
            onFinish: () => setBusy(''),
        });
    };

    const sendSelfie = (image) => {
        setBusy('selfie');
        router.post(`${base}/selfie`, { image }, { preserveScroll: true, onError: (e) => setLocalErrors(e), onFinish: () => setBusy('') });
    };

    const detailsSaved = !missing.includes('details') && v.consent;
    const e = { ...localErrors, ...errors };

    return (
        <SiteLayout>
            <Head title="Verify your car hire" />
            <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
                <div>
                    <h1 className="font-display text-3xl text-tide font-semibold">Verify your car hire</h1>
                    <p className="mt-1 text-sm text-ink/70">Booking <span className="font-mono">{booking.reference}</span> · {booking.start_date} to {booking.end_date}</p>
                </div>

                {flash?.success && <p className="rounded-lg bg-green-50 text-green-800 text-sm px-4 py-2">{flash.success}</p>}

                {v.status === 'pending' && (
                    <div className="rounded-2xl bg-sun/30 p-5 text-sm">We have your documents and are reviewing them. We will contact you on WhatsApp or by phone.</div>
                )}
                {v.status === 'approved' && (
                    <div className="rounded-2xl bg-green-50 text-green-800 p-5 text-sm">You are verified. Thank you! We will confirm your booking shortly.</div>
                )}
                {v.status === 'rejected' && (
                    <div className="rounded-2xl bg-rust/10 text-rust p-5 text-sm">
                        We could not approve your documents. {v.reviewer_note} Please fix this and send again.
                    </div>
                )}

                <Step n={1} title="Your details" done={detailsSaved}>
                    <form
                        onSubmit={(ev) => { ev.preventDefault(); setLocalErrors({}); post(`${base}/details`, { preserveScroll: true }); }}
                        className="space-y-4"
                    >
                        <fieldset disabled={locked} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Full name (as on your ID)</label>
                                <input className={inputClass} value={data.full_name} onChange={(ev) => setData('full_name', ev.target.value)} />
                                {e.full_name && <p className="mt-1 text-xs text-rust">{e.full_name}</p>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">ID type</label>
                                    <select className={inputClass} value={data.id_type} onChange={(ev) => setData('id_type', ev.target.value)}>
                                        <option value="national_id">Kenyan National ID</option>
                                        <option value="passport">Passport</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">{data.id_type === 'passport' ? 'Passport number' : 'ID number'}</label>
                                    <input className={inputClass} value={data.id_number} onChange={(ev) => setData('id_number', ev.target.value)} />
                                    {e.id_number && <p className="mt-1 text-xs text-rust">{e.id_number}</p>}
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Driving licence number</label>
                                    <input className={inputClass} value={data.licence_number} onChange={(ev) => setData('licence_number', ev.target.value)} />
                                    {e.licence_number && <p className="mt-1 text-xs text-rust">{e.licence_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Licence expiry date</label>
                                    <input type="date" className={inputClass} value={data.licence_expiry} onChange={(ev) => setData('licence_expiry', ev.target.value)} />
                                    {e.licence_expiry && <p className="mt-1 text-xs text-rust">{e.licence_expiry}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Home address</label>
                                <input className={inputClass} value={data.address_line} onChange={(ev) => setData('address_line', ev.target.value)} placeholder="Street, estate, building" />
                                {e.address_line && <p className="mt-1 text-xs text-rust">{e.address_line}</p>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Town / city</label>
                                    <input className={inputClass} value={data.town} onChange={(ev) => setData('town', ev.target.value)} />
                                    {e.town && <p className="mt-1 text-xs text-rust">{e.town}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Country</label>
                                    <input className={inputClass} value={data.country} onChange={(ev) => setData('country', ev.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Phone number</label>
                                <PhoneInput value={data.phone} onChange={(val) => setData('phone', val)} error={e.phone} />
                            </div>
                            <label className="flex gap-3 text-xs text-ink/75">
                                <input type="checkbox" className="mt-0.5" checked={data.consent} onChange={(ev) => setData('consent', ev.target.checked)} />
                                <span>
                                    I agree that Biryaa Travels may collect and store my ID, driving licence, selfie, address and phone to verify me for this car hire, and delete them after the hire period. See our{' '}
                                    <Link href="/privacy" className="underline text-tide">Privacy Policy</Link>.
                                </span>
                            </label>
                            {e.consent && <p className="text-xs text-rust">{e.consent}</p>}
                        </fieldset>
                        {!locked && (
                            <button disabled={processing} className="rounded-full bg-tide text-white px-6 py-2.5 text-sm font-medium hover:bg-tide-light transition-colors disabled:opacity-50">
                                Save details
                            </button>
                        )}
                    </form>
                </Step>

                <Step n={2} title="Photos of your documents" done={!missing.some((m) => ['id_front', 'id_back', 'licence_front'].includes(m))}>
                    {!v.consent ? (
                        <p className="text-sm text-ink/60">Save your details first.</p>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-xs text-ink/60">Take clear photos in good light. All four corners must be visible.</p>
                            {DOCS.filter((d) => !(d.hideForPassport && v.id_type === 'passport')).map((d) => {
                                const has = v.documents.includes(d.kind);
                                return (
                                    <div key={d.kind} className="flex items-center justify-between gap-3 flex-wrap">
                                        <span className="text-sm">{has ? '✓ ' : ''}{v.id_type === 'passport' && d.passportLabel ? d.passportLabel : d.label}</span>
                                        {!locked && (
                                            <label className="cursor-pointer rounded-full border border-tide text-tide px-4 py-1.5 text-xs font-medium hover:bg-tide hover:text-white transition-colors">
                                                {busy === d.kind ? 'Uploading…' : has ? 'Replace' : 'Take / choose photo'}
                                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(ev) => uploadDoc(d.kind, ev.target.files[0])} />
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                            {e.file && <p className="text-xs text-rust">{e.file}</p>}
                        </div>
                    )}
                </Step>

                <Step n={3} title="Live selfie" done={!missing.includes('selfie')}>
                    {!v.consent ? (
                        <p className="text-sm text-ink/60">Save your details first.</p>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-ink/60">Look at the camera in good light, face clearly visible, no sunglasses or hat. This is taken live; uploads from your gallery are not accepted.</p>
                            {v.documents.includes('selfie') && <p className="text-sm">✓ Selfie saved</p>}
                            {!locked && <LiveSelfie disabled={busy === 'selfie'} onCapture={sendSelfie} />}
                            {e.image && <p className="text-xs text-rust">{e.image}</p>}
                        </div>
                    )}
                </Step>

                <Step n={4} title="Confirm your phone" done={v.phone_verified || !smsEnabled}>
                    {v.phone_verified ? (
                        <p className="text-sm">✓ Phone confirmed</p>
                    ) : smsEnabled ? (
                        <div className="space-y-3">
                            <p className="text-xs text-ink/60">We will text a 6-digit code to {v.phone || 'your phone'}.</p>
                            {!locked && (
                                <div className="flex flex-wrap gap-3 items-center">
                                    <button type="button" onClick={() => router.post(`${base}/send-code`, {}, { preserveScroll: true, onError: (x) => setLocalErrors(x) })} className="rounded-full border border-tide text-tide px-4 py-1.5 text-xs font-medium hover:bg-tide hover:text-white transition-colors">Send code</button>
                                    <input value={code} onChange={(ev) => setCode(ev.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="123456" className="w-28 rounded-lg border border-ink/20 px-3 py-1.5 text-sm" />
                                    <button type="button" onClick={() => router.post(`${base}/check-code`, { code }, { preserveScroll: true, onError: (x) => setLocalErrors(x) })} className="rounded-full bg-tide text-white px-4 py-1.5 text-xs font-medium">Confirm</button>
                                </div>
                            )}
                            {e.code && <p className="text-xs text-rust">{e.code}</p>}
                        </div>
                    ) : (
                        <p className="text-sm text-ink/70">Our team will confirm your phone by calling or messaging you on WhatsApp.</p>
                    )}
                </Step>

                {!locked && (
                    <div>
                        {e.submit && <p className="mb-2 text-sm text-rust">{e.submit}</p>}
                        <button
                            type="button"
                            disabled={missing.length > 0}
                            onClick={() => router.post(`${base}/submit`, {}, { preserveScroll: true, onError: (x) => setLocalErrors(x) })}
                            className="rounded-full bg-tide text-white px-8 py-3 text-sm font-medium hover:bg-tide-light transition-colors disabled:opacity-40"
                        >
                            Send for review
                        </button>
                        {missing.length > 0 && <p className="mt-2 text-xs text-ink/50">Still needed: {missing.map((m) => m.replace('_', ' ')).join(', ')}</p>}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
