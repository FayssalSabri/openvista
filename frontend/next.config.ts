import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['nebula-catnip-obtain.ngrok-free.dev', '*.ngrok-free.app', '*.colab.googleusercontent.com', '*.colab.dev'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

export default nextConfig;
