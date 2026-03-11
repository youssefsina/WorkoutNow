/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.exercisedb.io" },
      { protocol: "https", hostname: "**.exercisedb.dev" },
      { protocol: "https", hostname: "cdn.exercisedb.dev" },
      { protocol: "https", hostname: "**.rapidapi.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["jsonwebtoken"],
  },
};

module.exports = nextConfig;
