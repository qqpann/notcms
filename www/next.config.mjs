/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.notcms.com",
        port: "",
        pathname: "/v1/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8787",
        pathname: "/v1/**",
      },
    ],
  },
};

export default nextConfig;
