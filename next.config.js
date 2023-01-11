/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://app.lepricon.io/:path*",
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
