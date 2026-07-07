import { Link, usePage } from '@inertiajs/react';

const nav = [
    { href: '/car-hire', label: 'Car Hire' },
    { href: '/airport-transfers', label: 'Transfers' },
    { href: '/villas', label: 'Villas' },
    { href: '/experiences', label: 'Experiences' },
];

export default function SiteLayout({ children }) {
    const { props } = usePage();
    const user = props.auth?.user;
    const flash = props.flash || {};

    return (
        <div className="min-h-screen flex flex-col bg-paper text-ink">
            <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-display text-xl font-semibold text-tide tracking-tight">
                        Biryaa <span className="text-rust">Travels</span>
                    </Link>
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
