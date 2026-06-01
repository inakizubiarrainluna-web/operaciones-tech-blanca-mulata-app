# Blanca Mulata — Sistema de Gestión de Ventas

App para registrar y gestionar ventas de un negocio de indumentaria. Empleadas registran ventas desde el celular (mobile-first); la dueña administra desde el dashboard de escritorio (PC-first).

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase Realtime Database** — datos en tiempo real
- **Firebase Auth** — autenticación con email/contraseña
- **Tailwind CSS**
- **Recharts** — gráficos en el dashboard
- **Vercel** — deploy en producción
- **GitHub** — repo: `inakizubiarrainluna-web/operaciones-tech-blanca-mulata-app`

## Roles de usuario

| Rol | Quién | Acceso |
|---|---|---|
| `admin` | Vicki (dueña) | `/ventas/nueva` + `/dashboard` completo |
| `empleada` | Personal | Solo `/ventas/nueva` |

Los roles **no** se manejan con Firebase custom claims. Se almacenan en `Realtime Database → usuarios/{uid}` y se leen al iniciar sesión desde `AuthContext`. Si un usuario autenticado no tiene nodo en `/usuarios`, la app muestra un mensaje de error en vez de pantalla en blanco.

## Paleta de colores

| Token Tailwind | Hex | Uso |
|---|---|---|
| `bm-crudo` | `#F5F0E8` | fondo de páginas |
| `bm-habano` | `#C4A882` | acentos, barras, bordes |
| `bm-chocolate` | `#6B4C3B` | texto primario, botones principales |
| `bm-tierra` | `#8B6F5E` | texto secundario, labels |
| `bm-blanco` | `#FDFBF7` | fondo de cards |

## Estructura Firebase

```
/productos/{id}
  nombre:        string
  precio:        number
  colores:       string[]
  talles:        string[]
  activo:        boolean

/ventas/{id}
  productoId:    string
  productoNombre: string   ← se copia al registrar, nunca se actualiza
  color:         string
  talle:         string
  precio:        number    ← se copia al registrar, NUNCA se recalcula
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

**Regla crítica:** `precio` y `productoNombre` se graban en la venta al momento de registrarla y nunca se recalculan. Cambios de precio posteriores no afectan ventas pasadas.

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx                  — root layout, monta Providers
│   ├── page.tsx                    — redirect a /login o /ventas/nueva
│   ├── login/
│   │   └── page.tsx                — formulario de login
│   ├── ventas/
│   │   └── nueva/
│   │       └── page.tsx            — formulario de venta (protegido, todos los roles)
│   └── dashboard/
│       └── page.tsx                — dashboard admin con tabs (protegido, solo admin)
├── components/
│   ├── Providers.tsx               — wrapper client-side para AuthContext
│   ├── VentaForm.tsx               — formulario completo de venta
│   └── dashboard/
│       ├── VentasTab.tsx           — tab de ventas: ensambla KPIs + chart + rankings
│       ├── KPICard.tsx             — card de KPI (variante normal y highlight)
│       ├── VentasChart.tsx         — gráfico de barras Recharts (últimos 30 días)
│       ├── TopProductos.tsx        — ranking top 5 productos por facturación
│       └── MetodosPago.tsx         — breakdown de métodos de pago con barra apilada
├── contexts/
│   └── AuthContext.tsx             — Firebase Auth + lectura de rol desde DB
├── hooks/
│   ├── useProductos.ts             — suscripción RT a productos activos
│   └── useVentas.ts                — suscripción RT a todas las ventas
├── lib/
│   ├── firebase.ts                 — inicialización Firebase (auth + db)
│   └── ventasUtils.ts             — calcKPIs, calcChartData, calcTopProductos, calcMetodosPago, formatPesos
└── types/
    └── index.ts                    — Producto, Venta, Usuario, MetodoPago, Canal, Rol
```

## Flujo de autenticación

1. Usuario abre la app → `app/page.tsx` detecta estado de auth
2. Si no está logueado → redirige a `/login`
3. Al hacer login → Firebase Auth valida credenciales
4. `AuthContext` lee `usuarios/{uid}` en Realtime DB para obtener nombre y rol
5. Admin → puede ir a `/ventas/nueva` o `/dashboard`; empleada → solo `/ventas/nueva`
6. Cada página protegida verifica `user` + `usuario` en `useEffect` y redirige si no hay sesión o rol insuficiente

## Fases del proyecto

### Fase 1 — Registro de ventas ✅ Completa y en producción
- Formulario mobile-first: producto, color, talle, precio (automático), método de pago, canal, cliente
- Dropdowns encadenados: color y talle filtrados por producto seleccionado
- Precio se carga solo desde Firebase y no es editable
- Botones tipo chip para método de pago y canal
- Feedback visual de éxito/error tras registrar
- Admin ve botón "Dashboard" en el header

### Fase 2 — Dashboard admin ✅ Completa y en producción
- Ruta `/dashboard`, accesible solo para `rol: 'admin'`
- Layout con tabs: **Ventas** (implementada) / Productos / Costos / Stock / Consignación (placeholders)
- **Tab Ventas:**
  - KPIs: total y cantidad de ventas hoy / esta semana / este mes
  - Ticket promedio del mes
  - Gráfico de barras: facturación por día en los últimos 30 días (Recharts)
  - Top 5 productos por facturación del mes (con barra proporcional)
  - Breakdown de métodos de pago del mes (barra apilada + porcentajes)
- Botón "+ Nueva venta" en el header del dashboard

### Fase 3 — Pendiente
- Gestión de productos desde la app (crear, editar, activar/desactivar)
- Gestión de usuarios (crear empleadas, cambiar roles)
- Historial de ventas con filtros (fecha, canal, método de pago, producto)
- Exportar ventas a CSV/Excel

### Fase 4 — Pendiente
- Reportes avanzados por período
- Control de stock
- Módulo de consignación

## Configuración inicial requerida (Firebase Console)

1. **Firebase Auth:** crear usuarios con email y contraseña
2. **Realtime DB → `/usuarios/{uid}`:** agregar `nombre`, `email` y `rol` por cada usuario
3. **Realtime DB → `/productos/`:** cargar productos con `nombre`, `precio`, `colores[]`, `talles[]`, `activo: true`
4. **Authentication → Settings → Authorized domains:** agregar el dominio de Vercel

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
npx tsc --noEmit # type check
```

## Deploy

- **Repo GitHub:** `inakizubiarrainluna-web/operaciones-tech-blanca-mulata-app`
- **Vercel:** conectado al repo, autodeploy en cada push a `master`
- No requiere variables de entorno (credenciales Firebase en `src/lib/firebase.ts`)
