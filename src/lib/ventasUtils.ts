import { Venta, MetodoPago } from '@/types';

export const formatPesos = (n: number) =>
  '$' + Math.round(n).toLocaleString('es-AR');

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function startOfWeek(d: Date) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // lunes
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function calcKPIs(ventas: Venta[]) {
  const now = new Date();
  const hoy = ventas.filter(v => new Date(v.fecha) >= startOfDay(now));
  const semana = ventas.filter(v => new Date(v.fecha) >= startOfWeek(now));
  const mes = ventas.filter(v => new Date(v.fecha) >= startOfMonth(now));

  const sum = (arr: Venta[]) => arr.reduce((s, v) => s + v.precio, 0);

  return {
    hoy: { total: sum(hoy), cantidad: hoy.length },
    semana: { total: sum(semana), cantidad: semana.length },
    mes: {
      total: sum(mes),
      cantidad: mes.length,
      ticket: mes.length > 0 ? sum(mes) / mes.length : 0,
    },
  };
}

export function calcChartData(ventas: Venta[]) {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const total = ventas
      .filter(v => v.fecha.startsWith(key))
      .reduce((s, v) => s + v.precio, 0);
    return { label, total };
  });
}

export function calcTopProductos(ventas: Venta[]) {
  const map = new Map<string, { nombre: string; total: number; cantidad: number }>();
  ventas.forEach(v => {
    const prev = map.get(v.productoNombre) ?? { nombre: v.productoNombre, total: 0, cantidad: 0 };
    map.set(v.productoNombre, {
      nombre: v.productoNombre,
      total: prev.total + v.precio,
      cantidad: prev.cantidad + 1,
    });
  });
  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

export function calcMetodosPago(ventas: Venta[]) {
  const metodos: MetodoPago[] = ['Efectivo', 'Transferencia', 'Tarjeta', 'MercadoPago'];
  const totalGeneral = ventas.reduce((s, v) => s + v.precio, 0);
  return metodos
    .map(m => {
      const sub = ventas.filter(v => v.metodoPago === m);
      const monto = sub.reduce((s, v) => s + v.precio, 0);
      return {
        metodo: m,
        monto,
        cantidad: sub.length,
        porcentaje: totalGeneral > 0 ? Math.round((monto / totalGeneral) * 100) : 0,
      };
    })
    .filter(m => m.cantidad > 0)
    .sort((a, b) => b.monto - a.monto);
}
