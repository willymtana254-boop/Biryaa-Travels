import { Head, useForm, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import PasswordInput from '../../Components/PasswordInput';

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
                        <label htmlFor="email" className="text-sm font-medium text-ink/80">Email</label>
                        <input id="email" type="email" autoComplete="email" className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="mt-1 text-xs text-rust">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-ink/80">Password</label>
                        <PasswordInput id="password" name="password" autoComplete="current-password" value={data.password} onChange={(v) => setData('password', v)} hasError={!!errors.password} required />
                        {errors.password && <p className="mt-1 text-xs text-rust">{errors.password}</p>}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-ink/70">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                        Remember me
                    </label>
                    <button type="submit" disabled={processing} className="w-full rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                        {processing ? 'Logging in…' : 'Log in'}
                    </button>
                </form>
                <p className="mt-6 text-sm text-ink/60">
                    New here? <Link href="/register" className="text-rust font-medium hover:underline">Create an account</Link>
                </p>
            </div>
        </SiteLayout>
    );
}