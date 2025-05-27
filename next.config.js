/** @type {import('next').NextConfig} */
const repo = 'PortFoliov2'; // GitHub repo name
const config = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
}

module.exports = config; 