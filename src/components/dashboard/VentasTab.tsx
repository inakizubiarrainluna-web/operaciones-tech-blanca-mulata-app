'use client';
import { useMemo } from 'react';
import { Venta } from '@/types';
import {
  calcKPIs,
  calcChartData,
  calcTopProductos,
  calcMetodosPago,
  formatPesos,
} from '@/lib/ventasUtils';
import KPICard from './KPICard';
import VentasChart from './VentasChart';
import TopProductos from './TopProductos';
import MetodosPago from './MetodosPago';

interface Props {
  ventas: Venta[];
}

export default function VentasTab({ ventas }: Props) {
  const kpis = useMemo(() => calcKPIs(ventas), [ventas]);
  const chartData = useMemo(() => calcChartData(ventas), [ventas]);

  const ventasMes = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return ventas.filter(v => new Date(v.fecha) >= start);
  }, [ventas]);

  const topProductos = useMemo(() => calcTopProductos(ventasMes), [ventasMes]);
  const metodosPago = useMemo(() => calcMetodosPago(ventasMes), [ventasMes]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          periodo="Hoy"
          total={kpis.hoy.total}
          cantidad={kpis.hoy.cantidad}
        />
        <KPICard
          periodo="Esta semana"
          total={kpis.semana.total}
          cantidad={kpis.semana.cantidad}
        />
        <KPICard
          periodo="Este mes"
          total={kpis.mes.total}
          cantidad={kpis.mes.cantidad}
          highlight
        />
        <div className="bg-bm-blanco rounded-2xl border border-bm-habano/20 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-bm-tierra">
            Ticket promedio
          </p>
          <div className="mt-3">
            <p className="text-3xl font-bold text-bm-chocolate">
              {formatPesos(kpis.mes.ticket)}
            </p>
            <p className="text-sm text-bm-tierra mt-1">este mes</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-bm-blanco rounded-2xl border border-bm-habano/20 p-5">
        <h3 className="text-sm font-semibold text-bm-chocolate mb-4">
          Ventas por dia — ultimos 30 dias
        </h3>
        <VentasChart data={chartData} />
      </div>

      {/* Top productos + Métodos de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-bm-blanco rounded-2xl border border-bm-habano/20 p-5">
          <h3 className="text-sm font-semibold text-bm-chocolate mb-4">
            Top 5 productos — este mes
          </h3>
          <TopProductos productos={topProductos} />
        </div>
        <div className="bg-bm-blanco rounded-2xl border border-bm-habano/20 p-5">
          <h3 className="text-sm font-semibold text-bm-chocolate mb-4">
            Metodos de pago — este mes
          </h3>
          <MetodosPago metodos={metodosPago} />
        </div>
      </div>
    </div>
  );
}
