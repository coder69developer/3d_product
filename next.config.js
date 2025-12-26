/** @type {import('next').NextConfig} */
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',             // static HTML export
  basePath: repoName, // prefix all routes
  assetPrefix: repoName, // prefix _next/static assets
  
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
