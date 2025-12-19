import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Fix warning about wrong inferred root due to multiple lockfiles outside this project.
    root: __dirname,
  },
};

export default nextConfig;
