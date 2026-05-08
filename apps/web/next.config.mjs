/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@klyrn/types", "@klyrn/sdk"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
