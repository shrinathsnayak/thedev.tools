/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/utilities"],
  env: {
    // Expose Vercel deployment ID (git commit SHA) as a public environment variable
    NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID: process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_REF || "local",
  },
  webpack: (config, { isServer }) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
}

export default nextConfig
