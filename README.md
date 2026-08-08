<<<<<<< HEAD
<<<<<<< HEAD
# abaya-store
e-cormmerce system for abaya
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> ba9db5a (Initial commit from Create Next App)
=======
# Rify Luxe Abaya

Rify Luxe Abaya is a responsive e-commerce application built with Next.js 16,
React 19, TypeScript, Prisma 5 and PostgreSQL. It includes the public store,
authentication, customer dashboard, shopping cart, orders and an admin panel.

## Requirements

- Node.js 20 or newer
- npm
- A PostgreSQL database, such as Neon

## Local setup on Windows

Open PowerShell in the folder that contains `package.json`, then run:

```powershell
npm install
Copy-Item .env.example .env.local
```

Open `.env.local` and provide the real database and authentication values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require&connect_timeout=30"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
```

Create the tables and seed only the administrator:

```powershell
npm run db:setup
```

Start development:

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Login setup and troubleshooting

Before the first login, make sure `.env.local` contains active `DATABASE_URL`
and `JWT_SECRET` values, then create the database tables and administrator:

```powershell
npm run db:setup
npm run dev:fresh
```

The login page now shows a specific error code instead of a generic server
error:

- `AUTH_CONFIGURATION_ERROR`: add `JWT_SECRET` and restart the app.
- `DATABASE_NOT_READY`: run `npm run db:setup` once.
- `DATABASE_CONFIGURATION_ERROR`: replace invalid Neon credentials.
- `DATABASE_UNAVAILABLE`: activate the Neon database and verify `DATABASE_URL`.
- `INVALID_CREDENTIALS`: the email or password is incorrect.

The browser warning `Permissions policy violation: unload is not allowed` is
created by a browser extension or embedded preview script. The application has
no `unload` event handler, and this warning does not block authentication.

The project automatically runs `prisma generate` after `npm install`, before
`npm run dev`, and before every production build. This prevents the missing
`.prisma/client/default` and missing `PrismaClient` export errors.

If an old `.next` cache remains after replacing project files, use:

```powershell
npm run dev:fresh
```

## Administrator seed

The seed creates or updates only this administrator:

- Email: `admin@abaya.com`
- Initial password: `123456`
- Role: `ADMIN`

Change the initial password after the first successful sign-in.

## Production verification

```powershell
npm run build
npm start
```

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel as a Next.js project.
3. Add `DATABASE_URL`, `DIRECT_URL` and `JWT_SECRET` under Project Settings →
   Environment Variables.
4. Keep the default install command `npm install` and build command
   `npm run build`.
5. Deploy the project.
6. Run `npm run db:setup` locally against the same production database once,
   or run the database setup from a trusted deployment environment.

Do not commit `.env` or `.env.local`. The included `.env.example` contains only
safe placeholders.
>>>>>>> 2090a59 (new changes)
