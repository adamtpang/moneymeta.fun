/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/income", destination: "/", permanent: true },
      { source: "/career", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
