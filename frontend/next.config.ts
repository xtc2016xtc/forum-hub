/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    experimental: {
        optimizeCss: true,  // 启用 CSS 优化
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    },
}

export default nextConfig