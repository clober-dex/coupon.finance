import { expect } from '@jest/globals'

import { fetchOrderBooks } from '../api/clober'

describe('Clober Dex subgraph test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('Mainnet', async () => {
    process.env.CLOBER_SUBGRAPH_ENDPOINT =
      'https://api.studio.thegraph.com/query/49804/core-v1-subgraph/version/latest'
    const orderbooks = await fetchOrderBooks()
    expect(orderbooks.length).toBeGreaterThan(0)
  })

  it('Testnet', async () => {
    process.env.CLOBER_SUBGRAPH_ENDPOINT =
      'http://dev-subgraph.coupon.finance/subgraphs/name/core-v1-subgraph'
    const orderbooks = await fetchOrderBooks()
    expect(orderbooks.length).toBeGreaterThan(0)
  })
})
