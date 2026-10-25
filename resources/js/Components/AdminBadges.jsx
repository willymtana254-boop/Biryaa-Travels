const statusStyles = {
    pending: 'bg-[#FCCA14]/25 text-[#7a5d00]',
    confirmed: 'bg-tide/10 text-tide',
    completed: 'bg-lagoon/15 text-lagoon',
    cancelled: 'bg-rust/10 text-rust',
};

const paymentStyles = {
    unpaid: 'bg-rust/10 text-rust',
    paid: 'bg-lagoon/15 text-lagoon',
    refunded: 'bg-ink/10 text-ink/70',
};

const base = 'inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap';

export function StatusBadge({ value }) {
    return <span className={`${base} ${statusStyles[value] || 'bg-sand'}`}>{value}</span>;
}

export function PaymentBadge({ value }) {
    return <span className={`${base} ${paymentStyles[value] || 'bg-sand'}`}>{value}</span>;
}
