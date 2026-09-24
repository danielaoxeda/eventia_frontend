# 🗺️ Enrutamiento y Accesos (React Router)

**¿Qué va aquí?**
La configuración centralizada de las rutas de la aplicación y la lógica de protección de accesos. Aquí definimos qué URL carga qué pantalla y quién tiene permiso para verla.

**Ejemplos válidos:**
- `AppRouter.tsx` (El archivo principal que agrupa el listado de todas las rutas).
- `ProtectedRoute.tsx` (Componente *wrapper* que verifica si el usuario está logueado y tiene el rol correcto antes de dejarlo pasar).
- `PublicRoute.tsx` (Rutas accesibles sin login, como el catálogo principal).

**⚠️ Regla de oro:**
No programen elementos visuales complejos aquí. Esta carpeta actúa puramente como un "director de tráfico". Las pantallas completas (Pages/Views) deben ser importadas desde la carpeta `components/` de sus respectivos `features/` y simplemente inyectadas en las rutas de este módulo.