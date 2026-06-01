'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useVentas } from '@/hooks/useVentas';
import VentasTab from '@/components/dashboard/VentasTab';

type Tab = 'ventas' | 'productos' | 'costos' | 'stock' | 'consignacion';

const TABS: { id: Tab; label: string }[] = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'productos', label: 'Productos' },
  { id: 'costos', label: 'Costos' },
  { id: 'stock', label: 'Stock' },
  { id: 'consignacion', label: 'Consignacion' },
];

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-bm-tierra">
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-sm mt-1">Proximamente</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, usuario, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('ventas');
  const { ventas, loading: loadingVentas } = useVentas();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (usuario && usuario.rol !== 'admin') { router.replace('/ventas/nueva'); }
  }, [user, usuario, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading || !usuario) {
    return (
      <div className="min-h-screen bg-bm-crudo flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bm-chocolate" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bm-crudo">
      {/* Header */}
      <header className="bg-bm-blanco border-b border-bm-habano/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-bm-chocolate flex items-center justify-center">
              <span className="text-bm-blanco font-bold text-xs">BM</span>
            </div>
            <div>
              <p className="font-bold text-bm-chocolate text-sm leading-none">Blanca Mulata</p>
              <p className="text-xs text-bm-tierra mt-0.5">
                {usuario.nombre}
                <span className="ml-1.5 bg-bm-habano/20 text-bm-chocolate px-1.5 py-0.5 rounded-full text-xs font-medium">
                  Admin
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/ventas/nueva"
              className="hidden sm:flex text-sm font-medium text-bm-chocolate border border-bm-habano/40 px-3 py-1.5 rounded-lg hover:bg-bm-crudo transition-colors"
            >
              + Nueva venta
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-bm-tierra hover:text-bm-chocolate font-medium transition-colors px-2 py-1 rounded-lg hover:bg-bm-crudo"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-bm-blanco border-b border-bm-habano/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-0 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-bm-chocolate text-bm-chocolate'
                    : 'border-transparent text-bm-tierra hover:text-bm-chocolate'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-12">
        {loadingVentas && activeTab === 'ventas' ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bm-chocolate" />
          </div>
        ) : activeTab === 'ventas' ? (
          <VentasTab ventas={ventas} />
        ) : (
          <Placeholder label={TABS.find(t => t.id === activeTab)?.label ?? ''} />
        )}
      </main>
    </div>
  );
}
