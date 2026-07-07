const STOPS = ['Kilifi', 'Mombasa', 'Diani', 'Watamu', 'Malindi', 'Vipingo'];

export default function CoastRoute({ className = '' }) {
    const w = 640;
    const h = 120;
    const y = h / 2;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Route connecting Kilifi, Mombasa, Diani, Watamu, Malindi and Vipingo">
            <path
                d={`M 20 ${y} Q ${w / 2} ${y - 40}, ${w - 20} ${y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="1 10"
                strokeLinecap="round"
                opacity="0.5"
            />
            {STOPS.map((stop, i) => {
                const t = i / (STOPS.length - 1);
                const x = 20 + t * (w - 40);
                const curveY = y - 40 * Math.sin(Math.PI * t);
                return (
                    <g key={stop} transform={`translate(${x}, ${curveY})`}>
                        <circle r="5" fill="currentColor" />
                        <text y="24" textAnchor="middle" className="text-[11px] fill-current font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {stop}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}