// Admin screens always show Kenya shillings, whatever the public currency toggle says.
export function kes(amount) {
    return `KES ${Math.round(Number(amount) || 0).toLocaleString()}`;
}

// 0728 769 798, 254728769798 or +254 728 769 798  ->  254728769798 (for wa.me links)
export function waNumber(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) return `254${digits.slice(1)}`;
    return digits;
}
