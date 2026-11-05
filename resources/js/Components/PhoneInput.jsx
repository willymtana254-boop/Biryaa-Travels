import { useState } from 'react';
import { PHONE_HINT, phoneError, sanitizePhone } from '../lib/phone';

const base =
    'w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tide-light/40';

/**
 * Drop-in phone field. Stops bad characters, limits the length
 * (10 digits for Kenya, up to 15 with a + country code) and checks on leaving the field.
 *
 *   <PhoneInput value={data.phone} onChange={(v) => setData('phone', v)} error={errors.phone} />
 */
export default function PhoneInput({ value, onChange, error, className = '', required = false, name = 'phone', id }) {
    const [touched, setTouched] = useState(false);
    const problem = touched ? phoneError(value) : '';
    const message = error || problem;

    return (
        <div>
            <input
                id={id}
                name={name}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required={required}
                placeholder="0712 345 678 or +44 7700 900123"
                value={value || ''}
                onChange={(e) => onChange(sanitizePhone(e.target.value))}
                onBlur={() => setTouched(true)}
                className={`${base} ${message ? 'border-rust' : 'border-ink/20 focus:border-tide'} ${className}`}
            />
            {message ? (
                <p className="mt-1 text-xs text-rust">{message}</p>
            ) : (
                <p className="mt-1 text-xs text-ink/45">{PHONE_HINT}</p>
            )}
        </div>
    );
}
