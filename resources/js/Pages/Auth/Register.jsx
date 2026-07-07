import { Head, useForm, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <SiteLayout>
            <Head title="Create an account" />
            <div className="max-w-sm mx-auto px-6 py-20">
                <h1 className="font-display text-2xl text-tide font-semibold mb-6">Create an account</h1>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="text-sm font-medium text-ink/80">Full name</label>
                        <input className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name && <p className="mt-1 text-xs text-rust">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-ink/80">Email</label>
                        <input type="email" className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email && <p className="mt-1 text-xs text-rust">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-ink/80">Phone</label>
                        <input className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-ink/80">Password</label>
                        <input type="password" className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        {errors.password && <p className="mt-1 text-xs text-rust">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-ink/80">Confirm password</label>
                        <input type="password" className="mt-1.5 w-full rounded-lg border border-ink/20 px-4 py-2.5 text-sm" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                    </div>
                    <button type="submit" disabled={processing} className="w-full rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                        Create account
                    </button>
                </form>
                <p className="mt-6 text-sm text-ink/60">
                    Already have an account? <Link href="/login" className="text-rust font-medium hover:underline">Log in</Link>
                </p>
            </div>
        </SiteLayout>
    );
}
