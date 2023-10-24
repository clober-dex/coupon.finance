import hre from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../.graphclient'
import {
  CloberRouter,
  CloberOrderBook,
  CloberOrderBook__factory,
  CloberRouter__factory,
  IERC20__factory,
  IERC20,
} from '../typechain'
import { Market } from '../model/market'

const { getMarketsWithFork } = getBuiltGraphSDK()

const TIME_OUT = 1000 * 10000
const MAX_UINT256 = 2n ** 256n - 1n

const MARKER_ADDRESS = '0xFB8B6DE103B74b6F0517806D47F8f9B40E67a735'

type Contracts = {
  admin: SignerWithAddress
  CloberOrderBook: CloberOrderBook
  CloberRouter: CloberRouter
  baseToken: IERC20
  quoteToken: IERC20
}

describe('Market Orders', () => {
  const fetchOrderBookState = async ({
    blockNumber,
  }: {
    blockNumber: number
  }): Promise<Market> => {
    const { markets } = await getMarketsWithFork(
      {
        blockNumber,
        marketAddress: MARKER_ADDRESS.toLowerCase(),
      },
      {
        url: 'https://api.studio.thegraph.com/query/51933/coupon-subgraph-testnet/v0.0.3',
      },
    )
    const market = markets[0]
    return Market.fromDto({
      address: getAddress(market.id),
      orderToken: getAddress(market.orderToken),
      takerFee: market.takerFee,
      quoteUnit: market.quoteUnit,
      epoch: {
        id: '0',
        startTimestamp: '0',
        endTimestamp: '0',
      },
      quoteToken: {
        address: getAddress(market.quoteToken.id),
        name: market.quoteToken.name,
        symbol: market.quoteToken.symbol,
        decimals: market.quoteToken.decimals,
      },
      baseToken: {
        address: getAddress(market.baseToken.id),
        name: market.baseToken.name,
        symbol: market.baseToken.symbol,
        decimals: market.baseToken.decimals,
      },
      depths: market.depths.map((depth) => ({
        price: depth.price,
        rawAmount: depth.rawAmount,
        isBid: depth.isBid,
      })),
    })
  }

  const faucet = async ({
    tokenAddress,
    faucetAmount,
    from,
    to,
  }: {
    tokenAddress: string
    faucetAmount: bigint
    from: string
    to: string
  }): Promise<void> => {
    await hre.network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [from],
    })
    const signer = await hre.ethers.getSigner(from)
    const tokenContract = IERC20__factory.connect(tokenAddress, signer)
    await tokenContract.transfer(to, faucetAmount.toString())
    expect((await tokenContract.balanceOf(to)).toString()).toEqual(
      faucetAmount.toString(),
    )
  }

  const setUp = async ({
    blockNumber,
  }: {
    blockNumber: number
  }): Promise<Contracts> => {
    await hre.network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl: 'https://arbitrum-goerli-archive.allthatnode.com',
            blockNumber,
          },
        },
      ],
    })

    hre.network.provider.emit('hardhatNetworkReset')

    const [admin] = await hre.ethers.getSigners()
    const CloberOrderBook = CloberOrderBook__factory.connect(
      MARKER_ADDRESS,
      admin,
    )
    const [baseTokenAddress, quoteTokenAddress] = await Promise.all([
      CloberOrderBook.baseToken(),
      CloberOrderBook.quoteToken(),
    ])
    const [baseToken, quoteToken] = await Promise.all([
      IERC20__factory.connect(baseTokenAddress, admin),
      IERC20__factory.connect(quoteTokenAddress, admin),
    ])

    expect((await baseToken.balanceOf(admin.address)).toBigInt()).toEqual(0n)
    expect((await quoteToken.balanceOf(admin.address)).toBigInt()).toEqual(0n)
    await faucet({
      tokenAddress: baseTokenAddress,
      faucetAmount: 10n ** 7n,
      from: '0x0F97F07d7473EFB5c846FB2b6c201eC1E316E994',
      to: admin.address,
    })

    await faucet({
      tokenAddress: quoteTokenAddress,
      faucetAmount: 10n ** 8n * 100000n,
      from: '0x0F97F07d7473EFB5c846FB2b6c201eC1E316E994',
      to: admin.address,
    })

    return {
      admin,
      CloberOrderBook: CloberOrderBook,
      CloberRouter: CloberRouter__factory.connect(
        '0xAfc08a225C85A953E1F28ca86b646F307de2d3d8',
        admin,
      ),
      baseToken,
      quoteToken,
    }
  }

  it(
    'check expected amount out for market ask',
    async () => {
      const amountIn = 10n ** 7n
      const blockNumber = 38135906
      const { admin, CloberRouter, baseToken, quoteToken } = await setUp({
        blockNumber,
      })
      await baseToken.approve(CloberRouter.address, MAX_UINT256)

      const beforeAmount = await quoteToken.balanceOf(admin.address)
      await CloberRouter.marketAsk({
        market: MARKER_ADDRESS,
        deadline: 2n ** 64n - 1n,
        user: admin.address,
        limitPriceIndex: 0,
        rawAmount: 0,
        expendInput: true,
        useNative: false,
        baseAmount: amountIn,
      })
      const afterAmount = await quoteToken.balanceOf(admin.address)
      const actualAmountOut = afterAmount.sub(beforeAmount)

      const orderBookState = await fetchOrderBookState({
        blockNumber,
      })
      const { amountOut: expectedAmountOut } = orderBookState.spend(
        orderBookState.baseToken.address,
        amountIn,
      )

      expect(actualAmountOut.toString()).toEqual(expectedAmountOut.toString())
    },
    TIME_OUT,
  )

  it(
    'check expected amount out for market bid',
    async () => {
      const amountIn = 10n ** 8n * 10000n
      const blockNumber = 38135906
      const { admin, CloberRouter, baseToken, quoteToken } = await setUp({
        blockNumber,
      })
      await quoteToken.approve(CloberRouter.address, MAX_UINT256)

      const beforeAmount = await baseToken.balanceOf(admin.address)
      await CloberRouter.marketBid({
        market: MARKER_ADDRESS,
        deadline: 2n ** 64n - 1n,
        user: admin.address,
        limitPriceIndex: 65535n,
        rawAmount: amountIn, // quoteUnit is 1
        expendInput: true,
        useNative: false,
        baseAmount: 0,
      })
      const afterAmount = await baseToken.balanceOf(admin.address)
      const actualAmountOut = afterAmount.sub(beforeAmount)

      const orderBookState = await fetchOrderBookState({
        blockNumber,
      })
      const { amountOut: expectedAmountOut } = orderBookState.spend(
        orderBookState.quoteToken.address,
        amountIn,
      )

      expect(actualAmountOut.toString()).toEqual(expectedAmountOut.toString())
    },
    TIME_OUT,
  )

  it(
    'check expected amount in for market ask',
    async () => {
      const amountIn = 10n ** 7n
      const expectedAmountOut = 10n ** 5n
      const blockNumber = 38135906
      const { admin, CloberOrderBook, CloberRouter, baseToken } = await setUp({
        blockNumber,
      })
      await baseToken.approve(CloberRouter.address, MAX_UINT256)

      const beforeAmount = await baseToken.balanceOf(admin.address)
      await CloberRouter.marketAsk({
        market: MARKER_ADDRESS,
        deadline: 2n ** 64n - 1n,
        user: admin.address,
        limitPriceIndex: 0,
        rawAmount: expectedAmountOut,
        expendInput: false,
        useNative: false,
        baseAmount: amountIn,
      })
      const afterAmount = await baseToken.balanceOf(admin.address)
      const actualAmountIn = beforeAmount.sub(afterAmount)

      const orderBookState = await fetchOrderBookState({
        blockNumber,
      })
      const { amountIn: expectedAmountIn, market } = orderBookState.take(
        orderBookState.baseToken.address,
        expectedAmountOut,
      )

      expect(actualAmountIn.toString()).toEqual(expectedAmountIn.toString())

      const actualPriceIndex = await CloberOrderBook.bestPriceIndex(true)
      expect(
        (await CloberOrderBook.indexToPrice(actualPriceIndex)).toString(),
      ).toEqual(market.bids[0].price.toString())

      const actualDepth = await CloberOrderBook.getDepth(true, actualPriceIndex)
      expect(actualDepth.toString()).toEqual(
        market.bids[0].rawAmount.toString(),
      )
    },
    TIME_OUT,
  )

  it(
    'check expected amount in for market bid',
    async () => {
      const amountIn = 10n ** 8n * 100n
      const expectedAmountOut = 77826804n
      const blockNumber = 38135906
      const { admin, CloberOrderBook, CloberRouter, quoteToken } = await setUp({
        blockNumber,
      })
      await quoteToken.approve(CloberRouter.address, MAX_UINT256)

      const beforeAmount = await quoteToken.balanceOf(admin.address)
      await CloberRouter.marketBid({
        market: MARKER_ADDRESS,
        deadline: 2n ** 64n - 1n,
        user: admin.address,
        limitPriceIndex: 65535n,
        rawAmount: amountIn,
        expendInput: false,
        useNative: false,
        baseAmount: expectedAmountOut,
      })
      const afterAmount = await quoteToken.balanceOf(admin.address)
      const actualAmountIn = beforeAmount.sub(afterAmount)

      const orderBookState = await fetchOrderBookState({
        blockNumber,
      })
      const { amountIn: expectedAmountIn, market } = orderBookState.take(
        orderBookState.quoteToken.address,
        expectedAmountOut,
      )

      expect(actualAmountIn.toString()).toEqual(expectedAmountIn.toString())

      const actualPriceIndex = await CloberOrderBook.bestPriceIndex(true)
      expect(
        (await CloberOrderBook.indexToPrice(actualPriceIndex)).toString(),
      ).toEqual(market.bids[0].price.toString())

      const actualDepth = await CloberOrderBook.getDepth(true, actualPriceIndex)
      expect(actualDepth.toString()).toEqual(
        market.bids[0].rawAmount.toString(),
      )
    },
    TIME_OUT,
  )
})
