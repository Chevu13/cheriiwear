import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Source photos are Instagram-resolution, so keep compression light.
    qualities: [85],
  },
};

export default config;
