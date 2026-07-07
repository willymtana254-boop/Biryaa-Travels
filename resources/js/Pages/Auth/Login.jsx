import { Head, useForm, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <SiteLayout>
            <Head title="Log in" />
            <div className="max-w-sm mx-auto px-6 py-20">
                <h1 className="font-display text-2xl text-tide font-semibold mb-6">Log in</h1>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="text-sm font-medium text-ink/80">Email</label>
                        <input type="email" className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="mt-1 text-xs text-rust">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-ink/80">Password</label>
                        <input type="password" className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                    </div>
                    <button type="submit" disabled={processing} className="w-full rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                        Log in
                    </button>
                </form>
                <p className="mt-6 text-sm text-ink/60">
                    New here? <Link href="/register" className="text-rust font-medium hover:underline">Create an account</Link>
                </p>
            </div>
        </SiteLayout>
    );
}
