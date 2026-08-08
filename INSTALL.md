# Rify Luxe full working app code

This package uses the `src/app` Next.js structure.

- `/` remains the customer storefront.
- `/admin` opens the admin workspace.
- The admin imports resolve from `src/app/admin/page.tsx`.
- The browser and installed-app icon is `public/rify-icon.svg`.

Copy `src` and `public/rify-icon.svg` into the root of your existing project.
Keep your existing `package.json`, `prisma`, `src/lib`, `src/components`, and
environment files.

Install the UI dependencies if they are missing:

```powershell
npm install framer-motion lucide-react react-hot-toast react-icons
```

Then clear the Next.js cache and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```
