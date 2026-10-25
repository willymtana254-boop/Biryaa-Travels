import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { waNumber } from '../../../lib/kes';

export default function MessagesIndex({ messages, unread }) {
    const toggle = (m) => router.patch(`/admin/messages/${m.id}/toggle-read`, {}, { preserveScroll: true });

    const remove = (m) => {
        if (window.confirm(`Delete the message from ${m.name}?`)) {
            router.delete(`/admin/messages/${m.id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Messages" />

            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
                <h1 className="font-display text-2xl text-tide font-semibold">Messages</h1>
                <p className="text-sm text-ink/60">{unread} unread</p>
            </div>

            <div className="space-y-4">
                {messages.data.length === 0 && (
                    <div className="bg-white rounded-xl border border-ink/10 px-5 py-10 text-center text-ink/50">
                        No messages yet. Enquiries from the Contact Us page appear here.
                    </div>
                )}

                {messages.data.map((m) => (
                    <article
                        key={m.id}
                        className={`bg-white rounded-xl border p-5 ${m.read_at ? 'border-ink/10' : 'border-[#FCCA14] shadow-sm'}`}
                    >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <p className="font-medium">
                                    {m.name}
                                    {!m.read_at && (
                                        <span className="ml-2 rounded-full bg-[#FCCA14] px-2 py-0.5 text-xs font-medium text-ink">New</span>
                                    )}
                                </p>
                                <p className="text-xs text-ink/50 mt-0.5">{new Date(m.created_at).toLocaleString()}</p>
                            </div>
                            {m.subject && <p className="text-sm font-medium text-tide">{m.subject}</p>}
                        </div>

                        <p className="mt-3 text-sm whitespace-pre-line">{m.message}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            {m.phone && (
                                <>
                                    <a href={`tel:+${waNumber(m.phone)}`} className="text-ink/70 hover:text-tide">{m.phone}</a>
                                    <a
                                        href={`https://wa.me/${waNumber(m.phone)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-tide hover:underline"
                                    >
                                        Reply on WhatsApp →
                                    </a>
                                </>
                            )}
                            {m.email && (
                                <a href={`mailto:${m.email}`} className="font-medium text-tide hover:underline">
                                    Reply by email →
                                </a>
                            )}
                            <span className="ml-auto flex gap-4">
                                <button type="button" onClick={() => toggle(m)} className="text-ink/60 hover:text-tide">
                                    {m.read_at ? 'Mark as unread' : 'Mark as read'}
                                </button>
                                <button type="button" onClick={() => remove(m)} className="text-rust hover:underline">
                                    Delete
                                </button>
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            {messages.last_page > 1 && (
                <div className="mt-6 flex items-center justify-between text-sm">
                    {messages.prev_page_url ? <Link href={messages.prev_page_url} className="text-tide hover:underline">← Newer</Link> : <span />}
                    <span className="text-ink/50">Page {messages.current_page} of {messages.last_page}</span>
                    {messages.next_page_url ? <Link href={messages.next_page_url} className="text-tide hover:underline">Older →</Link> : <span />}
                </div>
            )}
        </AdminLayout>
    );
}
