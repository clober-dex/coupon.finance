const BUILD =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF !== 'master' ? 'dev' : 'prod'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  env: {
    BUILD,
    CLOBER_SUBGRAPH_ENDPOINT:
      BUILD === 'dev'
        ? 'http://dev-subgraph.coupon.finance/subgraphs/name/core-v1-subgraph'
        : 'https://api.studio.thegraph.com/query/49804/core-v1-subgraph/version/latest',
  },
}

module.exports = nextConfig
