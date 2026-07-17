const DEFAULT_REVIEWS = [
    { name: 'Sean McGovern', time: '3 months ago', text: 'Very good and helpful. Give us a great driver and clean car.' },
    { name: 'Ken Ouchi', time: '3 months ago', text: 'It\u2019s my second time using Castro and as usual he is reliable and all round great service. I highly recommend.' },
    { name: 'Asad Khan', time: '4 months ago', text: 'Best services, perfect new cars, no long process for documentations... Thanks!' },
    { name: 'ann wanjiru', time: '4 months ago', text: 'The best car hire in Kilifi \u2014 I would recommend them over and over again. Their services are legit and good, they are fast and accessible, everything in good condition.' },
    { name: 'Jesse Patrick', time: '4 months ago', text: 'Great communication, great service and they are very welcoming. I personally enjoyed their rental services \u2014 very seamless and professional. I highly recommend them.' },
    { name: 'Clio Horsey', time: '6 months ago', text: 'The best car rental in Kilifi \u2014 10/10. Super responsive and accommodating.' },
];

function Stars() {
    return (
        <div className="flex gap-0.5 text-rust" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.5l2.6 5.6 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.4 7.8l6-.7L10 1.5z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials({ reviews = DEFAULT_REVIEWS, ratingLabel = 'EXCELLENT', reviewCount = 29 }) {
    return (
        <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
                <div>
                    <h2 className="font-display text-2xl text-tide font-semibold">What Our Customers Say</h2>
                    <p className="mt-2 text-ink/60">Trusted by tourists, families & business travelers</p>
                </div>
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-sm font-semibold tracking-wide text-ink">{ratingLabel}</p>
                        <Stars />
                    </div>
                    <span className="text-sm text-ink/50">Based on {reviewCount} reviews</span>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((r) => (
                    <div key={r.name} className="rounded-2xl border border-ink/10 bg-white/70 p-6">
                        <Stars />
                        <p className="mt-4 text-sm text-ink/70 leading-relaxed">{r.text}</p>
                        <div className="mt-5 flex items-center justify-between">
                            <span className="font-medium text-sm text-ink">{r.name}</span>
                            <span className="text-xs text-ink/40">{r.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
