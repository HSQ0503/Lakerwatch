import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./lib/generated/prisma/*.{so.node,dll,dylib.node}"],
  },
};

export default nextConfig;
