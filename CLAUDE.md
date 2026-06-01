# Blanca Mulata — Sistema de Gestión de Ventas

App mobile-first para registrar y gestionar ventas de un negocio de indumentaria. Diseñada para que la dueña (admin) y sus empleadas puedan registrar ventas desde el celular en tiempo real.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase Realtime Database** — datos en tiempo real
- **Firebase Auth** — autenticación con email/contraseña
- **Tailwind CSS** — estilos mobile-first
- **Vercel** — deploy (pendiente)

## Roles de usuario

| Rol | Quién | Acceso |
|---|---|---|
| `admin` | Vicki (dueña) | Acceso completo a todas las secciones |
| `empleada` | Personal | Solo registro de ventas |

Los roles **no** se manejan con Firebase custom claims. Se almacenan en `Realtime Database → usuarios/{uid}` y se leen al iniciar sesión desde `AuthContext`.

## Estructura Firebase

```
/productos/{id}
  nombre:   string
  precio:   number
  colores:  string[]
  talles:   string[]
  activo:   boolean

/ventas/{id}
  productoId:    string
  productoNombre: string   ← se copia al momento de la venta
  color:         string
  talle:         string
  precio:        number    ← se copia al momento de la venta, NUNCA se actualiza
  metodoPago:    'Efectivo' | 'Transferencia' | 'Tarjeta' | 'MercadoPago'
  canal:         'Local' | 'Web' | 'Feria' | 'Otro'
  cliente:       string    ← opcional
  fecha:         string    ← ISO 8601
  creadoPor:     string    ← uid del usuario

/usuarios/{uid}
  nombre:  string
  email:   string
  rol:     'admin' | 'empleada'
```

**Regla crítica:** el `precio` y `productoNombre` se guardan en la venta en el momento de registrarla y nunca se recalculan. Si el precio del producto cambia después, las ventas anteriores conservan el precio original.

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              — root layout, monta Providers
│   ├── page.tsx                — redirect a /login o /ventas/nueva
│   ├── login/
│   │   └── page.tsx            — formulario de login
│   └── ventas/
│       └── nueva/
│           └── page.tsx        — página de registro de venta (protegida)
├── components/
│   ├── Providers.tsx           — wrapper client-side para AuthContext
│   └── VentaForm.tsx           — formulario completo de venta
├── contexts/
│   └── AuthContext.tsx         — Firebase Auth + lectura de rol desde DB
├── hooks/
│   └── useProductos.ts         — suscripción en tiempo real a productos activos
├── lib/
│   └── firebase.ts             — inicialización de Firebase (auth + db)
└── types/
    └── index.ts                — Producto, Venta, Usuario, MetodoPago, Canal, Rol
```

## Flujo de autenticación

1. Usuario abre la app → `app/page.tsx` detecta estado de auth
2. Si no está logueado → redirige a `/login`
3. Al hacer login → Firebase Auth valida credenciales
4. `AuthContext` lee `usuarios/{uid}` en Realtime DB para obtener nombre y rol
5. Redirige a `/ventas/nueva`
6. Cada página protegida verifica `user` en `useEffect` y redirige a `/login` si no hay sesión

## Fases del proyecto

### Fase 1 — Registro de ventas ✅ Completa
- Formulario mobile-first con: producto, color, talle, precio (automático), método de pago, canal, cliente
- Dropdowns encadenados: color y talle se filtran según el producto seleccionado
- Precio se carga automático y no es editable
- Botones tipo chip para método de pago y canal
- Feedback visual de éxito/error tras registrar

**Estado actual: Fase 1 completa — pendiente prueba en celular y deploy en Vercel.**

### Fase 2 — Panel admin (pendiente)
- Vista de ventas del día / historial
- Filtros por fecha, canal, método de pago, producto
- Totales y resumen de caja
- Gestión de productos (crear, editar, activar/desactivar)
- Gestión de usuarios (crear empleadas, cambiar roles)

### Fase 3 — Reportes (pendiente)
- Exportar ventas a CSV/Excel
- Gráficos de ventas por período
- Productos más vendidos

## Configuración inicial requerida (Firebase Console)

Antes del primer uso hay que cargar manualmente:

1. **Firebase Auth:** crear usuarios con email y contraseña
2. **Realtime DB → `/usuarios/{uid}`:** agregar nombre, email y rol por cada usuario
3. **Realtime DB → `/productos/`:** cargar los productos con sus colores, talles y precio

## Reglas de seguridad Firebase (Realtime Database)

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": false
      }
    },
    "productos": {
      ".read": "auth !== null",
      ".write": false
    },
    "ventas": {
      ".read": "auth !== null",
      ".write": "auth !== null"
    }
  }
}
```

## Comandos

```bash
npm run dev      # desarrollo local → http://localhost:3000
npm run build    # build de producción
npm run lint     # linting
```

## Deploy en Vercel

Pendiente. Pasos:
1. Subir repo a GitHub
2. Conectar repo en vercel.com
3. No requiere variables de entorno (las credenciales Firebase están en `src/lib/firebase.ts`)
4. Framework preset: Next.js
