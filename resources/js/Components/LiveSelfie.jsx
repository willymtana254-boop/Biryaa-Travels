import { useEffect, useRef, useState } from 'react';

/**
 * Live camera selfie. There is deliberately no "choose from gallery" option,
 * so the hirer has to be in front of the camera right now.
 * onCapture receives a JPEG data URL.
 */
export default function LiveSelfie({ onCapture, disabled }) {
    const video = useRef(null);
    const stream = useRef(null);
    const [on, setOn] = useState(false);
    const [error, setError] = useState('');

    const stop = () => {
        stream.current?.getTracks().forEach((t) => t.stop());
        stream.current = null;
        setOn(false);
    };

    useEffect(() => stop, []);

    const start = async () => {
        setError('');
        if (!navigator.mediaDevices?.getUserMedia) {
            setError('Your browser cannot open the camera here. Please open this page in Chrome or Safari over https.');
            return;
        }
        try {
            stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: false });
            setOn(true);
            requestAnimationFrame(() => {
                if (video.current) {
                    video.current.srcObject = stream.current;
                    video.current.play();
                }
            });
        } catch {
            setError('We could not open the camera. Please allow camera access in your browser and try again.');
        }
    };

    const snap = () => {
        const v = video.current;
        if (!v || !v.videoWidth) return;
        const scale = Math.min(1, 1000 / Math.max(v.videoWidth, v.videoHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(v.videoWidth * scale);
        canvas.height = Math.round(v.videoHeight * scale);
        canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL('image/jpeg', 0.85));
        stop();
    };

    return (
        <div>
            {on ? (
                <div className="space-y-3">
                    <video ref={video} playsInline muted className="w-full max-w-sm rounded-xl bg-ink [transform:scaleX(-1)]" />
                    <div className="flex gap-3">
                        <button type="button" onClick={snap} className="rounded-full bg-tide text-white px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors">Take selfie</button>
                        <button type="button" onClick={stop} className="rounded-full border border-ink/20 px-5 py-2 text-sm">Cancel</button>
                    </div>
                </div>
            ) : (
                <button type="button" disabled={disabled} onClick={start} className="rounded-full bg-tide text-white px-5 py-2 text-sm font-medium hover:bg-tide-light transition-colors disabled:opacity-50">
                    Open camera
                </button>
            )}
            {error && <p className="mt-2 text-xs text-rust">{error}</p>}
        </div>
    );
}
