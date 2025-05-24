import type { NextConfig } from 'next'

const repo = 'PortFoliov2'; // GitHub repo name
const config: NextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
}

export default config