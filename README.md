# Jocs IO

Plataforma web de juegos creada con Next.js, App Router, TypeScript y Tailwind CSS. Esta primera fase incluye autenticacion simple, rutas protegidas y paginas base para desplegar en Render.

## Requisitos

- Node.js 20 o superior.
- npm.

En Windows PowerShell, si `npm` esta bloqueado por la politica de scripts, usa `npm.cmd`.

## Instalacion

```bash
npm install
```

Copia las variables de entorno:

```bash
cp .env.example .env.local
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edita `.env.local`:

```env
APP_USERNAME=admin
APP_PASSWORD=una-contrasena-segura
```

## Ejecutar local

```bash
npm run dev
```

Abre `http://localhost:3000` e inicia sesion con las variables configuradas.

Si el puerto 3000 esta ocupado:

```bash
npm run dev -- --port 3001
```

Abre `http://localhost:3001`.

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Subir a GitHub

Inicializa Git y crea el primer commit:

```bash
git init
git add .
git commit -m "Initial Next.js platform"
```

Crea un repositorio vacio en GitHub y conecta el remoto:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

No subas `.env.local`; ya esta incluido en `.gitignore`.

## Desplegar en Render

1. En Render, crea un nuevo **Web Service**.
2. Conecta el repositorio de GitHub.
3. Configura:
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Anade las variables de entorno:
   - `APP_USERNAME`
   - `APP_PASSWORD`
   - `NODE_ENV=production`
5. Despliega el servicio.

Render asignara una URL publica. Todas las rutas excepto `/login` quedaran protegidas por cookie de sesion.
