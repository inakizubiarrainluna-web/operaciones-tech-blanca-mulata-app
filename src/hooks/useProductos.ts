'use client';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Producto } from '@/types';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productosRef = ref(db, 'productos');
    const unsubscribe = onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Producto[] = Object.entries(data)
          .map(([id, val]) => ({ id, ...(val as Omit<Producto, 'id'>) }))
          .filter((p) => p.activo);
        setProductos(list);
      } else {
        setProductos([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { productos, loading };
}
