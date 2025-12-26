/** @type {import('next').NextConfig} */
const repoName = process.env.NODE_ENV === 'production' ? '/3d_product': '';

const nextConfig = {
  output: 'export',             // static HTML export
  basePath: repoName, // prefix all routes
  assetPrefix: repoName, // prefix _next/static assets
  
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
