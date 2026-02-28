/**
 * Color-coded status badge.
 *   Green  → Secure / Occupied
 *   Red    → Waste Detected
 *   Yellow → Recently Vacated / Monitoring
 */
export default function StatusBadge({ status }) {
    const config = {
        secure: { label: 'Secure', dot: 'status-dot-secure', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
        occupied: { label: 'Occupied', dot: 'status-dot-secure', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
        waste: { label: 'Waste Detected', dot: 'status-dot-waste', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
        recently_vacated: { label: 'Monitoring', dot: 'status-dot-caution', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
        empty: { label: 'Empty', dot: 'status-dot-secure', bg: 'bg-[var(--ww-card-2)] text-[var(--ww-text-3)] border-[var(--ww-border)]' },
    };

    const c = config[status] || config.empty;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${c.bg}`}>
            <span className={`status-dot ${c.dot}`} />
            {c.label}
        </span>
    );
}
