# Hostinger Deployment Guide

This project is a server-side Next.js app with Prisma and PostgreSQL. Use
Hostinger Node.js Web App hosting, not static file hosting.

## 1. Buy Hosting And Domain

1. Buy a Hostinger plan that supports Node.js Web Apps.
2. In hPanel, go to `Domains`.
3. Search for your domain name.
4. Add the available domain to cart and complete payment.
5. Finish domain registration and verify the registration email.
6. Assign the domain to the same Hostinger website where the Node.js app will
   run.

Hostinger domain guide:
https://www.hostinger.com/support/1583421-how-to-purchase-a-domain-name-at-hostinger/

Hostinger Node.js app guide:
https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

## 2. Prepare PostgreSQL

This app uses Prisma with PostgreSQL. Create a PostgreSQL database using Neon,
Supabase, or another PostgreSQL provider.

Keep these values ready:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require&connect_timeout=30"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Use the pooled connection string for `DATABASE_URL` when your provider gives
one. Use the direct connection string for `DIRECT_URL` if available.

## 3. Prepare Image Upload

Create a Cloudinary account and copy:

```env
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

These are required for product image uploads from the admin dashboard.

## 4. Upload The Project ZIP

In hPanel:

1. Go to `Websites`.
2. Click `Add Website`.
3. Choose `Deploy Web App`.
4. Choose `Upload your website files`.
5. Upload the deployment ZIP.
6. Confirm the project root is the folder containing `package.json`.

The ZIP should include source code and `package-lock.json`. It should not
include `node_modules`, `.next`, `.git`, `.env`, `.env.local`, or `dev.db`.

## 5. Build Settings

Use these settings if Hostinger does not detect them automatically:

```text
Framework: Next.js
Node.js version: 20, 22, or 24
Package manager: npm
Install command: npm install
Build command: npm run build
Start command: npm start
Output directory: .next
```

## 6. Environment Variables

Add these in Hostinger during app setup or in the app dashboard:

```env
DATABASE_URL="your-production-postgresql-url"
DIRECT_URL="your-production-direct-postgresql-url"
JWT_SECRET="a-long-random-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
EMAIL="your-email@example.com"
EMAIL_PASS="your-email-app-password"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

Generate a strong `JWT_SECRET`, for example 32+ random characters.

## 7. Deploy

1. Click `Deploy`.
2. Wait for Hostinger to install dependencies and run the build.
3. Open the temporary app URL first.
4. If it loads correctly, open the final domain.

## 8. Create Tables And Admin

After deployment, run the database commands once from a trusted terminal that
has the same production environment variables:

```powershell
npm run db:deploy
npm run db:seed
```

If Hostinger does not expose a terminal for the Node.js app, run those commands
locally from this project after setting `.env.local` to the production database
connection.

## 9. Verify The Website

Check:

- Home page loads.
- Product page loads.
- Login works.
- Customer dashboard opens.
- Admin login works with `admin@abaya.com`.
- Admin product upload succeeds.
- Orders and cart records save into the production database.

After the first login, change the admin password from the database or your admin
user management flow.
