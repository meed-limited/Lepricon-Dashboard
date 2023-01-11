/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST" },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
                    },
                    { key: "Content-Type", value: "application/json; charset=utf-8" },
                ],
            },
        ];
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cloudflare-ipfs.com",
                port: "",
            },
        ],
    },
};

module.exports = nextConfig;
