# Frontend de Transcriptor

Aplicación web construida con React + Vite + TypeScript.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Git.

Para verificar versiones:

```bash
node -v
npm -v
git --version
```

### Si no tienes estos programas instalados

### 1) Instalar Node.js y npm

Node.js incluye npm, asi que se instala todo junto.

En Windows:

1. Entra a https://nodejs.org
2. Descarga la version LTS (recomendada).
3. Ejecuta el instalador .msi y deja las opciones por defecto.
4. Cierra y abre de nuevo la terminal.
5. Verifica:

```bash
node -v
npm -v
```

Si npm no aparece, reinicia el equipo y vuelve a probar.

## Iniciar proyecto desde cero (clonación)

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Entra al proyecto:

```bash
cd TranscriptorBackend-main
```

3. Entra a la carpeta del frontend:

```bash
cd Frontend
```

4. Instala dependencias:

```bash
npm install
```

5. Crea el archivo de entorno local `.env.local`.

## Configuración de entorno

### Opción A: trabajar solo frontend (modo mock)

Usa esta configuración para avanzar en pantallas sin backend:

```env
VITE_FRONT_ONLY=true
VITE_API_URL=http://localhost:8080
```

Con esta opción, Login y Registro usan datos simulados en el navegador.

### Opción B: trabajar con backend real

Usa esta configuración cuando el backend ya está levantado:

```env
VITE_FRONT_ONLY=false
VITE_API_URL=http://localhost:8080
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Vite mostrará una URL local, normalmente:

- http://localhost:5173

## Scripts útiles

- `npm run dev`: inicia desarrollo.
- `npm run build`: compila para producción.
- `npm run preview`: previsualiza la build.
- `npm run lint`: ejecuta reglas de calidad.

## Solución rápida de problemas

### Pantalla en blanco por Service Worker

1. Abre DevTools (F12).
2. Ve a Application > Service Workers.
3. Pulsa Unregister para localhost:5173.
4. Recarga con Ctrl + F5.

### Cambié `.env.local` y no se refleja

Detén y vuelve a iniciar `npm run dev`.

## Estructura del frontend (resumen)

- `src/app`: shell, rutas y utilidades globales.
- `src/pages`: pantallas principales.
- `src/components/layout`: estructuras de pantalla reutilizables.
- `src/components/ui`: componentes visuales reutilizables.
- `src/hooks`: hooks compartidos.
- `src/services`: API, auth y almacenamiento local.
- `src/validation`: esquemas y reglas de validación.
- `src/styles`: estilos globales y tema.
- `src/assets`: recursos estáticos.
