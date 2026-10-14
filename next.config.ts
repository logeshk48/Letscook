import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // static hosting has no image server; the webp files are already small
};

export default nextConfig;
