'use client';
import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useProductos } from '@/hooks/useProductos';
import { Producto, MetodoPago, Canal, Venta } from '@/types';

interface FormState {
  productoId: string;
  color: string;
  talle: string;
  metodoPago: MetodoPago | '';
  canal: Canal | '';
  cliente: string;
}

const initialForm: FormState = {
  productoId: '',
  color: '',
  talle: '',
  metodoPago: '',
  canal: '',
  cliente: '',
};

function toArray(val: string[] | Record<string, string> | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.values(val);
}

export default function VentaForm() {
  const { usuario } = useAuth();
  const { productos, loading } = useProductos();
  const [form, setForm] = useState<FormState>(initialForm);
  const [productoSel, setProductoSel] = useState<Producto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleProductoChange = (productoId: string) => {
    const p = productos.find((p) => p.id === productoId) ?? null;
    setProductoSel(p);
    setForm((prev) => ({ ...prev, productoId, color: '', talle: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoSel || !form.color || !form.talle || !form.metodoPago || !form.canal) {
      setError('Completá todos los campos obligatorios.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const venta: Omit<Venta, 'id'> = {
        productoId: productoSel.id,
        productoNombre: productoSel.nombre,
        color: form.color,
        talle: form.talle,
        precio: productoSel.precio,
        metodoPago: form.metodoPago as MetodoPago,
        canal: form.canal as Canal,
        cliente: form.cliente.trim(),
        fecha: new Date().toISOString(),
        creadoPor: usuario?.uid ?? '',
      };
      await push(ref(db, 'ventas'), venta);
      setSuccess(true);
      setForm(initialForm);
      setProductoSel(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError('Error al registrar la venta. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const colores = toArray(productoSel?.colores);
  const talles = toArray(productoSel?.talles);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-center font-semibold text-sm">
          Venta registrada con exito
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      {/* Producto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Producto <span className="text-rose-500">*</span>
        </label>
        <select
          value={form.productoId}
          onChange={(e) => handleProductoChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none"
        >
          <option value="">Selecciona un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        {productos.length === 0 && (
          <p className="text-xs text-gray-400 mt-1">No hay productos activos cargados.</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Color <span className="text-rose-500">*</span>
        </label>
        <select
          value={form.color}
          onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
          disabled={!productoSel || colores.length === 0}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
        >
          <option value="">Selecciona un color</option>
          {colores.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Talle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Talle <span className="text-rose-500">*</span>
        </label>
        <select
          value={form.talle}
          onChange={(e) => setForm((prev) => ({ ...prev, talle: e.target.value }))}
          disabled={!productoSel || talles.length === 0}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 appearance-none"
        >
          <option value="">Selecciona un talle</option>
          {talles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Precio (solo lectura) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio</label>
        <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-gray-900">
          {productoSel ? (
            <span className="font-semibold text-lg">
              ${productoSel.precio.toLocaleString('es-AR')}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">Se carga automaticamente al elegir producto</span>
          )}
        </div>
      </div>

      {/* Metodo de pago */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Metodo de pago <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['Efectivo', 'Transferencia', 'Tarjeta', 'MercadoPago'] as MetodoPago[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, metodoPago: m }))}
              className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                form.metodoPago === m
                  ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Canal */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Canal <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['Local', 'Web', 'Feria', 'Otro'] as Canal[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, canal: c }))}
              className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all ${
                form.canal === c
                  ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Cliente */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Cliente{' '}
          <span className="text-gray-400 text-xs font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={form.cliente}
          onChange={(e) => setForm((prev) => ({ ...prev, cliente: e.target.value }))}
          placeholder="Nombre del cliente"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder:text-gray-300"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 text-white font-semibold py-4 rounded-xl transition-colors text-base shadow-sm mt-2"
      >
        {submitting ? 'Registrando...' : 'Registrar venta'}
      </button>
    </form>
  );
}
