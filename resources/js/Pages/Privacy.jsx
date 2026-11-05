import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';

// Keep this number the same as KYC_RETENTION_DAYS in Render (default 90).
const RETENTION_DAYS = 90;
const UPDATED = '2 November 2026';
const EMAIL = 'info@biryaatravelsltd.co.ke';

function Section({ title, children }) {
    return (
        <section className="mt-10">
            <h2 className="font-display text-2xl text-tide font-semibold">{title}</h2>
            <div className="mt-3 space-y-3 text-ink/75 leading-relaxed">{children}</div>
        </section>
    );
}

function List({ items }) {
    return (
        <ul className="list-disc pl-6 space-y-1.5">
            {items.map((i) => (
                <li key={i}>{i}</li>
            ))}
        </ul>
    );
}

export default function Privacy() {
    return (
        <SiteLayout>
            <Head title="Privacy Policy" />

            <section className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FCCA14] mb-3">Biryaa Travels Ltd</p>
                    <h1 className="font-display text-4xl md:text-5xl font-semibold">Privacy Policy</h1>
                    <p className="mt-4 text-paper/80">Last updated {UPDATED}</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] to-[#FCCA14]" />
            </section>

            <div className="max-w-3xl mx-auto px-6 py-12">
                <p className="text-ink/75 leading-relaxed">
                    Biryaa Travels Ltd ("we", "us") is based in Mombasa, Kenya. This policy explains what personal information we collect
                    through this website, why we collect it, how we protect it and what rights you have. We handle your information in line
                    with the Kenya Data Protection Act, 2019.
                </p>

                <Section title="What we collect">
                    <List
                        items={[
                            'Contact details: your name, phone number and email address, when you make a booking or send us a message.',
                            'Booking details: what you booked, the dates, pickup address, flight or train number and any notes you give us.',
                            'For car hire only: your national ID or passport details, driving licence details, home address, a photo of your ID and driving licence, and a live selfie. We ask for these to check who is hiring our vehicle.',
                            'Technical data such as your IP address and browser type, which our hosting service records for security.',
                            'If you choose "Use my location" on the Accommodation page, your device location is used in your browser to centre a Google map. We do not receive or save it.',
                        ]}
                    />
                </Section>

                <Section title="Why we use it">
                    <List
                        items={[
                            'To confirm and manage your booking, arrange drivers and keep you updated about it.',
                            'To reply to your enquiries.',
                            'For car hire, to verify your identity and your right to drive before we hand over a vehicle, and to protect our vehicles and other customers against fraud and theft.',
                            'To meet legal and accounting requirements.',
                        ]}
                    />
                    <p>
                        We rely on your consent (for example, when you upload ID documents or tick the consent box), on the need to carry
                        out your booking, and on our legitimate interest in preventing fraud. We do not use your details for advertising
                        and we do not sell them.
                    </p>
                </Section>

                <Section title="Who can see it">
                    <p>
                        Only authorised Biryaa Travels staff can see your booking details. ID, driving licence and selfie images can be
                        opened only by authorised staff who are signed in to our admin area. We may pass the name, phone number and trip
                        details to the driver who is serving your booking. We use trusted service providers to run the website (hosting
                        and database, text-message delivery, and Google Maps), and they may process data on our behalf. We will disclose
                        information to the authorities only when the law requires it.
                    </p>
                </Section>

                <Section title="How we protect it">
                    <List
                        items={[
                            'The website uses an encrypted connection (https).',
                            'ID numbers, addresses, licence numbers and document images are stored in encrypted form.',
                            'Document images are never public. They are served only to signed-in administrators.',
                            'We ask for the minimum we need, and we delete the rest as described below.',
                        ]}
                    />
                </Section>

                <Section title="How long we keep it">
                    <p>
                        Verification documents and selfies for car hire are deleted automatically {RETENTION_DAYS} days after your hire ends,
                        or sooner if you ask. Booking and payment records are kept for as long as the law requires us to keep business
                        records. Contact-form messages are kept only as long as needed to deal with your enquiry.
                    </p>
                </Section>

                <Section title="Your rights">
                    <p>Under the Kenya Data Protection Act you can ask us to:</p>
                    <List
                        items={[
                            'tell you what personal data we hold about you and give you a copy,',
                            'correct anything that is wrong or out of date,',
                            'delete your data, or stop using it for a particular purpose,',
                            'withdraw a consent you gave us.',
                        ]}
                    />
                    <p>
                        Email us at{' '}
                        <a href={`mailto:${EMAIL}`} className="text-tide underline">
                            {EMAIL}
                        </a>{' '}
                        and we will respond promptly. If you are not satisfied, you may complain to the Office of the Data Protection
                        Commissioner of Kenya (odpc.go.ke).
                    </p>
                </Section>

                <Section title="Contact us">
                    <p>
                        Biryaa Travels Ltd, P.O. Box 3339-80100, Mombasa, Kenya. Phone +254 728 769 798. Email{' '}
                        <a href={`mailto:${EMAIL}`} className="text-tide underline">
                            {EMAIL}
                        </a>
                        .
                    </p>
                    <p>
                        <Link href="/contact" className="text-tide underline">
                            Send us a message
                        </Link>
                    </p>
                </Section>
            </div>
        </SiteLayout>
    );
}
