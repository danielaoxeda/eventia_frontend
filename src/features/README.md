# 🚀 Features (Módulos de Negocio)

**¿Qué va aquí?**
El corazón de la aplicación. Aquí agrupamos el código por dominio de negocio. 

**Carpetas actuales:**
- `auth/`: Login, registro y manejo de sesión.
- `events/`: Catálogo público y filtros para el cliente.
- `checkout/`: Carrito y pasarela de pago simulada.
- `organizer/`: Panel CRUD para los organizadores.
- `admin/`: Gestión de categorías y roles.

**Estructura interna para cada feature:**
Al crear un nuevo módulo, debes respetar esta estructura interna:
/nombre-del-feature
  ├── /components  # Componentes UI que solo existen en este módulo
  ├── /services    # Llamadas fetch/axios exclusivas a los endpoints de la Api DUMMY
  ├── /types       # Interfaces de TypeScript específicas del módulo
  └── /utils       # Funciones matemáticas o helpers locales