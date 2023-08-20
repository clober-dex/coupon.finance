const IS_MAINNET = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'master'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  env: {
    IS_MAINNET,
    CLOBER_SUBGRAPH_ENDPOINT: IS_MAINNET
      ? 'https://api.studio.thegraph.com/query/49804/core-v1-subgraph/version/latest'
      : 'http://dev-subgraph.coupon.finance/subgraphs/name/core-v1-subgraph',
  },
}

module.exports = nextConfig
