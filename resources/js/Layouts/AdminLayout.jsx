import { Link } from '@inertiajs/react';

const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/vehicles', label: 'Vehicles' },
    { href: '/admin/drivers', label: 'Drivers' },
    { href: '/admin/catalog/vehicles', label: 'Catalog' },
    { href: '/admin/notifications', label: 'Notifications' },
    { href: '/admin/reviews', label: 'Reviews' },
];

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-sand/40 text-ink">
            <header className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 py-2 min-h-16 flex items-center justify-between text-sm flex-wrap gap-y-2">
                    <Link href="/admin" className="flex items-center gap-3">
                        <span className="inline-flex rounded-2xl bg-white/95 px-6 py-3 shadow-lg">
                            <img src="/images/biryaa-logo.png" alt="Biryaa Travels" className="h-28 w-auto" />
                        </span>
                        <span className="text-paper/50">·</span>
                        <span className="font-medium text-paper/80">Admin</span>
                    </Link>
                    <nav className="flex items-center gap-6 flex-wrap">
                        {nav.map((item) => (
                            <Link key={item.href} href={item.href} className="text-paper/80 hover:text-[#FCCA14]">
                                {item.label}
                            </Link>
                        ))}
                        <Link href="/logout" method="post" as="button" className="text-paper/80 hover:text-[#FCCA14]">
                            Log out
                        </Link>
                    </nav>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#14B1C5] via-[#14B1C5] to-[#FCCA14]" />
            </header>
            <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
        </div>
    );
}