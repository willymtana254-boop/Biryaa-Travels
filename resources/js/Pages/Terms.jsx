import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../Layouts/SiteLayout';

const kes = (n) => `KES ${Number(n).toLocaleString()}`;

function Section({ id, title, children }) {
    return (
        <section id={id} className="scroll-mt-28">
            <h2 className="font-display text-xl text-tide font-semibold">{title}</h2>
            <div className="mt-3 space-y-3 text-sm text-ink/75 leading-relaxed">{children}</div>
        </section>
    );
}

function List({ items }) {
    return (
        <ul className="list-disc pl-5 space-y-1.5">
            {items.filter(Boolean).map((i, n) => <li key={n}>{i}</li>)}
        </ul>
    );
}

export default function Terms({ policies: p }) {
    const b = p.booking;
    const c = p.cancellation;
    const car = p.car_hire;

    const toc = [
        ['booking', 'Bookings & payment'],
        ['cancellation', 'Cancellation & refunds'],
        ['car-hire', 'Car hire rules'],
        ['transfers', 'Airport & SGR transfers'],
        ['stays', 'Accommodation'],
        ['liability', 'Responsibility'],
    ];

    return (
        <SiteLayout>
            <Head title="Terms & Conditions" />
            <div className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-rust font-medium text-sm uppercase tracking-wide">Terms</p>
                <h1 className="mt-1 font-display text-3xl text-tide font-semibold">Terms & Conditions</h1>
                <p className="mt-2 text-sm text-ink/60">
                    Simple rules so everyone knows what to expect. Last updated {p.updated}. Questions? <Link href="/contact" className="underline text-tide">Contact us</Link> or WhatsApp +254 728 769 798.
                </p>

                <nav className="mt-6 flex flex-wrap gap-2 text-xs">
                    {toc.map(([id, label]) => (
                        <a key={id} href={`#${id}`} className="rounded-full bg-sand px-3 py-1.5 text-ink/70 hover:text-tide">{label}</a>
                    ))}
                </nav>

                <div className="mt-10 space-y-10">
                    <Section id="booking" title="Bookings & payment">
                        <List items={[
                            'A booking made on this website is a request. It is confirmed only when our team confirms it to you by email, WhatsApp or phone.',
                            'Prices are shown before you book and include the items listed in your price summary. The total is recalculated on our server when you book.',
                            b.payment_methods ? `Payment methods: ${b.payment_methods}.` : 'Our team will send payment details when confirming your booking.',
                            b.deposit_percent ? `A deposit of ${b.deposit_percent}% of the total secures your booking.` : 'If a deposit is needed to secure your booking, we will tell you the amount when confirming.',
                            'Prices can be shown in Kenya shillings or US dollars. The exchange rate used when you book is recorded with your booking.',
                            'Please check your details (names, dates, phone and email) carefully. Contact us quickly if anything is wrong.',
                        ]} />
                    </Section>

                    <Section id="cancellation" title="Cancellation & refunds">
                        <List items={[
                            c.free_until_hours != null
                                ? `You can cancel free of charge up to ${c.free_until_hours} hours before your booking starts.`
                                : 'Please tell us as early as possible if you need to cancel or change your dates. We will do our best to help.',
                            c.free_until_hours != null && c.late_refund_percent != null
                                ? (c.late_refund_percent > 0
                                    ? `Cancelling later than that: ${c.late_refund_percent}% of what you paid is refunded.`
                                    : 'Cancelling later than that: payments already made are not refunded.')
                                : c.free_until_hours == null ? 'Refunds are decided case by case and confirmed in writing.' : null,
                            'Refunds are made the same way you paid, and can take several working days to arrive.',
                            'If we have to cancel (for example the vehicle is not available), you get a full refund or a free change of dates.',
                        ]} />
                    </Section>

                    <Section id="car-hire" title="Car hire rules">
                        <p className="font-medium text-ink">Who can hire</p>
                        <List items={[
                            `The main driver must be at least ${car.min_driver_age} years old and have held a full driving licence for at least ${car.min_licence_years} years.`,
                            'Every hirer must complete verification before we confirm: a valid ID or passport, a valid driving licence, a home address, a confirmed phone number and a live selfie. The licence must be valid for the whole hire.',
                            'Only drivers named and verified on the booking may drive the car.',
                        ]} />
                        <p className="font-medium text-ink pt-2">Deposit, fuel and distance</p>
                        <List items={[
                            car.security_deposit_kes != null ? `A refundable security deposit of ${kes(car.security_deposit_kes)} is held for the hire and returned after the car comes back in the same condition.` : 'A refundable security deposit may be needed. We will tell you the amount before pickup.',
                            'Fuel: the car is given full and should come back full. Missing fuel is charged at the pump price plus a small refuelling fee.',
                            car.km_per_day != null ? `Distance: ${car.km_per_day} km per day are included. Extra distance is charged at a rate we tell you before pickup.` : 'Distance: we will tell you the daily kilometre allowance when confirming.',
                            car.late_return_kes_per_hour != null ? `Late return: ${kes(car.late_return_kes_per_hour)} per extra hour. A full extra day may be charged after several hours.` : 'Late return: extra hours are charged at a fair hourly rate and a full extra day may be charged after several hours. Tell us early if you need more time.',
                        ]} />
                        <p className="font-medium text-ink pt-2">Using the car</p>
                        <List items={[
                            'Obey all traffic laws. Fines, tolls and parking charges during the hire are the hirer’s responsibility.',
                            'No driving under the influence of alcohol or drugs, no smoking in the car, no racing, towing or illegal use.',
                            'No off-road driving or driving outside Kenya unless we have approved it in writing first.',
                            'Do not carry more passengers or luggage than the car is made for.',
                        ]} />
                        <p className="font-medium text-ink pt-2">Accidents, damage and theft</p>
                        <List items={[
                            'Call us at once on +254 728 769 798. In an accident, injury or theft, also report to the police and get a police abstract.',
                            'Do not admit fault or agree to pay anyone. Take photos and note names and phone numbers.',
                            'The hirer pays for damage, loss of parts, or loss of the car that insurance does not cover, up to the amounts we explain at pickup.',
                            'Please check the car and note any marks with us at pickup and again at return.',
                        ]} />
                        <p className="font-medium text-ink pt-2">Your documents</p>
                        <p>We keep ID, licence and selfie images only to verify you, protect the car and meet legal needs. They are stored securely and deleted after the hire period. See our <Link href="/privacy" className="underline text-tide">Privacy Policy</Link>.</p>
                    </Section>

                    <Section id="transfers" title="Airport & SGR transfers">
                        <List items={[
                            'Tell us your flight or train number and pickup time. We track delays where we can, but please message us if your plans change.',
                            'Our driver waits a reasonable time. After a long wait, extra waiting time may be charged.',
                            'The price is per vehicle, not per person. Please tell us the number of guests and bags so we send the right car.',
                        ]} />
                    </Section>

                    <Section id="stays" title="Accommodation">
                        <List items={[
                            'Check-in and check-out times, house rules and any extra charges are confirmed with your booking.',
                            'Guests are responsible for damage they cause during the stay.',
                            'The number of guests must not be more than the listing allows.',
                        ]} />
                    </Section>

                    <Section id="liability" title="Responsibility">
                        <List items={[
                            'We work hard to give you a safe and enjoyable trip. We cannot be responsible for events outside our control such as weather, road closures, strikes or government action, but we will help you find a solution.',
                            'Please look after your belongings. We are not responsible for items left in vehicles or accommodation.',
                            'These terms follow the laws of Kenya.',
                        ]} />
                    </Section>
                </div>
            </div>
        </SiteLayout>
    );
}
