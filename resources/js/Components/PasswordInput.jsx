import { useState } from 'react';

const Eye = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOff = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.8 19.8 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 4c7 0 11 7 11 7a19.9 19.9 0 0 1-3.17 4.19M14.12 14.12A3 3 0 1 1 9.88 9.88" />
        <path d="M1 1l22 22" />
    </svg>
);

/** Password field with a show / hide eye button. */
export default function PasswordInput({ value, onChange, id, name, autoComplete = 'new-password', required, placeholder, hasError }) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative mt-1.5">
            <input
                id={id}
                name={name}
                type={show ? 'text' : 'password'}
                autoComplete={autoComplete}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-lg border bg-white pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tide-light/40 ${hasError ? 'border-rust' : 'border-ink/20 focus:border-tide'}`}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                title={show ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 px-3 text-ink/50 hover:text-tide"
            >
                {show ? EyeOff : Eye}
            </button>
        </div>
    );
}
