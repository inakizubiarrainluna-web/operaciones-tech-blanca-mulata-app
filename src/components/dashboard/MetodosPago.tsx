'use client';
import { formatPesos } from '@/lib/ventasUtils';

interface Metodo {
  metodo: string;
  monto: number;
  cantidad: number;
  porcentaje: number;
}

interface Props {
  metodos: Metodo[];
}

const COLORES: Record<string, string> = {
  Efectivo: '#6B4C3B',
  Transferencia: '#C4A882',
  Tarjeta: '#8B6F5E',
  MercadoPago: '#A08070',
};

export default function MetodosPago({ metodos }: Props) {
  if (metodos.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-bm-tierra text-sm">
        Sin ventas este mes
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra apilada */}
      <div className="flex rounded-full overflow-hidden h-3">
        {metodos.map(m => (
          <div
            key={m.metodo}
            style={{
              width: `${m.porcentaje}%`,
              backgroundColor: COLORES[m.metodo] ?? '#C4A882',
            }}
            title={`${m.metodo}: ${m.porcentaje}%`}
          />
        ))}
      </div>

      {/* Detalle */}
      <div className="space-y-2.5">
        {metodos.map(m => (
          <div key={m.metodo} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORES[m.metodo] ?? '#C4A882' }}
              />
              <span className="text-sm text-bm-chocolate">{m.metodo}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-bm-tierra">{m.cantidad}u</span>
              <span className="text-sm font-semibold text-bm-chocolate w-20 text-right">
                {formatPesos(m.monto)}
              </span>
              <span className="text-xs text-bm-tierra w-8 text-right">{m.porcentaje}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
