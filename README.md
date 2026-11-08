# Eventia — Frontend

> Plataforma web para la gestión y venta de entradas para eventos. Frontend desarrollado con React, TypeScript y Tailwind CSS e integrado con una API REST desarrollada en Spring Boot.

[React](https://camo.githubusercontent.com/7390670fce0640a8e331953db00846cc6f1f6299551f5ce20a384e1747289795/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52656163742d31382d3631444146423f6c6f676f3d7265616374266c6f676f436f6c6f723d7768697465) [TypeScript](https://camo.githubusercontent.com/87eb18eb8c5eec761c47493170fcdfbb587410828d8704f80c9e965c221e0948/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f547970655363726970742d352d3331373843363f6c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465) [Tailwind CSS](https://camo.githubusercontent.com/e8ec2177225e99b255fb527b4b352268cdf33ea88d0d540caacdf116ae24c6d4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5461696c77696e5f4353532d332d3036423644343f6c6f676f3d7461696c77696e64637373266c6f676f436f6c6f723d7768697465) [Axios](https://camo.githubusercontent.com/e730aa3c33710178cce9014c37133c8b948061c73f3d18e5df5bfa58235bd5e5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4178696f732d485454505f436c69656e742d3541323945343f6c6f676f3d6178696f73266c6f676f436f6c6f723d7768697465) [Recharts](https://camo.githubusercontent.com/0342a834f666132cd66f7f9a571a65e7d6ea6e4b81c383369ed535ff8874759a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52656368617274732d446174615f56697375616c697a6174696f6e2d323242354246) [Vite](https://camo.githubusercontent.com/11cee3ec9fd1794d31fe9cf7e67bd46f1aba00776847c90c58e9aed176d6c19b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f566974652d46726f6e74656e645f546f6f6c2d3634364346463f6c6f676f3d76697465266c6f676f436f6c6f723d7768697465)

## 📌 Sobre el proyecto

**Eventia S.A.C.** es una plataforma web orientada a la gestión y venta de entradas para eventos.

Este repositorio contiene el **frontend** del proyecto académico, desarrollado con una arquitectura basada en features y preparado para consumir servicios REST mediante Axios.

La aplicación se encuentra integrada con el **backend de Eventia**, desarrollado con Spring Boot, mediante una API REST. La autenticación utiliza **JWT (JSON Web Token)** para gestionar las sesiones de los usuarios y proteger los recursos que requieren autenticación.

## ✨ Características

- 🔐 Registro e inicio de sesión mediante API REST
- 👤 Gestión de sesión y perfil de usuario
- 🎪 Catálogo, búsqueda y filtrado de eventos
- 🎟️ Selección y compra de entradas
- 💳 Checkout y pago simulado
- 📱 Tickets digitales con código QR
- 📊 Dashboard para organizadores
- 🎫 Gestión de eventos, tipos de entrada y tarifas
- 👥 Gestión de usuarios y roles
- 📈 Dashboard administrativo y métricas
- 📷 Validación de tickets mediante QR

## 🛠️ Tecnologías

| **Tecnología** | **Uso** |
| -------------- | ------- |
| React | Interfaz de usuario |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos y diseño responsivo |
| Axios | Consumo de API REST |
| Recharts | Gráficos y visualización de datos |
| React Router | Navegación |
| Vite | Desarrollo y build |
| Lucide React | Iconografía |

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

## 🔐 Autenticación e integración con el backend

El frontend se comunica con el backend mediante **Axios** y utiliza **JWT** para la autenticación.

El flujo de autenticación principal es:

1. El usuario inicia sesión o se registra desde el frontend.
2. El frontend envía las credenciales al endpoint correspondiente del backend.
3. El backend devuelve un **JWT**.
4. El token se almacena localmente como `accessToken`.
5. Las peticiones autenticadas incluyen el token mediante el header `Authorization`.
6. El frontend consulta `/auth/me` para obtener la información actual del usuario autenticado.
7. La sesión se construye utilizando el perfil y rol devueltos por el backend.

De esta forma, el frontend no define manualmente el rol del usuario, sino que utiliza la información proporcionada por el backend.

## 🔌 API

El frontend utiliza **Axios** para comunicarse con la API REST de Eventia.

La URL base del backend se configura desde el cliente HTTP y las peticiones autenticadas utilizan el siguiente formato:

```text
Authorization: Bearer <JWT>
```

### Principales endpoints utilizados

| **Endpoint** | **Método** | **Uso** |
| ------------ | ---------- | ------- |
| `/auth/login` | POST | Inicio de sesión |
| `/auth/register` | POST | Registro de usuario |
| `/auth/me` | GET | Obtener usuario autenticado |
| `/events` | GET | Obtener catálogo de eventos |

Los endpoints adicionales del sistema se encuentran organizados por funcionalidad dentro de `features`.

## 🚀 Instalación

### Requisitos

- Node.js >= 18
- npm
- Git
- Backend de Eventia ejecutándose localmente

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

## 📌 Estado del proyecto

**En desarrollo 🚧**

El frontend se encuentra integrado con el backend de Eventia mediante una API REST. Actualmente se encuentran implementados los principales flujos de autenticación, gestión de sesión y consumo de servicios, mientras continúa el desarrollo e integración de las demás funcionalidades de la plataforma.
