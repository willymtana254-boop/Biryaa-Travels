import { Head, router, useForm } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function VerifyEmail({ email, status }) {
    const { post, processing, errors } = useForm({});

    return (
        <SiteLayout>
            <Head title="Verify your email" />
            <div className="max-w-md mx-auto px-6 py-20 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-tide/10 text-tide flex items-center justify-center text-2xl">✉</div>
                <h1 className="mt-5 font-display text-2xl text-tide font-semibold">Check your email</h1>
                <p className="mt-3 text-sm text-ink/70">
                    We sent a verification link to <span className="font-medium">{email}</span>. Click the link to activate your account.
                    If you cannot see it, check your spam folder.
                </p>

                {status && <p className="mt-4 rounded-lg bg-green-50 text-green-800 text-sm px-4 py-2">{status}</p>}
                {errors.email && <p className="mt-4 rounded-lg bg-rust/10 text-rust text-sm px-4 py-2">{errors.email}</p>}

                <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => post('/email/verification-notification', { preserveScroll: true })}
                        className="rounded-full bg-tide text-paper px-6 py-2.5 text-sm font-medium hover:bg-tide-light transition-colors disabled:opacity-60"
                    >
                        {processing ? 'Sending…' : 'Resend verification email'}
                    </button>
                    <button type="button" onClick={() => router.post('/logout')} className="text-xs text-ink/50 hover:text-tide underline">
                        Log out
                    </button>
                </div>
            </div>
        </SiteLayout>
    );
}
