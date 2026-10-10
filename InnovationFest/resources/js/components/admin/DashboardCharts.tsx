import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    LabelList,
    Legend,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export const CHART_COLORS = {
    blue: '#0078D9',
    yellow: '#F7B600',
    orange: '#F15E00',
    red: '#FA0A00',
    green: '#229D1C',
};

export type Datum = { name: string; total: number };

export type Series = { key: string; name: string; color: string };

const numberFormat = new Intl.NumberFormat('en-PH');

const AXIS_TICK = { fill: 'rgb(255 255 255 / 0.6)', fontSize: 12 };

const GRID_STROKE = 'rgb(255 255 255 / 0.08)';

const TOOLTIP_PROPS = {
    contentStyle: {
        backgroundColor: '#0a0a0a',
        border: '1px solid rgb(255 255 255 / 0.1)',
        borderRadius: 12,
        fontSize: 13,
    },
    labelStyle: { color: '#fff', fontWeight: 700, marginBottom: 4 },
    itemStyle: { color: '#fff' },
    cursor: { fill: 'rgb(255 255 255 / 0.05)' },
    separator: ': ',
    formatter: (value: unknown) => numberFormat.format(Number(value)),
};

const LEGEND_PROPS = {
    iconType: 'circle' as const,
    iconSize: 10,
    wrapperStyle: { fontSize: 12, paddingTop: 12 },
    formatter: (value: string) => (
        <span style={{ color: 'rgb(255 255 255 / 0.7)' }}>{value}</span>
    ),
};

function truncate(value: string, length = 18) {
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function EmptyChart({ text = 'No data yet.' }: { text?: string }) {
    return <p className="py-6 text-sm text-white/50">{text}</p>;
}

/** Recharts measures the DOM, so charts only render after mount to keep SSR markup in sync. */
function ChartFrame({
    height,
    children,
}: {
    height: number;
    children: ReactElement;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full" style={{ height }}>
            {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            )}
        </div>
    );
}

export function TrendChart({
    data,
}: {
    data: { label: string; total: number; cumulative: number }[];
}) {
    return (
        <ChartFrame height={300}>
            <ComposedChart
                data={data}
                margin={{ top: 10, right: 0, bottom: 0, left: -10 }}
            >
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                    dataKey="label"
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={16}
                />
                <YAxis
                    yAxisId="daily"
                    allowDecimals={false}
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                />
                <YAxis
                    yAxisId="cumulative"
                    orientation="right"
                    allowDecimals={false}
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                />
                <Tooltip {...TOOLTIP_PROPS} />
                <Legend {...LEGEND_PROPS} />
                <Bar
                    yAxisId="daily"
                    dataKey="total"
                    name="New registrations"
                    fill={CHART_COLORS.blue}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                />
                <Line
                    yAxisId="cumulative"
                    type="monotone"
                    dataKey="cumulative"
                    name="Running total"
                    stroke={CHART_COLORS.yellow}
                    strokeWidth={2}
                    dot={false}
                />
            </ComposedChart>
        </ChartFrame>
    );
}

export function DonutChart({
    data,
}: {
    data: (Datum & { color: string })[];
}) {
    const total = data.reduce((sum, item) => sum + item.total, 0);

    if (total === 0) {
        return <EmptyChart />;
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="relative">
                <ChartFrame height={200}>
                    <PieChart>
                        <Tooltip {...TOOLTIP_PROPS} cursor={false} />
                        <Pie
                            data={data}
                            dataKey="total"
                            nameKey="name"
                            innerRadius="62%"
                            outerRadius="92%"
                            paddingAngle={2}
                            stroke="none"
                        >
                            {data.map((item) => (
                                <Cell key={item.name} fill={item.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartFrame>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black tabular-nums">
                        {numberFormat.format(total)}
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                        Total
                    </span>
                </div>
            </div>

            <ul className="flex flex-col gap-2">
                {data.map((item) => (
                    <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 text-sm"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <span
                                aria-hidden
                                className="size-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate text-white/80">
                                {item.name}
                            </span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                            <span className="font-bold">
                                {numberFormat.format(item.total)}
                            </span>
                            <span className="ml-2 text-xs text-white/50">
                                {Math.round((item.total / total) * 100)}%
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function HorizontalBarChart({
    data,
    color,
    emptyText,
    valueName = 'Participants',
}: {
    data: Datum[];
    color: string;
    emptyText?: string;
    valueName?: string;
}) {
    if (data.length === 0) {
        return <EmptyChart text={emptyText} />;
    }

    return (
        <ChartFrame height={data.length * 40 + 8}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 36, bottom: 0, left: 0 }}
            >
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value: string) => truncate(value)}
                />
                <Tooltip {...TOOLTIP_PROPS} />
                <Bar
                    dataKey="total"
                    name={valueName}
                    fill={color}
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                >
                    <LabelList
                        dataKey="total"
                        position="right"
                        fill="#fff"
                        fontSize={12}
                    />
                </Bar>
            </BarChart>
        </ChartFrame>
    );
}

export function StackedBarChart({
    data,
    series,
    horizontal = false,
}: {
    data: object[];
    series: Series[];
    horizontal?: boolean;
}) {
    const lastRadius: [number, number, number, number] = horizontal
        ? [0, 6, 6, 0]
        : [6, 6, 0, 0];

    return (
        <ChartFrame height={horizontal ? data.length * 44 + 48 : 300}>
            <BarChart
                data={data}
                layout={horizontal ? 'vertical' : 'horizontal'}
                margin={{ top: 10, right: 8, bottom: 0, left: horizontal ? 0 : -10 }}
            >
                <CartesianGrid
                    stroke={GRID_STROKE}
                    horizontal={!horizontal}
                    vertical={horizontal}
                />
                {horizontal ? (
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={AXIS_TICK}
                        axisLine={false}
                        tickLine={false}
                    />
                ) : (
                    <XAxis
                        dataKey="name"
                        tick={AXIS_TICK}
                        axisLine={false}
                        tickLine={false}
                    />
                )}
                {horizontal ? (
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={AXIS_TICK}
                        axisLine={false}
                        tickLine={false}
                    />
                ) : (
                    <YAxis
                        allowDecimals={false}
                        tick={AXIS_TICK}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                    />
                )}
                <Tooltip {...TOOLTIP_PROPS} />
                <Legend {...LEGEND_PROPS} />
                {series.map((item, index) => (
                    <Bar
                        key={item.key}
                        stackId="stack"
                        dataKey={item.key}
                        name={item.name}
                        fill={item.color}
                        radius={index === series.length - 1 ? lastRadius : 0}
                        maxBarSize={horizontal ? 24 : 48}
                    />
                ))}
            </BarChart>
        </ChartFrame>
    );
}
