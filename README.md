# hack-front — Frontend de gestión de incidencias

Aplicación web en React + Vite + TypeScript para reportar y gestionar incidencias. Incluye autenticación con JWT, rutas protegidas, panel de control con listado/creación de incidencias y utilidades para administración de usuarios/roles.

## ✨ Funcionalidades

- Autenticación
  - Inicio de sesión y registro de usuarios (`/login`, `/register`).
  - Persistencia en `localStorage` del usuario (`hf_user`) y token JWT (`hf_token`).
  - Decodificación de claims del token (email, username, role, department).
- Rutas protegidas
  - Acceso restringido a `/dashboard` y `/post` usando `ProtectedRoute`.
- Dashboard
  - Bienvenida personalizada con rol del usuario.
  - Ver incidencias en panel lateral (SlideOver).
  - Crear incidencia en línea mediante formulario.
  - Acciones rápidas: ver incidencias, crear nuevo reporte.
  - Gestión de equipo (solo Admin): registrar trabajadores desde un SlideOver.
- Páginas principales
  - `/` Home pública.
  - `/login` y `/register` públicas.
  - `/dashboard` y `/post` privadas.
- UI/Stack
  - React 19, React Router 7, TypeScript.
  - MUI, TailwindCSS y algunos componentes/estilos propios.

## 🧱 Arquitectura rápida

- Herramientas: Vite 7, TypeScript 5, ESLint.
- Estado/Auth: Context API (`AuthProvider`) en `src/services/auth/authContext.tsx`.
- APIs
  - Auth: `src/services/auth/authApi.ts` → `VITE_AUTH_BASE` (por defecto `/api/auth`).
  - Incidencias: `src/services/incident/incidentApi.ts` → `VITE_INCIDENT_BASE` (URL base completa). Se recortan barras finales si existen.

## 🔐 Variables de entorno

Crea un archivo `.env` o `.env.local` en la raíz del proyecto con:

```
# Base del backend de autenticación
VITE_AUTH_BASE=https://tu-backend.com/api/auth

# Base del backend de incidencias (ruta completa a la colección)
VITE_INCIDENT_BASE=https://tu-backend.com/api/incidents
```

También puedes copiar el ejemplo incluido:

```
cp .env.example .env.local
```

Notas:
- `VITE_AUTH_BASE` tiene por defecto `/api/auth` si no se define.
- `VITE_INCIDENT_BASE` es obligatoria para listar/crear incidencias.

## ▶️ Cómo ejecutar

Requisitos: Node.js 18+ y npm.

1) Instalar dependencias

```bash
npm install
```

2) Configurar variables de entorno

```bash
cp .env.example .env.local
# Edita .env.local con tus URLs
```

3) Modo desarrollo

```bash
npm run dev
```

- Vite abrirá la app en http://localhost:5173 (o el puerto disponible).

4) Build de producción

```bash
npm run build
npm run preview
```

## 📜 Scripts disponibles

- `npm run dev` → Arranca el servidor de desarrollo de Vite.
- `npm run build` → Compila TypeScript y genera producción.
- `npm run preview` → Sirve el build para verificación.
- `npm run lint` → Revisa el código con ESLint.

## 🔎 Rutas y permisos

- Públicas: `/`, `/login`, `/register`.
- Protegidas: `/dashboard`, `/post` (requieren usuario autenticado).
- Rol de Admin: acceso a SlideOver de administración para registrar trabajadores.

## 🧰 Detalles técnicos útiles

- Claves de almacenamiento local:
  - `hf_token`: JWT para Authorization Bearer en llamadas a APIs.
  - `hf_user`: datos básicos del usuario para UX.
- Endpoints usados:
  - Login: `POST {VITE_AUTH_BASE}/login`.
  - Register: `POST {VITE_AUTH_BASE}/register` (si hay token, se añade `Authorization: Bearer`).
  - Incidencias: `GET/POST {VITE_INCIDENT_BASE}` con Bearer opcional según endpoint.
- Tolerancia de formatos en incidencias: el frontend normaliza respuestas con diferentes formas (`items`, `data/meta`, `incidents`).

## 🧪 Pruebas rápidas manuales

- Registro → redirige al dashboard y crea usuario en memoria.
- Login → guarda token y muestra rol/usuario en el dashboard.
- Dashboard → crear incidencia (inline) y abrir el listado (SlideOver).
- Como Admin → abrir SlideOver de administración para registrar trabajador.

## 🐞 Solución de problemas

- 401 Unauthorized: revisa que `hf_token` exista y no esté expirado; vuelve a iniciar sesión.
- CORS: asegúrate de permitir el origen del front en el backend.
- Variables de entorno: revisa `VITE_INCIDENT_BASE` definida y sin errores tipográficos; se recorta automáticamente la barra final.
- Rutas en servidor: si sirves detrás de un proxy, verifica los rewrites para SPA.

---

Hecho con React + Vite. Si necesitas ayuda para integrarlo con tu backend, abre un issue o ajusta las bases en `.env.local`. 
