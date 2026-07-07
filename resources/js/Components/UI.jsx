export function PageHeader({ eyebrow, title, description }) {
    return (
        <div className="max-w-3xl">
            {eyebrow && <p className="text-rust font-medium text-sm tracking-wide uppercase mb-3">{eyebrow}</p>}
            <h1 className="font-display text-4xl md:text-5xl text-tide font-semibold leading-tight">{title}</h1>
            {description && <p className="mt-4 text-ink/70 text-lg leading-relaxed">{description}</p>}
        </div>
    );
}

export function FilterPill({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                active
                    ? 'bg-tide text-paper border-tide'
                    : 'bg-transparent text-ink/70 border-ink/20 hover:border-tide hover:text-tide'
            }`}
        >
            {children}
        </button>
    );
}

export function EmptyState({ title, description }) {
    return (
        <div className="text-center py-20 border border-dashed border-ink/15 rounded-2xl">
            <p className="font-display text-xl text-tide mb-2">{title}</p>
            {description && <p className="text-ink/60 text-sm">{description}</p>}
        </div>
    );
}
