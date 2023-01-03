/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
