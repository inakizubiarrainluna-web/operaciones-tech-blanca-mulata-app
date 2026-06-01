export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  colores: string[] | Record<string, string>;
  talles: string[] | Record<string, string>;
  activo: boolean;
}

export type MetodoPago = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'MercadoPago';
export type Canal = 'Local' | 'Web' | 'Feria' | 'Otro';
export type Rol = 'admin' | 'empleada';

export interface Venta {
  id?: string;
  productoId: string;
  productoNombre: string;
  color: string;
  talle: string;
  precio: number;
  metodoPago: MetodoPago;
  canal: Canal;
  cliente: string;
  fecha: string;
  creadoPor: string;
}

export interface Usuario {
  uid: string;
  email: string;
  rol: Rol;
  nombre: string;
}
