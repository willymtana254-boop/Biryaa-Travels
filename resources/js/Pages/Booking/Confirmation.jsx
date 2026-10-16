import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import { Money } from '../../lib/currency';

export default function Confirmation({ booking }) {
    const lines = booking.price_breakdown || [];

    return (
        <SiteLayout>
            <Head title="Booking received" />
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <p className="text-rust font-medium text-sm uppercase tracking-wide mb-3">Booking received</p>
                <h1 className="font-display text-3xl text-tide font-semibold">Thanks, {booking.customer_name.split(' ')[0]} — we've got it.</h1>
                <p className="mt-4 text-ink/70">
                    Reference <span className="font-mono font-medium text-ink">{booking.reference}</span>. We'll confirm final availability and payment on WhatsApp or email shortly.
                </p>

                {lines.length > 0 && (
                    <div className="mt-8 rounded-2xl border border-ink/10 bg-white/60 p-6 text-left text-sm">
                        {lines.map((l, i) => (
                            <div key={i} className="flex justify-between gap-4 py-1">
                                <span className="text-ink/70">{l.label}</span>
                                <span className={l.amount < 0 ? 'text-lagoon' : ''}><Money usd={l.amount} /></span>
                            </div>
                        ))}
                        <div className="mt-2 flex justify-between border-t border-ink/10 pt-3 font-semibold">
                            <span>Total</span>
                            <span><Money usd={booking.total_price} /></span>
                        </div>
                    </div>
                )}

                <div className="mt-10 flex justify-center gap-4">
                    <a href="https://wa.me/254728769798" className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors">
                        Message us on WhatsApp
                    </a>
                    <Link href="/home" className="rounded-full border border-ink/20 px-6 py-3 font-medium hover:border-tide hover:text-tide transition-colors">
                        Back home
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}