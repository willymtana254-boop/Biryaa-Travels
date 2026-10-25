import { Head, useForm } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';

// Edit these in one place if details change.
const CONTACT = {
    address: 'P.O. Box 3339-80100, Mombasa',
    phones: [
        { label: '+254 728 769 798', tel: '+254728769798' },
        { label: '+254 750 192 910', tel: '+254750192910' },
    ],
    email: 'info@biryaatravelsltd.co.ke',
    whatsapp: '254728769798',
    hours: 'Monday – Saturday, 8am – 6pm (East Africa Time)',
};

const inputClass =
    'w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm focus:border-tide focus:outline-none focus:ring-2 focus:ring-tide-light/40';

function InfoCard({ icon, title, children }) {
    return (
        <div className="flex gap-4 rounded-2xl bg-white border border-ink/10 p-5">
            <div className="shrink-0 w-11 h-11 rounded-full bg-tide/10 text-tide flex items-center justify-center">{icon}</div>
            <div className="text-sm">
                <p className="font-display text-base text-tide font-semibold mb-1">{title}</p>
                <div className="text-ink/75 space-y-1">{children}</div>
            </div>
        </div>
    );
}

const icons = {
    pin: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    ),
    phone: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
        </svg>
    ),
    mail: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </svg>
    ),
};

export default function Contact() {
    const form = useForm({ name: '', phone: '', email: '', subject: '', message: '', website: '' });

    const submit = (e) => {
        e.preventDefault();
        form.post('/contact', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <SiteLayout>
            <Head title="Contact Us" />

            {/* Page header */}
            <section className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FCCA14] mb-3">Get in touch</p>
                    <h1 className="font-display text-4xl md:text-5xl font-semibold">Contact Us</h1>
                    <p className="mt-4 max-w-xl text-paper/80">
                        Send us an enquiry and we will get back to you shortly.
                    </p>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] to-[#FCCA14]" />
            </section>

            <section className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-10">
                {/* Left: details */}
                <div className="lg:col-span-2 space-y-4">
                    <InfoCard icon={icons.pin} title="Our Location">
                        <p>{CONTACT.address}</p>
                    </InfoCard>

                    <InfoCard icon={icons.phone} title="Phone Number">
                        {CONTACT.phones.map((p) => (
                            <p key={p.tel}>
                                <a href={`tel:${p.tel}`} className="hover:text-tide hover:underline">{p.label}</a>
                            </p>
                        ))}
                    </InfoCard>

                    <InfoCard icon={icons.mail} title="Email us">
                        <p>
                            <a href={`mailto:${CONTACT.email}`} className="hover:text-tide hover:underline break-all">{CONTACT.email}</a>
                        </p>
                    </InfoCard>

                    <div className="rounded-2xl bg-tide text-paper p-6">
                        <p className="font-display text-xl font-semibold">Need help?</p>
                        <p className="mt-1 text-sm text-paper/80">Call our travel experts</p>
                        <a href={`tel:${CONTACT.phones[0].tel}`} className="mt-2 block text-lg font-semibold text-[#FCCA14] hover:underline">
                            {CONTACT.phones[0].label}
                        </a>
                        <a
                            href={`https://wa.me/${CONTACT.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center rounded-full bg-[#25D366] px-5 py-2 text-sm font-medium text-white hover:brightness-95 transition"
                        >
                            Chat with us on WhatsApp
                        </a>
                        <p className="mt-4 text-xs text-paper/70">{CONTACT.hours}</p>
                    </div>
                </div>

                {/* Right: form */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl bg-white border border-ink/10 p-6 md:p-8">
                        <h2 className="font-display text-2xl text-tide font-semibold">Leave a message</h2>
                        <p className="mt-1 text-sm text-ink/60">Fields marked * are required. Give us a phone number or an email, so we can reply.</p>

                        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm mb-1 text-ink/70">Your name *</label>
                                <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                {form.errors.name && <p className="mt-1 text-xs text-rust">{form.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-ink/70">Phone / WhatsApp</label>
                                <input
                                    className={inputClass}
                                    placeholder="0712 345 678"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                />
                                {form.errors.phone && <p className="mt-1 text-xs text-rust">{form.errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-ink/70">Email</label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                                {form.errors.email && <p className="mt-1 text-xs text-rust">{form.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1 text-ink/70">Subject</label>
                                <input className={inputClass} value={form.data.subject} onChange={(e) => form.setData('subject', e.target.value)} />
                                {form.errors.subject && <p className="mt-1 text-xs text-rust">{form.errors.subject}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm mb-1 text-ink/70">Your message *</label>
                                <textarea
                                    rows={6}
                                    className={inputClass}
                                    value={form.data.message}
                                    onChange={(e) => form.setData('message', e.target.value)}
                                />
                                {form.errors.message && <p className="mt-1 text-xs text-rust">{form.errors.message}</p>}
                            </div>

                            {/* Spam trap: hidden from people, bots fill it in */}
                            <div className="hidden" aria-hidden="true">
                                <label>Website</label>
                                <input tabIndex={-1} autoComplete="off" value={form.data.website} onChange={(e) => form.setData('website', e.target.value)} />
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-full bg-[#FCCA14] text-ink px-8 py-3 text-sm font-medium hover:brightness-95 transition disabled:opacity-60"
                                >
                                    {form.processing ? 'Sending…' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
