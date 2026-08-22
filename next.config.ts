import type { NextConfig } from "next";

// Export statique : le dossier /out se dépose tel quel sur IONOS.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
