/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← Vercel 빌드시 ESLint 오류 무시
  },
};

export default nextConfig;
