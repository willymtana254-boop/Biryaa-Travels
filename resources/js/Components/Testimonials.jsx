import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import StarRating from './StarRating';
import TestimonialCard from './TestimonialCard';

/**
 * Home page section. Loads real, approved testimonials itself, so it needs no props:
 *     <Testimonials />
 * It shows nothing until at least one testimonial has been approved in the admin.
 */
export default function Testimonials() {
    const [state, setState] = useState({ testimonials: [], count: 0, average: 0 });

    useEffect(() => {
        let alive = true;
        fetch('/testimonials/featured', { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => alive && d && setState(d))
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, []);

    const { testimonials, count, average } = state;

    return (
        <section className="bg-sand/60 py-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="text-rust font-medium text-sm uppercase tracking-wide">Guest stories</p>
                    <h2 className="mt-2 font-display text-3xl text-tide font-semibold">Trusted by travellers on the Kenyan Coast</h2>
                    {count > 0 && (
                        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-ink/70">
                            <StarRating value={Math.round(average)} />
                            <span><span className="font-semibold">{average.toFixed(1)}</span> from {count} guest {count === 1 ? 'review' : 'reviews'}</span>
                        </p>
                    )}
                </div>

                {testimonials.length > 0 ? (
                    <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.slice(0, 3).map((t) => (
                            <TestimonialCard key={t.id} t={t} />
                        ))}
                    </div>
                ) : (
                    <p className="mt-8 text-center text-sm text-ink/60">Be among the first to share your Biryaa experience.</p>
                )}

                <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center text-sm">
                    {[
                        ['Clear prices up front', 'See your total before you book. No hidden extras.'],
                        ['Verified car hire', 'Every hirer is checked with ID, licence and a live selfie.'],
                        ['Real people on WhatsApp', 'Talk to our team directly, before and during your trip.'],
                    ].map(([title, text]) => (
                        <div key={title} className="rounded-xl bg-white/70 border border-ink/10 px-4 py-4">
                            <p className="font-medium text-tide">{title}</p>
                            <p className="mt-1 text-xs text-ink/60">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/testimonials" className="inline-block rounded-full bg-tide text-paper px-6 py-2.5 text-sm font-medium hover:bg-tide-light transition-colors">
                        {count > 3 ? 'Read all reviews' : 'Share your experience'}
                    </Link>
                </div>
            </div>
        </section>
    );
}
