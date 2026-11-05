import { Link } from '@inertiajs/react';

/**
 * Short notice to show wherever we ask for a phone number or email.
 * Use <PrivacyNotice /> under contact fields on any form.
 */
export default function PrivacyNotice({ className = '' }) {
    return (
        <p className={`text-xs leading-relaxed text-ink/55 ${className}`}>
            <span className="font-medium text-ink/70">Your privacy:</span> we collect your name, phone number and email only to answer
            your enquiry or manage your booking, and to contact you about it. We do not sell your details. See our{' '}
            <Link href="/privacy" className="text-tide underline hover:text-tide-light">
                Privacy Policy
            </Link>{' '}
            to learn how we keep your data and how to ask us to see or delete it.
        </p>
    );
}
