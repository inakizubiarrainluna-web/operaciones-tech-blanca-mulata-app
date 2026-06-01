'use client';
import { formatPesos } from '@/lib/ventasUtils';

interface Producto {
  nombre: string;
  total: number;
  cantidad: number;
}

interface Props {
  productos: Producto[];
}

export default function TopProductos({ productos }: Props) {
  if (productos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-bm-tierra text-sm">
        Sin ventas este mes
      </div>
    );
  }

  const maxTotal = productos[0].total;

  return (
    <div className="space-y-3">
      {productos.map((p, i) => (
        <div key={p.nombre}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-bm-habano w-4 flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-bm-chocolate truncate">
                {p.nombre}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              <span className="text-xs text-bm-tierra">{p.cantidad}u</span>
              <span className="text-sm font-semibold text-bm-chocolate w-20 text-right">
                {formatPesos(p.total)}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-bm-crudo rounded-full overflow-hidden">
            <div
              className="h-full bg-bm-habano rounded-full transition-all"
              style={{ width: `${(p.total / maxTotal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
