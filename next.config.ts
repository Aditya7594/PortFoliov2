import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'export',
  basePath: '/MyPortFolio',
  images: {
    unoptimized: true,
  },
}

export default config