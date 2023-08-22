import hre from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { getAddress } from 'viem'
import { BigNumber } from 'ethers'

import { getBuiltGraphSDK } from '../.graphclient'
import {
  CloberRouter,
  CloberOrderBook,
  CloberOrderBook__factory,
  CloberRouter__factory,
  IERC20__factory,
  IERC20,
} from '../typechain'
import { Market } from '../api/market'

const { OrderBookFork } = getBuiltGraphSDK()

const TWO = BigNumber.from(2)
const TEN = BigNumber.from(10)
const TIME_OUT = 1000 * 10000
const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1)

const MARKER_ADDRESS = '0xca4c669093572c5a23de04b848a7f706ecbdfac2'

type Contracts = {
  admin: SignerWithAddress
  CloberOrderBook: CloberOrderBook
  CloberRouter: CloberRouter
  baseToken: IERC20
  quoteToken: IERC20
}

describe('Unit test for deposit controller', () => {
  const fetchOrderBookState = async ({
    blockNumber,
  }: {
    blockNumber: number
  }): Promise<Market> => {
    const { markets } = await OrderBookFork(
      {
        blockNumber,
        marketAddress: MARKER_ADDRESS,
      },
      {
        url: 'https://api.studio.thegraph.com/query/49804/core-v1-subgraph/v0.0.2',
      },
    )
    const market = markets[0]
    return new Market({
      address: getAddress(market.id),
      orderToken: getAddress(market.orderToken),
      a: market.a,
      r: market.r,
      d: market.d,
      takerFee: market.takerFee,
      makerFee: market.makerFee,
      quoteUnit: market.quoteUnit,
      quoteToken: {
        address: getAddress(market.quoteToken.id),
        name: market.quoteToken.name,
        symbol: market.quoteToken.symbol,
        decimals: market.quoteToken.decimals,
        logo: `/assets/icons/icon-${market.quoteToken.symbol.toLowerCase()}.svg`,
      },
      baseToken: {
        address: getAddress(market.baseToken.id),
        name: market.baseToken.name,
        symbol: market.baseToken.symbol,
        decimals: market.baseToken.decimals,
        logo: `/assets/icons/icon-${market.baseToken.symbol.toLowerCase()}.svg`,
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
    faucetAmount: BigNumber
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

    expect(await baseToken.balanceOf(admin.address)).toEqual(BigNumber.from(0))
    expect(await quoteToken.balanceOf(admin.address)).toEqual(BigNumber.from(0))
    await faucet({
      tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      faucetAmount: TEN.pow(6).mul(10000),
      from: '0xf89d7b9c864f589bbF53a82105107622B35EaA40',
      to: admin.address,
    })

    await faucet({
      tokenAddress: '0x5fE5A66c84c6F8c213503A04f95a417AC6684361',
      faucetAmount: TEN.pow(18).mul(100000000),
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
      const amountIn = TEN.pow(18).mul(1000000)
      const blockNumber = 119621067
      const { admin, CloberRouter, baseToken, quoteToken } = await setUp({
        blockNumber,
      })
      await baseToken.approve(CloberRouter.address, MAX_UINT256)

      const beforeAmount = await quoteToken.balanceOf(admin.address)
      await CloberRouter.marketAsk({
        market: MARKER_ADDRESS,
        deadline: TWO.pow(64).sub(1),
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
      const expectedAmountOut = orderBookState.swap({
        tokenIn: orderBookState.baseToken.address,
        amountIn,
      })

      expect(actualAmountOut.toString()).toEqual(expectedAmountOut.toString())
    },
    TIME_OUT,
  )

  it(
    'check expected amount out for market bid',
    async () => {
      const amountIn = TEN.pow(6).mul(10000)
      const blockNumber = 119621067
      const { admin, CloberRouter, baseToken, quoteToken } = await setUp({
        blockNumber,
      })
      await quoteToken.approve(CloberRouter.address, MAX_UINT256)

      const beforeAmount = await baseToken.balanceOf(admin.address)
      await CloberRouter.marketBid({
        market: MARKER_ADDRESS,
        deadline: TWO.pow(64).sub(1),
        user: admin.address,
        limitPriceIndex: BigNumber.from(65535),
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
      const expectedAmountOut = orderBookState.swap({
        tokenIn: orderBookState.quoteToken.address,
        amountIn,
      })

      expect(actualAmountOut.toString()).toEqual(expectedAmountOut.toString())
    },
    TIME_OUT,
  )
})
