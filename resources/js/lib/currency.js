import { useSyncExternalStore } from 'react';
import { usePage } from '@inertiajs/react';

const KEY = 'biryaa_currency';
const listeners = new Set();
let memory = null;

const subscribe = (cb) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
};

const read = () => {
    if (memory) return memory;
    try {
        return window.localStorage.getItem(KEY) === 'USD' ? 'USD' : 'KES';
    } catch {
        return 'KES';
    }
};

export const setCurrency = (c) => {
    memory = c;
    try {
        window.localStorage.setItem(KEY, c);
    } catch {
        /* private mode: keep it in memory */
    }
    listeners.forEach((l) => l());
};

export function useMoney() {
    const { props } = usePage();
    const rate = Number(props.currency?.kes_per_usd) || 129;
    const currency = useSyncExternalStore(subscribe, read, () => 'KES');

    const fmt = (usd) => {
        const n = Number(usd) || 0;
        const sign = n < 0 ? '−' : '';
        const abs = Math.abs(n);
        return currency === 'USD'
            ? `${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
            : `${sign}KES ${Math.round(abs * rate).toLocaleString('en-US')}`;
    };

    return { currency, rate, fmt, setCurrency };
}

export function Money({ amount, usd }) {
    const { fmt } = useMoney();
    return fmt(amount ?? usd);
}