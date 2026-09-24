# 🧩 Componentes Globales (UI Compartida)

**¿Qué va aquí?**
Solo componentes visuales genéricos que se reutilizan en múltiples partes de la plataforma Eventia. Si un componente se usa en más de un módulo (Ej: Cliente y Administrador), va en esta carpeta.

**Ejemplos válidos:**
- `Button.tsx` (Botón primario/secundario con Tailwind).
- `Navbar.tsx` (Barra de navegación principal).
- `ModalConfirm.tsx` (Modal genérico para confirmar acciones).

**⚠️ Regla de oro:**
Si tu componente SOLO sirve para un flujo específico (ej. `PaymentForm.tsx`), **NO** va aquí. Debe ir dentro de la carpeta `components/` de su respectivo feature (ej. `src/features/checkout/components/`).