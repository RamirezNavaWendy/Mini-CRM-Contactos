# Mini CRM de Contactos

Aplicación web para la gestión de contactos con funcionalidades de búsqueda, filtrado, historial de estados y exportación de datos. Desarrollada con tecnologías modernas y desplegada en Vercel.

---

## Tecnologías utilizadas

- **Next.js 13+** → Framework React para aplicaciones fullstack con soporte para rutas API.
- **TypeScript** → Tipado estático para mayor seguridad y mantenibilidad del código.
- **Prisma ORM** → Acceso a base de datos PostgreSQL con migraciones y cliente tipado.
- **PostgreSQL (Neon)** → Base de datos relacional en la nube.
- **Tailwind CSS** → Framework de estilos utilitario para diseño responsivo y moderno.
- **Vercel** → Plataforma de despliegue serverless para frontend y backend.

---

## Instalación local

1. **Clonar el repositorio**
git clone https://github.com/RamirezNavaWendy/Mini-CRM-Contactos.git
cd Mini-CRM-Contactos
2. **Instalar dependencias**
npm install
3. **Configurar variables de entorno**
crear un archivo .env.local en la raíz del proyecto con el siguiente contenido:
POSTGRES_PRISMA_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos?sslmode=require
4. **Generar el cliente de Prisma**
npx prisma generate
5. **Ejecutar el proyecto en modo desarrollo**
npm run dev
Accede a http://localhost:3000 para ver la aplicación.

## Despliegue en Vercel

1. **Configurar en Vercel:**

Variable de entorno POSTGRES_PRISMA_URL en Production.

Script postinstall en package.json:

json
"scripts": {
  "postinstall": "prisma generate"
}

2. **Hacer commit y push**
git add .
git commit -m "deploy: configuración prisma y entorno"
git push origin main

3. **Redeploy en Vercel y validar logs:**
Running postinstall script: prisma generate
Prisma Client generated successfully

## Estructura del proyecto:
mini-crm-contactos/
├── app/                  # Rutas y páginas (Next.js App Router)
│   └── api/              # Endpoints backend (GET, POST, etc.)
├── prisma/               # Esquema y migraciones de Prisma
├── lib/                  # Cliente Prisma y utilidades
├── public/               # Archivos estáticos
├── styles/               # Estilos globales
├── package.json          # Scripts y dependencias
└── README.md             # Documentación del proyecto

## Funcionalidades principales
Crear, editar y eliminar contactos

Filtrar por nombre, correo y estado

Historial de cambios de estado

Exportar contactos a CSV

Interfaz responsiva para escritorio y móvil





