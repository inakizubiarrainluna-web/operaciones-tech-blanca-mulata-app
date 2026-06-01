'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import VentaForm from '@/components/VentaForm';

export default function NuevaVentaPage() {
  const { user, usuario, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  if (user && !usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-sm w-full">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-amber-600 text-xl">!</span>
          </div>
          <h2 className="font-bold text-gray-900 mb-2">Perfil no configurado</h2>
          <p className="text-sm text-gray-500 mb-1">
            Tu usuario existe en Firebase Auth pero no tiene perfil en la base de datos.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Agregá el nodo <code className="bg-gray-100 px-1 rounded">usuarios/{user.uid}</code> en Realtime Database con nombre, email y rol.
          </p>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">BM</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">Blanca Mulata</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {usuario.nombre}
                {usuario.rol === 'admin' && (
                  <span className="ml-1.5 text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Nueva Venta</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <VentaForm />
        </div>
      </main>
    </div>
  );
}
