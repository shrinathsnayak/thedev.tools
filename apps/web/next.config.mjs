/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    cssChunking: true,
  },
  transpilePackages: ["@workspace/utilities", "@workspace/ui"],
  env: {
    NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.VERCEL_GIT_COMMIT_REF ||
      "local",
  },
};

export default nextConfig;
