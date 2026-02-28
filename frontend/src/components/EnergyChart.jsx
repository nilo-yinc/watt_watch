import {
    ResponsiveContainer, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const CHART_COLORS = {
    waste: '#ef4444',
    saved: '#22c55e',
    occupancy: '#3b82f6',
};

/** Custom tooltip with glassmorphism styling. */
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass px-4 py-3 text-xs shadow-xl">
            <p className="font-medium text-surface-200 mb-1.5">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} style={{ color: entry.color }} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                    {entry.name}: <span className="font-semibold">{entry.value} Wh</span>
                </p>
            ))}
        </div>
    );
}

/**
 * Energy chart component — supports 'area' and 'bar' variants.
 * @param {{ data: object[], variant?: 'area' | 'bar', title?: string }} props
 */
export default function EnergyChart({ data, variant = 'area', title }) {
    const xKey = data?.[0]?.hour !== undefined ? 'hour' : 'day';

    return (
        <div className="glass p-5">
            {title && <h3 className="text-sm font-semibold text-surface-200 mb-4">{title}</h3>}

            <ResponsiveContainer width="100%" height={260}>
                {variant === 'area' ? (
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                        <defs>
                            <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.waste} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={CHART_COLORS.waste} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.saved} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={CHART_COLORS.saved} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#8694ab' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#8694ab' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Area type="monotone" dataKey="waste" name="Wasted" stroke={CHART_COLORS.waste} fill="url(#wasteGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="saved" name="Saved" stroke={CHART_COLORS.saved} fill="url(#savedGrad)" strokeWidth={2} />
                    </AreaChart>
                ) : (
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#8694ab' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#8694ab' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="waste" name="Wasted" fill={CHART_COLORS.waste} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="saved" name="Saved" fill={CHART_COLORS.saved} radius={[4, 4, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
