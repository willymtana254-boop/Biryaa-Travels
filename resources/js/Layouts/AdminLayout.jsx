import { Link } from '@inertiajs/react';

const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/bookings', label: 'Bookings' },
];

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-sand/40 text-ink">
            <header className="bg-tide text-paper">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-sm">
                    <span className="font-display font-semibold">Biryaa Travels · Admin</span>
                    <nav className="flex items-center gap-6">
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
