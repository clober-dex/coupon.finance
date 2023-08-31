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

const MARKER_ADDRESS = '0xca4c669093572c5a23de04b848a7f706ecbdfac2'

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
        marketAddress: MARKER_ADDRESS,
      },
      {
        url: 'https://api.studio.thegraph.com/query/49804/core-v1-subgraph/v0.0.2',
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
            jsonRpcUrl: 'https://arbitrum-one-archive.allthatnode.com',
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
      tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      faucetAmount: 10n ** 6n * 10000n,
      from: '0xf89d7b9c864f589bbF53a82105107622B35EaA40',
      to: admin.address,
    })

    await faucet({
      tokenAddress: '0x5fE5A66c84c6F8c213503A04f95a417AC6684361',
      faucetAmount: 10n ** 18n * 100000000n,
      from: '0x62e5E8D25c88D9c4b67f09c46D96C9ECD3864757',
      to: admin.address,
    })

    return {
      admin,
      CloberOrderBook: CloberOrderBook,
      CloberRouter: CloberRouter__factory.connect(
        '0xB4be941716d4d27147D5A4d82801897877CA5906',
        admin,
      ),
      baseToken,
      quoteToken,
    }
  }

  it(
    'check expected amount out for market ask',
    async () => {
      const amountIn = 10n ** 18n * 1000000n
      const blockNumber = 119621067
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
      const { amountOut: expectedAmountOut } = orderBookState.swap(
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
      const amountIn = 10n ** 6n * 10000n
      const blockNumber = 119621067
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
      const { amountOut: expectedAmountOut } = orderBookState.swap(
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
      const amountIn = 10n ** 18n * 1000000000n
      const expectedAmountOut = 100n
      const blockNumber = 119621067
      const { admin, CloberRouter, baseToken } = await setUp({
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
      const { amountIn: expectedAmountIn } = orderBookState.take(
        orderBookState.baseToken.address,
        expectedAmountOut,
      )

      expect(actualAmountIn.toString()).toEqual(expectedAmountIn.toString())
    },
    TIME_OUT,
  )
})
