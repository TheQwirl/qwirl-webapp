import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `experimental: {
  //   typedRoutes: true,
  // },`
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
      {
        // https://i.pravatar.cc
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
