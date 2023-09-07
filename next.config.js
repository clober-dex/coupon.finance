const BUILD =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF !== 'master' ? 'dev' : 'prod'
const SUBGRAPH_URL =
  BUILD === 'dev'
    ? 'https://dev-subgraph.coupon.finance/subgraphs/name/coupon-subgraph'
    : 'https://testnet-subgraph.coupon.finance/subgraphs/name/coupon-subgraph'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  env: {
    BUILD,
    SUBGRAPH_URL,
  },
}

module.exports = nextConfig
