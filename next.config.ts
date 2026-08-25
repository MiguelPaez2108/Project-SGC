import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Todas las rutas devuelven headers de geolocalización para el bundle ASUS
        source: "/:path*",
        headers: [
          { key: "website_code", value: "global" },
          { key: "country_code", value: "global" },
        ],
      },
    ];
  },
};

export default nextConfig;

