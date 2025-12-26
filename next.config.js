/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = "3d_product";

const nextConfig = {             
  output: "export",// static HTML export
  basePath: isProd ? `/${repoName}` : '', // prefix all routes
  assetPrefix: isProd ? `/${repoName}/` : '', // prefix _next/static assets
  
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
