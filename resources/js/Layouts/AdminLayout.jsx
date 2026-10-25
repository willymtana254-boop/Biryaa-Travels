import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const nav = [
    { href: '/admin', label: 'Dashboard', exact: true },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/vehicles', label: 'Vehicles' },
    { href: '/admin/drivers', label: 'Drivers' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/reviews', label: 'Reviews' },
];

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const flash = props.flash || {};
    const user = props.auth?.user;
    const [open, setOpen] = useState(false);
    const path = url.split('?')[0];

    const isActive = (item) => (item.exact ? path === item.href : path.startsWith(item.href));

    const links = (
        <nav className="flex flex-col gap-1 px-3 py-4">
            {nav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors border-l-4 ${
                        isActive(item)
                            ? 'bg-white/10 text-white border-[#FCCA14]'
                            : 'text-white/75 border-transparent hover:bg-white/5 hover:text-white'
                    }`}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    const footer = (
        <div className="mt-auto px-3 py-4 border-t border-white/10 space-y-1 text-sm">
            {user && <p className="px-3 pb-2 text-white/60 truncate">{user.name}</p>}
            <Link href="/home" className="block rounded-lg px-3 py-2 text-white/75 hover:bg-white/5 hover:text-white">
                View website
            </Link>
            <Link
                href="/logout"
                method="post"
                as="button"
                className="block w-full text-left rounded-lg px-3 py-2 text-white/75 hover:bg-white/5 hover:text-[#FCCA14]"
            >
                Log out
            </Link>
        </div>
    );

    const brand = (
        <Link href="/admin" className="flex items-center gap-2 px-5 pt-5 pb-3">
            <img src="/images/biryaa-logo-white.png" alt="Biryaa Travels" className="h-16 w-auto" />
        </Link>
    );

    return (
        <div className="min-h-screen bg-sand/40 text-ink">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 flex-col bg-tide text-paper">
                {brand}
                <p className="px-6 -mt-1 text-xs uppercase tracking-[0.2em] text-[#FCCA14]">Admin</p>
                {links}
                {footer}
            </aside>

            {/* Mobile top bar */}
            <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-tide px-4 h-14 text-paper">
                <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 -ml-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <img src="/images/biryaa-logo-white.png" alt="Biryaa Travels" className="h-10 w-auto" />
                <span className="w-8" />
            </header>

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
                <div
                    className={`absolute left-0 top-0 h-full w-64 bg-tide text-paper flex flex-col transition-transform duration-300 ${
                        open ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {brand}
                    {links}
                    {footer}
                </div>
            </div>

            <div className="md:pl-60">
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] to-[#FCCA14]" />
                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    {(flash.success || flash.error) && (
                        <div
                            className={`mb-6 rounded-lg px-4 py-3 text-sm ${
                                flash.success ? 'bg-lagoon/10 text-tide' : 'bg-rust/10 text-rust'
                            }`}
                        >
                            {flash.success || flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
