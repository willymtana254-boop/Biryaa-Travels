import { Head, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function Confirmation({ booking }) {
    return (
        <SiteLayout>
            <Head title="Booking received" />
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <p className="text-rust font-medium text-sm uppercase tracking-wide mb-3">Booking received</p>
                <h1 className="font-display text-3xl text-tide font-semibold">Thanks, {booking.customer_name.split(' ')[0]} — we've got it.</h1>
                <p className="mt-4 text-ink/70">
                    Reference <span className="font-mono font-medium text-ink">{booking.reference}</span>. We'll confirm final availability and payment on WhatsApp or email shortly.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <a href="https://wa.me/254700000000" className="rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors">
                        Message us on WhatsApp
                    </a>
                    <Link href="/" className="rounded-full border border-ink/20 px-6 py-3 font-medium hover:border-tide hover:text-tide transition-colors">
                        Back home
                    </Link>
                </div>
            </div>
        </SiteLayout>
    );
}
