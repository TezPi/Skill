import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sample project covers. Replace with local shots in /public/work and remove these.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
