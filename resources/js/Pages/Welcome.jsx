import { useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

const GUEST_KEY = 'biryaa_guest';

export default function Welcome() {
    const { props } = usePage();
    const loggedIn = !!props.auth?.user;

    // Logged-in visitors, and guests who already chose "Continue as guest", skip this screen.
    useEffect(() => {
        let skip = loggedIn;
        try {
            if (localStorage.getItem(GUEST_KEY) === '1') skip = true;
        } catch (e) {
            /* storage blocked: just show the welcome screen */
        }
        if (skip) router.visit('/home', { replace: true });
    }, []);

    const rememberGuest = () => {
        try {
            localStorage.setItem(GUEST_KEY, '1');
        } catch (e) {
            /* ignore */
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen flex items-center overflow-hidden bg-ink">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/videos/welcome-bg.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />

                <div className="relative max-w-6xl mx-auto px-6 w-full">
                    <div className="max-w-md">
                       <img
                           src="/images/biryaa-logo-white.png"
                            alt="Biryaa Travels"
                            className="h-40 md:h-56 w-auto drop-shadow-2xl"
                        />
                        <p className="text-rust font-medium text-sm tracking-wide uppercase mb-4">Kenyan Coast, one booking at a time</p>
                        <h1 className="font-display text-4xl md:text-5xl text-paper font-semibold leading-[1.1]">
                            Travel that knows this coast.
                        </h1>
                        <p className="mt-5 text-paper/75 leading-relaxed">
                            Sign in to track your bookings, create an account to save your details for next time,
                            or continue as a guest and book in minutes.
                        </p>

                        <div className="mt-10 flex flex-col gap-3">
                            <Link
                                href="/login"
                                className="rounded-full bg-tide text-paper px-6 py-3 font-medium text-center hover:bg-tide-light transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-full border border-paper/40 text-paper px-6 py-3 font-medium text-center hover:border-paper hover:bg-paper/10 transition-colors"
                            >
                                Create an account
                            </Link>
                            <Link
                                href="/home"
                                onClick={rememberGuest}
                                className="mt-2 text-paper/70 text-sm font-medium text-center hover:text-paper transition-colors"
                            >
                                Continue as guest →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}