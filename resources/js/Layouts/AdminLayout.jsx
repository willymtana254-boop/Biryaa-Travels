import { Link } from '@inertiajs/react';

const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/vehicles', label: 'Vehicles' },
    { href: '/admin/drivers', label: 'Drivers' },
];

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-sand/40 text-ink">
            <header className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-sm flex-wrap gap-y-2">
                    <div className="flex items-center gap-3">
                        <img src="/images/biryaa-logo-white.png" alt="Biryaa Travels" className="h-24 w-auto" />
                        <span className="text-paper/50">·</span>
                        <span className="font-medium text-paper/80">Admin</span>
                    </div>
                    <nav className="flex items-center gap-6 flex-wrap">
                        {nav.map((item) => (
                            <Link key={item.href} href={item.href} className="text-paper/80 hover:text-paper">{item.label}</Link>
                        ))}
                        <Link href="/logout" method="post" as="button" className="text-paper/80 hover:text-rust-light">Log out</Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
        </div>
    );
}
