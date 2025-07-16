/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true, // ✅ 关闭图像优化，支持静态导出
    },
  }
  
  module.exports = nextConfig
  