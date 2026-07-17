import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const nav = [
    { href: '/car-hire', label: 'Car Hire' },
    { href: '/airport-transfers', label: 'Transfers' },
    { href: '/villas', label: 'Villas' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/#services', label: 'About Us & Services' },
    { href: '/#destinations', label: 'Explore Destinations' },
];

export default function SiteLayout({ children }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const flash = props.flash || {};
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-paper text-ink">
            <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden -ml-2 p-2 text-ink/70 hover:text-tide"
                            aria-label="Open menu"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <Link href="/" className="font-display text-xl font-semibold text-tide tracking-tight">
                            Biryaa <span className="text-rust">Travels</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        {nav.map((item) => (
                            <Link key={item.href} href={item.href} className="text-ink/70 hover:text-tide transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4 text-sm">
                        {user ? (
                            <>
                                <span className="hidden sm:inline text-ink/60">Hi, {user.name.split(' ')[0]}</span>
                                <Link href="/logout" method="post" as="button" className="text-ink/70 hover:text-rust">
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="text-ink/70 hover:text-tide">Log in</Link>
                        )}

                        
                        <a
                            href="https://wa.me/254728769798"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:inline-flex items-center rounded-full bg-tide px-4 py-2 font-medium text-paper hover:bg-tide-light transition-colors"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-50 md:hidden transition-opacity ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div
                    className="absolute inset-0 bg-ink/40"
                    onClick={() => setMenuOpen(false)}
                />
                <div
                    className={`absolute left-0 top-0 h-full w-72 bg-paper shadow-xl flex flex-col transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10">
                        <span className="font-display text-lg font-semibold text-tide">
                            Biryaa <span className="text-rust">Travels</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(false)}
                            className="p-2 text-ink/60 hover:text-tide"
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col px-5 py-6 gap-1">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="px-3 py-3 rounded-lg text-ink/80 font-medium hover:bg-sand hover:text-tide transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto px-5 py-6 border-t border-ink/10 space-y-3">
                        {user ? (
                            <Link href="/logout" method="post" as="button" className="block w-full text-center rounded-full border border-ink/20 px-4 py-2.5 font-medium text-ink/80">
                                Log out
                            </Link>
                        ) : (
                            <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center rounded-full border border-ink/20 px-4 py-2.5 font-medium text-ink/80">
                                Log in
                            </Link>
                        )}

                        
                        <a
                            href="https://wa.me/254728769798"
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-center rounded-full bg-tide px-4 py-2.5 font-medium text-paper"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>

            {(flash.success || flash.error) && (
                <div className={`px-6 py-3 text-sm text-center ${flash.success ? 'bg-lagoon/10 text-tide' : 'bg-rust/10 text-rust'}`}>
                    {flash.success || flash.error}
                </div>
            )}

            <main className="flex-1">{children}</main>

            <footer className="border-t border-ink/10 bg-tide text-paper/90">
                <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4 text-sm">
                    <div>
                        <p className="font-display text-lg text-paper mb-2">Biryaa Travels</p>
                        <p className="text-paper/70 leading-relaxed">
                            Car hire, airport transfers, villas and curated experiences across the Kenyan Coast.
                        </p>
                    </div>
                    <div>
                        <p className="font-medium mb-3 text-paper">Services</p>
                        <ul className="space-y-2 text-paper/70">
                            <li><Link href="/car-hire" className="hover:text-paper">Self-Drive Car Hire</Link></li>
                            <li><Link href="/airport-transfers" className="hover:text-paper">Airport Transfers</Link></li>
                            <li><Link href="/villas" className="hover:text-paper">Villa Concierge</Link></li>
                            <li><Link href="/experiences" className="hover:text-paper">Tours & Experiences</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium mb-3 text-paper">Destinations</p>
                        <ul className="space-y-2 text-paper/70">
                            <li>Kilifi</li>
                            <li>Mombasa</li>
                            <li>Diani</li>
                            <li>Watamu</li>
                            <li>Malindi</li>
                            <li>Vipingo</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium mb-3 text-paper">Talk to us</p>
                        <a href="https://wa.me/254728769798" className="inline-flex items-center rounded-full bg-rust px-4 py-2 font-medium text-paper hover:bg-rust-light transition-colors">
                            Plan on WhatsApp
                        </a>
                    </div>
                </div>
                <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/50">
                    © {new Date().getFullYear()} Biryaa Travels. All rights reserved.
                </div>
            </footer>
        </div>
    );
}