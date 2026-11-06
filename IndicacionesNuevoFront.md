# Transcriptor — Frontend

PWA accesible de transcripción de reuniones. Construida con **React 19 + Vite + TypeScript**, **Tailwind CSS v4**, **React Router 7** y **TanStack Query**. Consume el backend NestJS del repo `transcriptor-backend` (prefijo `/api/v1`).

> **Si vas a trabajar en este proyecto, lee primero las secciones 4, 5 y 8.** Explican cómo está organizado el código, cómo agregar páginas sin romper la estructura y qué falta por hacer.

---

## 1. Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Git
- Backend `transcriptor-backend` levantado (por defecto en `http://localhost:3000`)

## 2. Puesta en marcha

```bash
npm install
```

Crea un archivo `.env.local` en la raíz (no se commitea):

```env
VITE_API_URL=http://localhost:3000
```

> El cliente agrega `/api/v1` automáticamente. **No lo incluyas en `VITE_API_URL`.**

```bash
npm run dev       # desarrollo (http://localhost:5173)
npm run build     # tsc -b && vite build
npm run preview   # previsualiza la build en el puerto 5173
npm run lint      # eslint
```

Si cambias el `.env.local`, reinicia `npm run dev`.

### Problemas frecuentes

- **Pantalla en blanco / cambios que no se ven**: el service worker de la PWA está activo también en desarrollo (`devOptions.enabled: true`). DevTools → Application → Service Workers → *Unregister*, y recarga con `Ctrl + F5`.
- **Error de CORS o sesión que no persiste**: el front envía `credentials: "include"` para la cookie del refresh token. El backend debe permitir el origen `http://localhost:5173` con credenciales.

---

## 3. Cómo funciona la sesión (importante)

- El **access token vive solo en memoria** (`src/api/client.ts`). No se guarda en `localStorage`.
- El **refresh token es una cookie** gestionada por el backend. Al cargar la app, `AuthProvider` llama a `POST /auth/refresh` para recuperar la sesión.
- Si una petición responde `401` (y no es una ruta pública de auth), `apiFetch` intenta un refresh y reintenta **una vez**. Si falla, limpia la sesión y manda al login.
- **No uses `fetch` directo.** Siempre usa `api<T>()` (JSON) o `apiFetch()` (respuesta cruda, p. ej. blobs) de `src/api/client.ts`. Las rutas se escriben **sin** `/api/v1`: `api("/spaces")`.
- Los errores llegan como `ApiError` (`status`, `code`, `message`, `details`).

### Ojo con los dos conceptos de "rol"

| Concepto | Dónde vive | Valores | Para qué sirve |
|---|---|---|---|
| Rol del usuario en el backend | `ApiUser.role` (`src/api/types.ts`) | `USER`, `ADMIN`, `SUPERADMIN` | Permisos de la cuenta |
| Modo de uso en el front | `useAuth().role` (guardado en `sessionStorage`) | `speaker`, `viewer` | Decide qué vista se muestra (orador vs. espectador) |
| Rol dentro de un espacio | `Space.myRole` | `OWNER`, `MEMBER` | Permisos reales dentro de cada espacio |

`speaker`/`viewer` es una **preferencia de interfaz** que el usuario elige en `/roles`; **no es un permiso**. La autorización real la decide el backend con `OWNER`/`MEMBER`.

---

## 4. Estructura del proyecto

El proyecto está organizado **por funcionalidad (feature)**, no por tipo de archivo.

```
src/
├── main.tsx                  # Providers globales (orden importante, ver abajo)
├── App.tsx                   # Solo renderiza <AppRoutes />
├── index.css / App.css
├── styles/theme.css          # Variables CSS del tema (--background, --text, --surface, --border...)
│
├── api/
│   ├── client.ts             # api(), apiFetch(), refresh, manejo de token y ApiError
│   └── types.ts              # Tipos compartidos de la API (ApiUser, SessionResponse...)
│
├── lib/
│   └── queryClient.ts        # Config de TanStack Query (staleTime 5 min, retry 1)
│
├── app/
│   ├── layouts/              # AuthLayout, MainLayout (con Navbar), SecondaryLayout
│   ├── routes/
│   │   ├── AppRoutes.tsx     # ÚNICO lugar donde se declaran las rutas
│   │   └── ProtectedRoute.tsx
│   └── providers/            # (vacía)
│
├── contexts/                 # Estado global. Cada contexto = 3 archivos
│   ├── auth/                 # AuthContext.tsx · authcontext.ts · useAuth.ts
│   ├── accessibility/        # AccessibilityContext.tsx · accessibilityContextValue.ts · useAccessibility.ts
│   └── recording/            # RecordingContext.tsx · recordingContext.ts · useRecordingContext.ts
│
├── features/                 # Cada carpeta es una funcionalidad completa
│   ├── auth/                 # login, registro, verificar correo, recuperar contraseña, elegir rol
│   ├── spaces/               # espacios (reuniones): listar, crear, unirse por código/QR
│   ├── members/              # solicitudes y miembros de un espacio
│   ├── recording/            # grabar: permisos de micrófono, configuración, controles, guardado
│   ├── recordings/           # listar y ver grabaciones, transcript, resumen
│   ├── dashboard/            # vistas por rol × modo de navegación (ver sección 5.4)
│   ├── accessibility/        # pantallas de accesibilidad
│   ├── profile/              # perfil (placeholder)
│   ├── modules/              # (vacía)
│   └── transcription/        # (vacía)
│
└── shared/                   # Reutilizable por cualquier feature
    ├── components/
    │   ├── ui/               # buttons · cards · feedback · forms · navigation · selection · settings
    │   ├── modals/           # Modal, ConfirmModal, RenameModal, ShareModal
    │   ├── calendar/         # WeekRangeCalendar, WeekRangePicker
    │   └── filters/          # SortSelector
    ├── constants/ · icons/ · types/ · utils/   # cn(), sortByDate()...
    ├── assets/               # (vacía)
    └── services/             # (vacía)
```

### Anatomía de una feature

Toda feature sigue la misma forma. **Respétala:**

```
features/<nombre>/
├── pages/        # Componentes que se enganchan a una ruta  (XxxPage.tsx)
├── components/   # Piezas visuales propias de la feature
├── hooks/        # Hooks de datos (React Query) y de lógica (useXxx.ts)
├── services/     # Llamadas a la API (xxxService.ts) — única capa que habla con api()
├── types/        # Tipos de la feature (xxx.types.ts)
└── utils/        # (opcional) validadores, helpers
```

**Flujo de datos:** `Page → hook → service → api() → backend`. Una página nunca llama a `api()` directamente; un servicio nunca importa componentes.

### Providers (orden en `main.tsx`)

```
BrowserRouter
 └ QueryClientProvider
    └ AccessibilityProvider
       └ AuthProvider
          └ RecordingProvider
             └ <App />
```

No cambies este orden: `AuthProvider` usa `queryClient` y las rutas usan los tres contextos.

### Convenciones del código

- **Idioma:** texto de interfaz y comentarios en español (`es-EC`). Identificadores en inglés.
- **Nombres:** componentes y páginas en `PascalCase.tsx`; hooks `useXxx.ts`; servicios `xxxService.ts` (objeto exportado); tipos `xxx.types.ts`.
- **Estilos:** Tailwind v4 + variables CSS del tema. Los colores se leen de `var(--background)`, `var(--text)`, `var(--text-secondary)`, `var(--surface)`, `var(--border)`. En clases de Tailwind se usa la sintaxis v4: `text-(--text-secondary)`, `bg-(--surface)`. **No hardcodees colores**: el tema (claro/oscuro/alto contraste) cambia esas variables.
- **Accesibilidad:** es el eje del producto. Usa `role`, `aria-label`, `aria-live`, `Header` con botón de volver, y respeta `settings.navigationMode` y el resto de ajustes de `useAccessibility()`.
- **Componentes UI:** antes de crear un botón, input o tarjeta, revisa `shared/components/ui/`. Reutiliza `Button`, `Input`, `SearchInput`, `BaseCard`, `Header`, etc.
- **Datos remotos:** siempre con TanStack Query (`useQuery` / `useMutation`) dentro de hooks de la feature.

---

## 5. Cómo crear páginas nuevas

### 5.1 Receta general (página simple)

Ejemplo: una página de perfil en `features/profile`.

**1. Tipos** — `features/profile/types/profile.types.ts`

```ts
export interface UpdateProfileRequest {
  name: string;
}
```

**2. Servicio** — `features/profile/services/profileService.ts`

```ts
import { api } from "../../../api/client";
import type { ApiUser } from "../../../api/types";
import type { UpdateProfileRequest } from "../types/profile.types";

export const profileService = {
  getMe(): Promise<ApiUser> {
    return api<ApiUser>("/users/me");
  },

  update(data: UpdateProfileRequest): Promise<ApiUser> {
    return api<ApiUser>("/users/me", { method: "PATCH", json: data });
  },
};
```

**3. Hook** — `features/profile/hooks/useProfile.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profileService";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getMe,
  });
}
```

Para escrituras usa `useMutation` e invalida la query (ver `features/members/hooks/useMemberActions.ts` como modelo).

**4. Página** — `features/profile/pages/ProfilePage.tsx`

```tsx
import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { data: user, isLoading, error } = useProfile();

  return (
    <MainLayout>
      <Header title="Perfil" showBackButton />

      <div className="p-4 space-y-6">
        {isLoading && <p role="status" aria-live="polite">Cargando...</p>}
        {error && <p className="text-red-500">Error cargando el perfil</p>}
        {user && <p>{user.name}</p>}
      </div>
    </MainLayout>
  );
}
```

**5. Ruta** — en `app/routes/AppRoutes.tsx`

```tsx
import ProfilePage from "../../features/profile/pages/ProfilePage";

<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
```

**6. Navegación (si aplica)** — agrega el acceso en `shared/components/ui/navigation/Navbar.tsx` o navega con `useNavigate()`.

### 5.2 Qué layout usar

| Layout | Úsalo para |
|---|---|
| `AuthLayout` | Pantallas centradas sin barra (login, registro, elegir rol, recuperar contraseña) |
| `MainLayout` | Pantallas de la app con `Navbar` inferior y banner de verificación de correo |
| `SecondaryLayout` | Pantallas simples a pantalla completa, sin `Navbar` |

### 5.3 Rutas públicas vs. protegidas

- **Públicas** (sin `ProtectedRoute`): `/`, `/register`, `/verificar-correo`, `/olvide-contrasena`, `/restablecer-contrasena`.
- **Protegidas**: todo lo demás. Se envuelven con `<ProtectedRoute>`; mientras se recupera la sesión muestran "Cargando..." y, si no hay sesión, redirigen a `/` guardando la ruta de origen en `state.from`.
- Las rutas en español son las de autenticación (`/verificar-correo`...). Las rutas de la app van en inglés (`/spaces`, `/recording/...`). Mantén esa división.

### 5.4 Páginas que cambian según rol y modo (patrón `dashboard`)

Algunas pantallas (espacios, grabaciones) tienen **4 vistas**: `speaker | viewer` × `simple | standard`. La página es solo un **selector**, y las vistas viven en `features/dashboard/`:

```
features/dashboard/
├── speaker/
│   ├── simple/     Speaker Simple   <Algo>View.tsx
│   └── standard/   Speaker Standard <Algo>View.tsx
└── viewer/
    ├── simple/     Viewer Simple    <Algo>View.tsx
    └── standard/   Viewer Standard  <Algo>View.tsx
```

El selector (ver `features/spaces/pages/SpacesPage.tsx`):

```tsx
const { role } = useAuth();
const { settings } = useAccessibility();
const isSimple = settings.navigationMode === "simple";

if (role === "speaker") {
  return isSimple ? <SpeakerSimpleXView /> : <SpeakerStandardXView />;
}
return isSimple ? <ViewerSimpleXView /> : <ViewerStandardXView />;
```

**Para agregar una pantalla con este patrón:**

1. Crea las 4 vistas `Speaker/Viewer` × `Simple/Standard` en `features/dashboard/...` con el nombre `<Rol><Modo><Pantalla>View.tsx`.
2. Crea la página selector en `features/<feature>/pages/`.
3. Registra **solo la página** en `AppRoutes.tsx`.
4. Los datos (hooks/servicios) van en la feature, **no** en `dashboard`. Las vistas solo presentan.

Modo `simple` = pantallas más grandes, menos elementos, texto más grande. Modo `standard` = interfaz completa. Si una pantalla no necesita diferenciar, no uses este patrón.

### 5.5 Checklist antes de dar una página por terminada

- [ ] Servicio, hook y tipos en su feature (sin `fetch` directo)
- [ ] Usa un layout y el `Header`
- [ ] Estados de carga, error y vacío
- [ ] Colores con variables del tema
- [ ] Probada en modo `simple` y `standard`, y con rol `speaker` y `viewer` si aplica
- [ ] Ruta registrada en `AppRoutes.tsx` (con `ProtectedRoute` si requiere sesión)
- [ ] `npm run lint` y `npm run build` sin errores

---

## 6. Mapa de rutas actual

| Ruta | Página | Protegida | Notas |
|---|---|---|---|
| `/` | `LoginPage` | No | |
| `/register` | `RegisterPage` | No | |
| `/verificar-correo` | `VerifyEmailPage` | No | |
| `/olvide-contrasena` | `ForgotPasswordPage` | No | |
| `/restablecer-contrasena` | `ResetPasswordPage` | No | |
| `/roles` | `RoleSelectionPage` | Sí | Elige `speaker` / `viewer` |
| `/spaces` | `SpacesPage` | Sí | Selector de 4 vistas |
| `/spaces/join` | `JoinSpacePage` | Sí | Código manual, voz o QR |
| `/spaces/:spaceId/recordings` | `RecordingsPage` | Sí | Selector de 4 vistas |
| `/recording/start` | `RecordingStartPage` | Sí | Verifica micrófono |
| `/recording/setup` | `SessionSetupPage` | Sí | Título / espacio / consentimiento |
| `/recording/live` | `RecordingsPage` ⚠️ | Sí | **Error: debería ser `RecordingPage`** (ver sección 8) |
| `/recording/saved` | `SessionSavedPage` | Sí | |
| `/accessibility` | `AccessibilityPage` | Sí | |
| `/accessibility/settings` | `AccessibilitySettingsPage` | Sí | |

**Rutas referenciadas pero sin declarar:** `/profile` (Navbar), `/recordings/:recordingId` (al tocar una `RecordingCard`), `/spaces/:spaceId/members` (la página existe). Ver sección 8.

---

## 7. Contrato con el backend (lo que el front consume hoy)

Base: `${VITE_API_URL}/api/v1`. Esta tabla sale del código de `services/`; si el backend cambia, **actualiza el servicio correspondiente y esta tabla**. Ante cualquier duda, el backend (controladores / Swagger) manda.

| Área | Método y ruta | Servicio |
|---|---|---|
| Auth | `POST /auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout` | `authService` |
| Auth | `POST /auth/verify-email`, `/auth/resend-verification`, `/auth/forgot-password`, `/auth/reset-password` | `authService` |
| Usuario | `GET /users/me` | `authService.me` |
| Espacios | `GET /spaces?role=owner\|member&q=`, `GET /spaces/:id`, `POST /spaces` | `spacesService` |
| Unirse | `POST /join` `{ code }` → queda `PENDING` hasta que el dueño apruebe | `spacesService.joinSpace` |
| Miembros | `GET /spaces/:id/members?status=`, `POST .../members/:userId/approve`, `.../reject`, `DELETE .../members/:userId` | `membersService` |
| Grabar (flujo actual) | `POST /recordings/upload` → `PUT /recordings/:id/file` (blob completo) | `recordingService.uploadRecording` |
| Grabar (por chunks) | `POST /recordings`, `PUT /recordings/:id/chunks/:seq`, `POST /recordings/:id/finish` | `recordingService` *(sin usar aún)* |
| Grabaciones | `GET /recordings?spaceId&status&visibility&q`, `GET /recordings/:id`, `PATCH`, `DELETE` | `recordingsService` |
| Contenido | `GET /recordings/:id/transcript`, `/summary`, `/export?format=pdf\|txt\|srt` | `recordingsService` |

Los listados devuelven `{ items, nextCursor }`. **Hoy los servicios solo devuelven `items` y descartan `nextCursor`** (no hay paginación en el front).

---

## 8. Lo que falta por hacer

### 8.1 Errores que hay que corregir primero

1. **`/recording/live` renderiza `RecordingsPage`** en `AppRoutes.tsx`. Debe renderizar `features/recording/pages/RecordingPage` (ya existe y está completa; solo falta importarla y usarla).
2. **Rutas navegadas pero no declaradas**:
   - `/recordings/:recordingId` → `RecordingDetailsPage` (ver 8.2).
   - `/spaces/:spaceId/members` → `SpaceMembersPage` (existe, falta registrarla y enlazarla desde la vista del orador).
   - `/profile` → `ProfilePage` (el import está comentado en `AppRoutes.tsx`).
3. **No hay ruta comodín (404)**: agrega `<Route path="*" ...>`.
4. **Usuario ya autenticado en `/`**: ve el login. Redirigir a `/roles` o `/spaces` si `isAuthenticated`.
5. **README anterior desactualizado**: mencionaba `VITE_FRONT_ONLY`, `src/pages` y el puerto 8080; nada de eso existe ya. Este documento lo reemplaza.

### 8.2 Archivos vacíos (0 bytes) por implementar

| Archivo | Qué debe hacer |
|---|---|
| `features/recordings/pages/RecordingDetailsPage.tsx` | Selector de 4 vistas para el detalle de una grabación (patrón 5.4) |
| `features/dashboard/speaker/simple/SpeakerSimpleRecordingDetailsView.tsx` | Detalle orador, modo simple |
| `features/dashboard/speaker/standard/SpeakerStandardRecordingDetailsView.tsx` | Detalle orador, modo estándar (editar título, visibilidad, exportar, eliminar) |
| `features/dashboard/viewer/simple/ViewerSimpleRecordingDetailsView.tsx` | Detalle espectador, modo simple |
| `features/dashboard/viewer/standard/ViewerStandardRecordingDetailsView.tsx` | Detalle espectador, modo estándar |
| `features/recording/components/RecordingSuccessCard.tsx` | Tarjeta de confirmación al guardar |
| `shared/components/modals/ConfirmModal.tsx` | Confirmación (eliminar, salir) |
| `shared/components/modals/RenameModal.tsx` | Renombrar grabación/espacio |
| `shared/components/modals/ShareModal.tsx` | Compartir / cambiar visibilidad (`PRIVATE` ↔ `PUBLISHED`) |
| `shared/components/ui/feedback/Badge.tsx` | Etiqueta de estado |
| `shared/components/ui/feedback/Divider.tsx` | Separador |
| `shared/components/ui/feedback/EmptyState.tsx` | Estado vacío de listas |

**Para el detalle de grabación ya está hecha la base**, solo hay que ensamblarla: hooks `useRecordingDetail`, `useTranscript`, `useSummary`, `useRecordingActions` y componentes `AudioPlayer`, `TranscriptPreview`, `SummaryCard`, `RecordingActionsPanel`, `RecordingStatusBadge`. La grabación pasa por los estados `RECORDING → UPLOADED → TRANSCRIBING → SUMMARIZING → READY` (también `PARTIAL` y `FAILED`); mientras no esté `READY`, el detalle debe mostrar el progreso (`recording.progress`) y reintentar (polling).

### 8.3 Funcionalidades que el backend ya contempla y el front no completa

- **Grabación en vivo con subtítulos en tiempo real.** Existen `startRecording` / `uploadChunk` / `finishRecording` en `recordingService`, el ajuste `liveCaptions` en `SpaceSettings` y `socket.io-client` instalado, pero **nada de eso está conectado**. Hoy se graba y se sube el audio completo al terminar. Por hacer: cliente de WebSocket (`shared/services/` o `features/recording/services/`), subida por chunks desde `useRecording` y vista de subtítulos en vivo para el espectador.
- **Ajustes del espacio** (`autoPublish`, `showTranscript`, `allowExport`, `liveCaptions`, `glossary`): los tipos existen, pero `spacesService` solo tiene listar, obtener, crear y unirse. Falta pantalla y servicio para editar el espacio (nombre, descripción, ajustes), rotar/desactivar el código de invitación (`SpaceInvite`), y salir/eliminar un espacio. *Verificar los endpoints reales en el backend antes de escribirlos.*
- **Gestión de miembros.** Solo se aprueban/rechazan solicitudes. `membersService.removeMember` existe sin interfaz. Falta listar miembros activos y expulsarlos.
- **MFA / cuentas administrador.** `authService.login` rechaza con `MFA_NOT_SUPPORTED` si el backend devuelve `mfaToken`. `/auth/login/mfa` figura como ruta pública pero no hay pantalla ni servicio. Decidir si estas cuentas usarán este front o uno aparte.
- **Perfil.** `ProfilePage` es un placeholder (`<div>Perfil</div>`). Falta ver/editar datos, cambiar contraseña y cerrar sesión.
- **Exportación.** `exportRecording` ya devuelve el blob en `pdf | txt | srt`; falta el botón y la descarga en la UI (respetando `allowExport` del espacio).
- **Paginación.** Pasar de devolver `items` a manejar `nextCursor` (scroll infinito o "cargar más") con `useInfiniteQuery`.
- **Filtros de grabaciones.** `RecordingsFilter` admite `status` y `visibility`, pero las vistas solo usan búsqueda (`q`) y orden por fecha. `WeekRangeCalendar` / `WeekRangePicker` existen en `shared` pero no están usados en ninguna vista.
- **Carpetas vacías sin propósito definido:** `app/providers`, `features/accessibility/hooks`, `features/members/components`, `features/modules`, `features/spaces/views`, `features/transcription`, `shared/assets`, `shared/services`. Úsalas siguiendo la anatomía de la sección 4 o bórralas; no las rellenes con código que no encaje.

### 8.4 Calidad y mantenimiento

- **No hay pruebas automatizadas.** Mínimo: validadores de `features/auth/utils`, servicios y `ProtectedRoute`.
- **Manejo de errores uniforme:** hoy cada vista pinta su propio mensaje. Centralizar usando `ApiError.code`.
- **Reconocimiento de voz** (`useSpeechCode`) depende de `SpeechRecognition` del navegador y usa `alert()`; reemplazar por un mensaje accesible.
- **Offline/PWA:** solo hay caché de recursos (`vite.config.ts`). No hay cola de subida si se pierde la conexión durante o después de grabar.
- Archivo `src/features/recording/components/InviteCodeCard.tsx` se importa como `MeetingCodeCard` en `RecordingPage`; unificar nombre.

---

## 9. Reglas para quien continúe el proyecto

1. **No cambies la estructura por feature.** Todo lo nuevo entra en una feature existente o crea una nueva con la anatomía de la sección 4.
2. **Una sola capa habla con la API:** `services/` → `api()`. Nada de `fetch` ni `axios` sueltos.
3. **Rutas solo en `AppRoutes.tsx`.** Páginas solo en `features/*/pages`.
4. **Reutiliza `shared/components/ui` y las variables del tema.** No instales otra librería de componentes ni de estilos.
5. **Toda pantalla nueva debe funcionar en los dos modos** (`simple` y `standard`) y ser accesible por teclado y lector de pantalla.
6. **No guardes tokens en `localStorage`/`sessionStorage`.** Lo único que se persiste en `sessionStorage` es el modo `speaker`/`viewer`.
7. **Si el backend cambia un endpoint o un tipo**, actualiza el servicio y `types/` de esa feature y la tabla de la sección 7 en el mismo commit.
8. Antes de abrir un PR: `npm run lint` y `npm run build`.