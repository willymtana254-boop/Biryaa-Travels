// Mirrors App\Support\PhoneNumber on the server.
export const PHONE_HINT =
    'Kenya: 10 digits, e.g. 0712 345 678. Other countries: start with + and the country code (up to 15 digits).';

// Keep only digits and a leading +, and stop typing once the limit is reached.
export function sanitizePhone(value) {
    let v = String(value || '').replace(/[^\d+]/g, '');
    v = v.replace(/(?!^)\+/g, ''); // a + is only allowed at the start

    const hasPlus = v.startsWith('+');
    let digits = v.replace(/\D/g, '');

    let max = 10; // Kenyan number typed as 07xx / 01xx
    if (hasPlus) max = 15;
    else if (digits.startsWith('00')) max = 17;
    else if (digits.startsWith('254')) max = 12;

    digits = digits.slice(0, max);
    return (hasPlus ? '+' : '') + digits;
}

// Returns an error message, or '' when the number is fine.
export function phoneError(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';

    let hasPlus = raw.startsWith('+');
    let digits = raw.replace(/\D/g, '');

    if (!hasPlus && digits.startsWith('00')) {
        hasPlus = true;
        digits = digits.slice(2);
    }

    let ok;
    if (hasPlus) {
        ok = digits.startsWith('254') ? /^254[17]\d{8}$/.test(digits) : /^[1-9]\d{7,14}$/.test(digits);
    } else {
        ok = /^0[17]\d{8}$/.test(digits) || /^254[17]\d{8}$/.test(digits);
    }

    return ok ? '' : 'Enter a Kenyan number with 10 digits (e.g. 0712 345 678), or start with + and the country code (up to 15 digits).';
}
