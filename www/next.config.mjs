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
    ],
  },
};

export default nextConfig;
