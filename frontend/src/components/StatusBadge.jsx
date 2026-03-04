export default function StatusBadge({ status }) {
    const config = {
        secure: { label: 'Secure', dotClass: 'status-dot-secure', className: 'badge badge-green' },
        occupied: { label: 'Occupied', dotClass: 'status-dot-secure', className: 'badge badge-green' },
        waste: { label: 'Energy Waste', dotClass: 'status-dot-waste', className: 'badge badge-red' },
        recently_vacated: { label: 'Monitoring', dotClass: 'status-dot-caution', className: 'badge badge-amber' },
        empty: { label: 'Empty', dotClass: 'status-dot-secure', className: 'badge badge-muted' },
    };

    const c = config[status] || config.empty;

    return (
        <span className={c.className}>
            <span className={`status-dot ${c.dotClass}`} />
            {c.label}
        </span>
    );
}
