import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Stars from '../../../Components/Stars';

const TABS = ['pending', 'approved', 'rejected'];

export default function ReviewsIndex({ reviews, counts, status }) {
    return (
        <AdminLayout>
            <Head title="Reviews" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Guest reviews</h1>

            <div className="flex gap-2 mb-6">
                {TABS.map((t) => (
                    <Link
                        key={t}
                        href={`/admin/reviews?status=${t}`}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            status === t ? 'bg-tide text-paper border-tide' : 'border-ink/20 text-ink/70 hover:border-tide'
                        }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)} ({counts[t] ?? 0})
                    </Link>
                ))}
            </div>

            {reviews.data.length === 0 ? (
                <p className="text-sm text-ink/50">Nothing here.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.data.map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
            )}

            <div className="mt-6 flex items-center justify-between text-sm">
                {reviews.prev_page_url ? <Link href={reviews.prev_page_url} className="text-rust hover:underline">← Newer</Link> : <span />}
                {reviews.next_page_url ? <Link href={reviews.next_page_url} className="text-rust hover:underline">Older →</Link> : <span />}
            </div>
        </AdminLayout>
    );
}

function ReviewCard({ review }) {
    const [reply, setReply] = useState(review.admin_reply || '');
    const keep = { preserveScroll: true };

    const remove = () => {
        if (confirm('Delete this review and its photos permanently?')) {
            router.delete(`/admin/reviews/${review.id}`, keep);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-ink/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="font-medium">{review.reviewable?.name ?? 'Experience'}</p>
                    <p className="text-xs text-ink/50">
                        {review.reviewer_name} · {review.booking?.reference ?? 'no booking'} · {new Date(review.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {review.marketing_consent
                        ? <span className="px-2.5 py-1 rounded-full bg-lagoon/10 text-tide text-xs font-medium">OK for marketing</span>
                        : <span className="px-2.5 py-1 rounded-full bg-sand text-xs font-medium text-ink/60">Not for marketing</span>}
                    <Stars value={review.rating} size={16} />
                </div>
            </div>

            {review.title && <p className="mt-3 font-medium">{review.title}</p>}
            <p className="mt-1 text-sm text-ink/70 whitespace-pre-line">{review.body}</p>

            {review.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {review.photos.map((p) => (
                        <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="w-24 h-24 rounded-lg overflow-hidden bg-sand">
                            <img src={p.url} alt="" className="w-full h-full object-cover" />
                        </a>
                    ))}
                </div>
            )}

            <div className="mt-4">
                <textarea
                    rows={2}
                    className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
                    placeholder="Public reply from Biryaa Travels (optional)…"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => router.patch(`/admin/reviews/${review.id}/reply`, { admin_reply: reply }, keep)}
                    className="mt-2 text-sm font-medium text-rust hover:underline"
                >
                    Save reply
                </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
                {review.status !== 'approved' && (
                    <button type="button" onClick={() => router.patch(`/admin/reviews/${review.id}/approve`, {}, keep)} className="rounded-full bg-tide text-paper px-4 py-1.5 text-sm font-medium hover:bg-tide-light">
                        Approve & publish
                    </button>
                )}
                {review.status !== 'rejected' && (
                    <button type="button" onClick={() => router.patch(`/admin/reviews/${review.id}/reject`, {}, keep)} className="rounded-full border border-ink/20 px-4 py-1.5 text-sm font-medium hover:border-rust hover:text-rust">
                        Reject
                    </button>
                )}
                <button type="button" onClick={remove} className="ml-auto text-sm text-rust hover:underline">Delete</button>
            </div>
        </div>
    );
}