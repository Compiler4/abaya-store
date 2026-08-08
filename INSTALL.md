# Install And Run

This folder is the full working Rify Luxe Abaya project. Upload the whole
project to hosting, excluding `node_modules`, `.next`, `.git`, `.env`, and local
cache files.

## Local Development

```powershell
npm install
Copy-Item .env.example .env.local
npm run db:setup
npm run dev
```

## Production Build

```powershell
npm run lint
npm run build
npm start
```

## Production Database

Use PostgreSQL. Add the production `DATABASE_URL` and `JWT_SECRET` first, then
run:

```powershell
npm run db:deploy
npm run db:seed
```

`db:seed` creates only the first admin user:

- Email: `admin@abaya.com`
- Password: `123456`

## Hostinger

Follow `HOSTINGER_DEPLOYMENT.md` for the full Hostinger upload and domain
procedure.
