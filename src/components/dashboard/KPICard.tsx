'use client';
import { formatPesos } from '@/lib/ventasUtils';

interface Props {
  periodo: string;
  total: number;
  cantidad: number;
  highlight?: boolean;
  extra?: React.ReactNode;
}

export default function KPICard({ periodo, total, cantidad, highlight, extra }: Props) {
  if (highlight) {
    return (
      <div className="bg-bm-chocolate rounded-2xl p-5 flex flex-col justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-bm-habano">
          {periodo}
        </p>
        <div className="mt-3">
          <p className="text-3xl font-bold text-bm-blanco">{formatPesos(total)}</p>
          <p className="text-sm text-bm-habano mt-1">
            {cantidad} {cantidad === 1 ? 'venta' : 'ventas'}
          </p>
          {extra}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bm-blanco rounded-2xl border border-bm-habano/20 p-5 flex flex-col justify-between">
      <p className="text-xs font-semibold uppercase tracking-wider text-bm-tierra">
        {periodo}
      </p>
      <div className="mt-3">
        <p className="text-3xl font-bold text-bm-chocolate">{formatPesos(total)}</p>
        <p className="text-sm text-bm-tierra mt-1">
          {cantidad} {cantidad === 1 ? 'venta' : 'ventas'}
        </p>
        {extra}
      </div>
    </div>
  );
}
