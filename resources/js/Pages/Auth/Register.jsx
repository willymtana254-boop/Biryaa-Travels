import { Head, useForm, Link } from '@inertiajs/react';
import SiteLayout from '../../Layouts/SiteLayout';
import PhoneInput from '../../Components/PhoneInput';
import PasswordInput from '../../Components/PasswordInput';
import PrivacyNotice from '../../Components/PrivacyNotice';
import { phoneError } from '../../lib/phone';

const inputClass =
    'mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tide-light/40';
const labelClass = 'text-sm font-medium text-ink/80';

function Req() {
    return <span className="text-rust"> *</span>;
}

function Err({ children }) {
    return children ? <p className="mt-1 text-xs text-rust">{children}</p> : null;
}

export default function Register() {
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        name: '', email: '', phone: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        // Check everything here first so each field shows its own exact problem.
        const problems = {};
        if (data.name.trim().length < 2) problems.name = 'Please enter your full name.';
        if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) problems.email = 'Please enter a valid email address.';
        const phoneProblem = phoneError(data.phone);
        if (!data.phone || phoneProblem) problems.phone = phoneProblem || 'Please enter your phone number.';
        if (data.password.length < 8) problems.password = 'Your password must be at least 8 characters.';
        if (!data.password_confirmation) problems.password_confirmation = 'Please type your password again.';
        else if (data.password !== data.password_confirmation) problems.password_confirmation = 'The two passwords do not match.';

        const first = Object.keys(problems)[0];
        if (first) {
            Object.entries(problems).forEach(([k, v]) => setError(k, v));
            document.getElementById(first)?.focus();
            return;
        }

        post('/register', {
            onError: (errs) => {
                const f = Object.keys(errs)[0];
                if (f) document.getElementById(f)?.focus();
            },
        });
    };

    const border = (key) => (errors[key] ? 'border-rust' : 'border-ink/20 focus:border-tide');

    return (
        <SiteLayout>
            <Head title="Create an account" />
            <div className="max-w-sm mx-auto px-6 py-20">
                <h1 className="font-display text-2xl text-tide font-semibold mb-1">Create an account</h1>
                <p className="text-xs text-ink/50 mb-6">Fields marked <span className="text-rust">*</span> are required.</p>

                <form onSubmit={submit} className="space-y-5" noValidate>
                    <div>
                        <label htmlFor="name" className={labelClass}>Full name<Req /></label>
                        <input id="name" autoComplete="name" className={`${inputClass} ${border('name')}`} value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <Err>{errors.name}</Err>
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>Email<Req /></label>
                        <input id="email" type="email" autoComplete="email" className={`${inputClass} ${border('email')}`} value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        {errors.email ? <Err>{errors.email}</Err> : <p className="mt-1 text-xs text-ink/45">We will email you a link to verify this address.</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className={labelClass}>Phone (WhatsApp)<Req /></label>
                        <div className="mt-1.5">
                            <PhoneInput id="phone" value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>Password<Req /></label>
                        <PasswordInput id="password" name="password" value={data.password} onChange={(v) => setData('password', v)} hasError={!!errors.password} required />
                        {errors.password ? <Err>{errors.password}</Err> : <p className="mt-1 text-xs text-ink/45">At least 8 characters.</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className={labelClass}>Confirm password<Req /></label>
                        <PasswordInput id="password_confirmation" name="password_confirmation" value={data.password_confirmation} onChange={(v) => setData('password_confirmation', v)} hasError={!!errors.password_confirmation} required />
                        <Err>{errors.password_confirmation}</Err>
                    </div>

                    <PrivacyNotice />

                    <button type="submit" disabled={processing} className="w-full rounded-full bg-tide text-paper px-6 py-3 font-medium hover:bg-tide-light transition-colors disabled:opacity-60">
                        {processing ? 'Creating…' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-ink/60">
                    Already have an account? <Link href="/login" className="text-rust font-medium hover:underline">Log in</Link>
                </p>
            </div>
        </SiteLayout>
    );
}
