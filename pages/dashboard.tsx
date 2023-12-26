import React from 'react'
import { useQuery } from 'wagmi'
import { isAddressEqual } from 'viem'

import { fetchMarkets } from '../apis/market'
import { useChainContext } from '../contexts/chain-context'
import { useCurrencyContext } from '../contexts/currency-context'
import { MAX_VISIBLE_MARKETS } from '../utils/market'
import { formatDate } from '../utils/date'
import { fetchBondPositions } from '../apis/bond-position'
import { max, min } from '../utils/bigint'
import { formatUnits } from '../utils/numbers'

const Dashboard = () => {
  const { selectedChain } = useChainContext()
  const { epochs, assets, prices } = useCurrencyContext()

  const {
    data: { markets, availableCouponInAsks },
  } = useQuery(
    ['dashboard-markets', selectedChain],
    async () => {
      const markets = await fetchMarkets(selectedChain.id)
      return {
        markets,
        availableCouponInAsks: markets.reduce((acc, market) => {
          const filteredMarkets = markets
            .filter((m) =>
              isAddressEqual(m.quoteToken.address, market.quoteToken.address),
            )
            .filter((m) => m.epoch <= market.epoch)
          const availableCoupons = min(
            ...filteredMarkets.map((market) =>
              market.totalAsksInBaseAfterFees(),
            ),
          )
          const available = max(
            availableCoupons -
              filteredMarkets.reduce(
                (acc, market) =>
                  acc +
                  market.take(market.quoteToken.address, availableCoupons)
                    .amountIn,
                0n,
              ),
            0n,
          )
          acc[market.quoteToken.address] = {
            ...acc[market.quoteToken.address],
            [market.epoch]: available,
          }
          return acc
        }, {} as Record<`0x${string}`, Record<number, bigint>>),
      }
    },
    {
      initialData: {
        availableCouponInAsks: {},
        markets: [],
      },
      refetchInterval: 10 * 1000,
      refetchIntervalInBackground: true,
    },
  )

  const { data: withdrawAvailableBondPositions } = useQuery(
    ['dashboard-withdraw-available-bond-positions', selectedChain, markets],
    async () => {
      const bondPositions = await fetchBondPositions(selectedChain.id)
      return markets.reduce((acc, market) => {
        const filteredMarkets = markets
          .filter((m) =>
            isAddressEqual(m.quoteToken.address, market.quoteToken.address),
          )
          .filter((m) => m.epoch <= market.epoch)
        const filteredBondPositions = bondPositions.filter((bondPosition) =>
          isAddressEqual(
            bondPosition.substitute.address,
            market.quoteToken.address,
          ),
        )
        acc[market.quoteToken.address] = {
          ...acc[market.quoteToken.address],
          [market.epoch]: filteredBondPositions.reduce((acc, bondPosition) => {
            const maxRepurchaseFee = filteredMarkets.reduce(
              (acc, market) =>
                acc +
                market.take(market.quoteToken.address, bondPosition.amount)
                  .amountIn,
              0n,
            )
            return max(acc, bondPosition.amount + maxRepurchaseFee)
          }, 0n),
        }
        return acc
      }, {} as Record<`0x${string}`, Record<number, bigint>>)
    },
    {
      initialData: {},
    },
  )

  const { data: borrowAvailable } = useQuery(
    ['dashboard-borrow-available', selectedChain, markets],
    async () => {
      return markets.reduce((acc, market) => {
        const filteredMarkets = markets
          .filter((m) =>
            isAddressEqual(m.quoteToken.address, market.quoteToken.address),
          )
          .filter((m) => m.epoch <= market.epoch)
        const available =
          availableCouponInAsks[market.quoteToken.address]?.[market.epoch] ?? 0n
        const maxInterest = filteredMarkets.reduce(
          (acc, market) =>
            acc + market.take(market.quoteToken.address, available).amountIn,
          0n,
        )
        acc[market.quoteToken.address] = {
          ...acc[market.quoteToken.address],
          [market.epoch]: available - maxInterest,
        }
        return acc
      }, {} as Record<`0x${string}`, Record<number, bigint>>)
    },
    {
      initialData: {},
    },
  )

  return (
    <div className="flex flex-1 flex-col w-full">
      <h1 className="flex justify-center text-center font-bold text-3xl sm:text-5xl sm:leading-[48px] mt-8 sm:mt-16 mb-8 sm:mb-16">
        Dashboard
      </h1>
      <div className="flex flex-col gap-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-8 text-gray-900">
                Current available coupon / Maximum withdrawable amount
              </h1>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Asset
                        </th>
                        {epochs.slice(0, MAX_VISIBLE_MARKETS).map((epoch) => (
                          <th
                            key={epoch.id}
                            scope="col"
                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                          >
                            Epoch {epoch.id} <br /> (
                            {formatDate(
                              new Date(Number(epoch.endTimestamp) * 1000),
                            )}
                            )
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {assets.map((asset) => (
                        <tr key={asset.underlying.address}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                            {asset.underlying.symbol}
                          </td>
                          {availableCouponInAsks &&
                            epochs
                              .slice(0, MAX_VISIBLE_MARKETS)
                              .map((epoch) => {
                                const currentAvailableCoupon =
                                  availableCouponInAsks[
                                    asset.substitutes[0].address
                                  ]?.[epoch.id] ?? 0n
                                const totalNeededCoupon =
                                  withdrawAvailableBondPositions[
                                    asset.substitutes[0].address
                                  ]?.[epoch.id] ?? 0n
                                return (
                                  <td
                                    key={`${asset.underlying.address}-${epoch.id}`}
                                    className={`whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500 ${
                                      Number(currentAvailableCoupon) <
                                      Number(totalNeededCoupon)
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                    }`}
                                  >
                                    {formatUnits(
                                      currentAvailableCoupon,
                                      asset.underlying.decimals,
                                      prices[asset.underlying.address],
                                    )}{' '}
                                    /{' '}
                                    {formatUnits(
                                      totalNeededCoupon,
                                      asset.underlying.decimals,
                                      prices[asset.underlying.address],
                                    )}
                                  </td>
                                )
                              })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold leading-8 text-gray-900">
                Maximum borrowable amount
              </h1>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Asset
                        </th>
                        {epochs.slice(0, MAX_VISIBLE_MARKETS).map((epoch) => (
                          <th
                            key={epoch.id}
                            scope="col"
                            className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                          >
                            Epoch {epoch.id} <br /> (
                            {formatDate(
                              new Date(Number(epoch.endTimestamp) * 1000),
                            )}
                            )
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {assets.map((asset) => (
                        <tr key={asset.underlying.address}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                            {asset.underlying.symbol}
                          </td>
                          {epochs.slice(0, MAX_VISIBLE_MARKETS).map((epoch) => {
                            const totalBorrowable =
                              borrowAvailable[asset.substitutes[0].address]?.[
                                epoch.id
                              ] ?? 0n
                            return (
                              <td
                                key={`${asset.underlying.address}-${epoch.id}`}
                                className={`whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500`}
                              >
                                {formatUnits(
                                  totalBorrowable,
                                  asset.underlying.decimals,
                                  prices[asset.underlying.address],
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
