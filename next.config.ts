import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_PAGES === "true" ? "/kmong-225526-demo" : "",
};

export default nextConfig;
