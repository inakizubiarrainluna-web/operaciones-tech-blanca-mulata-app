'use client';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Venta } from '@/types';

export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'ventas'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Venta[] = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<Venta, 'id'>),
        }));
        list.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setVentas(list);
      } else {
        setVentas([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { ventas, loading };
}
