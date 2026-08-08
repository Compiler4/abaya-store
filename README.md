# Rify Luxe Abaya

Rify Luxe Abaya is a production-ready e-commerce website built with Next.js 16,
React 19, TypeScript, Prisma 5, and PostgreSQL. It includes the public store,
login, customer dashboard, cart, orders, product upload, contact messages, and a
modern admin workspace.

The seed file creates only the first administrator account. Products, customers,
orders, carts, messages, and uploaded images are real application data created
through the website and admin dashboard.

## Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL database connection string
- Cloudinary account for product image upload
- Email account/app password if you want outgoing email features

## Environment Variables

Copy `.env.example` to `.env.local` for local development, or add the same
variables in your hosting dashboard for production:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require&connect_timeout=30"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
EMAIL="your-email@example.com"
EMAIL_PASS="your-email-app-password"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

Never upload or commit `.env` or `.env.local`.

## Local Setup

Open PowerShell in the folder that contains `package.json`, then run:

```powershell
npm install
Copy-Item .env.example .env.local
```

Fill `.env.local`, then create the production tables and seed the first admin:

```powershell
npm run db:setup
npm run dev
```

Open `http://localhost:3000`.

## Admin Login

- Email: `admin@abaya.com`
- Initial password: `123456`

Change the password after the first successful sign-in.

## Production Commands

```powershell
npm run lint
npm run build
npm start
```

Database setup for production:

```powershell
npm run db:deploy
npm run db:seed
```

`db:deploy` creates/updates the PostgreSQL tables with Prisma. `db:seed` creates
only the first admin account.

## Hostinger Deployment

Use `HOSTINGER_DEPLOYMENT.md` in this project for the full upload, environment,
domain, database, and verification procedure.

Recommended Hostinger settings:

- App type/framework: Next.js
- Node version: 20, 22, or 24
- Package manager: npm
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Output directory: `.next`

## Troubleshooting

If login fails after moving the project, check `DATABASE_URL` and `JWT_SECRET`,
then run:

```powershell
npm run db:setup
npm run dev:fresh
```

If old build artifacts cause strange errors, clear the local cache:

```powershell
npm run dev:fresh
```
