'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatPesos } from '@/lib/ventasUtils';

interface Props {
  data: { label: string; total: number }[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bm-blanco border border-bm-habano/30 rounded-xl px-3 py-2 shadow-sm">
      <p className="text-xs text-bm-tierra mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-bm-chocolate">{formatPesos(payload[0].value)}</p>
    </div>
  );
}

export default function VentasChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.total), 1);
  const yFormatter = (v: number) =>
    v === 0 ? '' : max >= 10000 ? `$${(v / 1000).toFixed(0)}k` : formatPesos(v);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8DDD0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#8B6F5E' }}
          interval={4}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#8B6F5E' }}
          tickFormatter={yFormatter}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F0E8' }} />
        <Bar dataKey="total" fill="#C4A882" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
