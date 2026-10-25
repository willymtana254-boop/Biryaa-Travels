import { COAST_TOWNS } from '../lib/coastTowns';

// Each link opens a live search for that town on the partner site, so the
// hotels, prices and availability shown there are always current.
const sites = [
    {
        name: 'Booking.com',
        url: (town) => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${town}, Kenya`)}`,
    },
    {
        name: 'Google Hotels',
        url: (town) => `https://www.google.com/travel/search?q=${encodeURIComponent(`hotels in ${town} Kenya`)}`,
    },
    {
        name: 'Airbnb',
        url: (town) => `https://www.airbnb.com/s/${encodeURIComponent(`${town}, Kenya`)}/homes`,
    },
    {
        name: 'Tripadvisor',
        url: (town) => `https://www.tripadvisor.com/Search?q=${encodeURIComponent(`hotels ${town} Kenya`)}`,
    },
];

export default function LiveHotelLinks() {
    return (
        <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {COAST_TOWNS.map((town) => (
                    <div key={town.name} className="rounded-2xl bg-white border border-ink/10 p-5">
                        <p className="font-display text-lg text-tide font-semibold">{town.name}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {sites.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.url(town.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/75 hover:border-tide hover:text-tide transition-colors"
                                >
                                    {s.name} ↗
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-ink/50">
                These links open other websites with live availability and prices. We are not affiliated with them and the
                bookings you make there are between you and that site. To book through Biryaa Travels, choose one of our own stays above.
            </p>
        </div>
    );
}
