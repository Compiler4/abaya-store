/** @type {import('next').NextConfig} */
const pageNoStoreHeaders = [
  {
    key: "Cache-Control",
    value: "no-store, max-age=0, must-revalidate",
  },
];

const noStorePageRoutes = [
  "/",
  "/about",
  "/contact",
  "/products",
  "/product/:id",
  "/login",
  "/register",
  "/cart",
  "/orders",
  "/checkout",
  "/dashboard",
  "/admin",
  "/admin/:path*",
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      ...noStorePageRoutes.map((source) => ({
        source,
        headers: pageNoStoreHeaders,
      })),
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
