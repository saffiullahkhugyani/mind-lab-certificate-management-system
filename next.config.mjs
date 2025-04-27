/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['hqxhavqdfifdsorruiqp.supabase.co'],
    },
    experimental: {
        serverActions: true,
    },
};

export default nextConfig;
