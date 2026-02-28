/**
 * Color-coded status badge.
 *   Green  → Secure / Occupied
 *   Red    → Waste Detected
 *   Yellow → Recently Vacated / Monitoring
 */
export default function StatusBadge({ status }) {
    const config = {
        secure: { label: 'Secure', dot: 'status-dot-secure', bg: 'bg-secure/10 text-secure border-secure/20' },
        occupied: { label: 'Occupied', dot: 'status-dot-secure', bg: 'bg-secure/10 text-secure border-secure/20' },
        waste: { label: 'Waste Detected', dot: 'status-dot-waste', bg: 'bg-waste/10 text-waste border-waste/20' },
        recently_vacated: { label: 'Monitoring', dot: 'status-dot-caution', bg: 'bg-caution/10 text-caution border-caution/20' },
        empty: { label: 'Empty', dot: 'status-dot-secure', bg: 'bg-surface-700/30 text-surface-400 border-surface-600/20' },
    };

    const c = config[status] || config.empty;

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${c.bg}`}>
            <span className={`status-dot ${c.dot}`} />
            {c.label}
        </span>
    );
}
