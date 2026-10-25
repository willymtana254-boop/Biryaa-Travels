import { useState } from 'react';
import { COAST_TOWNS } from '../lib/coastTowns';

const CATEGORIES = [
    { key: 'villas', label: 'Villas & holiday homes', query: 'villas holiday homes' },
    { key: 'hotels', label: 'Hotels', query: 'hotels' },
    { key: 'restaurants', label: 'Restaurants', query: 'restaurants' },
];

export default function NearbyMap() {
    const [category, setCategory] = useState('hotels');
    const [townName, setTownName] = useState('Mombasa');
    const [here, setHere] = useState(null); // { lat, lng } from the visitor's device
    const [status, setStatus] = useState('idle'); // idle | locating | found | denied | unsupported

    const cat = CATEGORIES.find((c) => c.key === category);
    const town = COAST_TOWNS.find((t) => t.name === townName) || COAST_TOWNS[0];
    const place = here || town;
    const center = `${place.lat},${place.lng}`;

    // Google's keyless embed: shows live results for the search around the centre point.
    const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${cat.query} near ${center}`)}&z=14&hl=en&output=embed`;
    const openUrl = `https://www.google.com/maps/search/${encodeURIComponent(cat.query)}/@${center},14z`;

    const locate = () => {
        if (!('geolocation' in navigator)) {
            setStatus('unsupported');
            return;
        }
        setStatus('locating');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setStatus('found');
            },
            () => setStatus('denied'),
            { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
        );
    };

    const pickTown = (name) => {
        setTownName(name);
        setHere(null);
        setStatus('idle');
    };

    return (
        <div className="rounded-2xl bg-white border border-ink/10 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={locate}
                    disabled={status === 'locating'}
                    className="inline-flex items-center gap-2 rounded-full bg-[#FCCA14] text-ink px-5 py-2.5 text-sm font-medium hover:brightness-95 transition disabled:opacity-60"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                        <circle cx="12" cy="12" r="8" />
                    </svg>
                    {status === 'locating' ? 'Finding you…' : 'Use my location'}
                </button>

                <span className="text-sm text-ink/50">or pick a town</span>

                <select
                    value={here ? '' : townName}
                    onChange={(e) => pickTown(e.target.value)}
                    className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm"
                >
                    {here && <option value="">Your location</option>}
                    {COAST_TOWNS.map((t) => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                </select>
            </div>

            {status === 'found' && (
                <p className="mt-3 text-sm text-lagoon">Showing places around your current location.</p>
            )}
            {status === 'denied' && (
                <p className="mt-3 text-sm text-rust">
                    We could not get your location. Allow location access in your browser, or choose a town from the list.
                </p>
            )}
            {status === 'unsupported' && (
                <p className="mt-3 text-sm text-rust">Your browser cannot share its location. Choose a town from the list.</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                    <button
                        key={c.key}
                        type="button"
                        onClick={() => setCategory(c.key)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                            category === c.key ? 'bg-tide text-white' : 'bg-white border border-ink/15 text-ink/70 hover:border-tide'
                        }`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-ink/10 bg-sand">
                <iframe
                    key={embedSrc}
                    title={`${cat.label} near ${here ? 'you' : town.name}`}
                    src={embedSrc}
                    className="w-full h-[380px] md:h-[460px] border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/50">
                <p>
                    Results come live from Google Maps. {here ? 'Your location is only used to centre the map and is not saved by us.' : ''}
                </p>
                <a href={openUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-tide hover:underline">
                    Open in Google Maps →
                </a>
            </div>
        </div>
    );
}
