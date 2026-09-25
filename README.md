# Eventia — Frontend

> Plataforma web para la gestión y venta de entradas para eventos. Frontend desarrollado con React, TypeScript y Tailwind CSS.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios\&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data_Visualization-22B5BF)
![Vite](https://img.shields.io/badge/Vite-Frontend_Tool-646CFF?logo=vite\&logoColor=white)

## 📌 Sobre el proyecto

**Eventia S.A.C.** es una plataforma web orientada a la gestión y venta de entradas para eventos.

Este repositorio contiene el **frontend** del proyecto académico, desarrollado con una arquitectura basada en features y preparado para consumir servicios REST.

Actualmente, la aplicación utiliza una **API Dummy** para simular el consumo de datos. La integración con el backend real se realizará posteriormente.

## ✨ Características

* 🔐 Registro, inicio de sesión y gestión de perfil
* 🎪 Catálogo, búsqueda y filtrado de eventos
* 🎟️ Selección y compra de entradas
* 💳 Checkout y pago simulado
* 📱 Tickets digitales con código QR
* 📊 Dashboard para organizadores
* 🎫 Gestión de eventos, tipos de entrada y tarifas
* 👥 Gestión de usuarios y roles
* 📈 Dashboard administrativo y métricas
* 📷 Validación simulada de tickets mediante QR

## 🛠️ Tecnologías

| Tecnología   | Uso                               |
| ------------ | --------------------------------- |
| React        | Interfaz de usuario               |
| TypeScript   | Tipado estático                   |
| Tailwind CSS | Estilos y diseño responsivo       |
| Axios        | Consumo de API                    |
| Recharts     | Gráficos y visualización de datos |
| React Router | Navegación                        |
| Vite         | Desarrollo y build                |
| Lucide React | Iconografía                       |

## 🏗️ Arquitectura

El proyecto utiliza una **arquitectura basada en features (Feature-Based Architecture)**. Cada funcionalidad agrupa sus propios componentes, páginas, servicios, hooks y tipos.

Las funcionalidades reutilizables se mantienen en `shared`.

```text
src/
├── app/                 # Configuración y rutas
│
├── features/            # Funcionalidades del sistema
│   ├── auth/
│   ├── profile/
│   ├── users/
│   ├── events/
│   ├── categories/
│   ├── checkout/
│   ├── tickets/
│   ├── organizer/
│   ├── ticket-types/
│   ├── admin/
│   └── qr-validation/
│
├── shared/              # Elementos reutilizables
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── assets/
├── main.tsx
└── index.css
```

Esta organización permite mantener separadas las funcionalidades del sistema y facilita el desarrollo colaborativo.

## 🚀 Instalación

### Requisitos

* Node.js >= 18
* npm
* Git

### Clonar el repositorio

```bash
git clone https://github.com/danielaoxeda/eventia-frontend.git
cd eventia-frontend
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en la URL indicada por Vite, normalmente:

```text
http://localhost:5173
```

### Generar build de producción

```bash
npm run build
```

## 🔌 API

El frontend utiliza **Axios** para la comunicación con servicios HTTP.

Durante el desarrollo se utilizará una **API Dummy**. La estructura de servicios está preparada para reemplazar posteriormente estos endpoints por los del backend de Eventia.

## 📌 Estado del proyecto

**En desarrollo 🚧**

Actualmente se encuentra en implementación el frontend y sus principales flujos de usuario. La integración con el backend real se realizará en una etapa posterior.
