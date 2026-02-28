import { useRef, useState } from "react";
import { cn } from "../../lib/utils";

export function GlareCard({ children, className }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouse = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl transition-all duration-300 hover:shadow-purple-500/10 hover:border-white/20",
                className
            )}
        >
            {/* Glare effect */}
            <div
                className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.15), transparent 60%)`,
                }}
            />
            {/* Border glow */}
            <div
                className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.3), transparent 50%)`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
