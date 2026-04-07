import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || "256755888945",
    NEXT_PUBLIC_SELLER_NAME: process.env.SELLER_NAME || "Saviour Mechatronics",
  },
};

export default nextConfig;
