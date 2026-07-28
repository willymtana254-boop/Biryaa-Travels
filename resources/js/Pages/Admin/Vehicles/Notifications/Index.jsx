import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function NotificationsIndex({ notifications }) {
    const markSent = (id) => {
        router.patch(`/admin/notifications/${id}/mark-sent`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Notifications" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Notifications</h1>

            <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10">
                {notifications.data.map((n) => (
                    <div key={n.id} className="flex items-center justify-between px-5 py-4 gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                {n.purpose === 'driver_job_assigned' ? 'Driver job' : 'Villa commission'} — {n.notifiable?.name}
                            </p>
                            <p className="text-xs text-ink/50 mt-1">{n.message}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${n.status === 'sent' ? 'bg-lagoon/10 text-tide' : 'bg-rust/10 text-rust'}`}>
                            {n.status}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                            
                           <a> href={`https://wa.me/${n.phone.replace(/\D/g, '')}?text=${encodeURIComponent(n.message)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => n.status === 'pending' && markSent(n.id)}
                                className="rounded-full bg-tide text-paper px-4 py-1.5 text-sm font-medium hover:bg-tide-light"
                            
                                Send on WhatsApp
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}