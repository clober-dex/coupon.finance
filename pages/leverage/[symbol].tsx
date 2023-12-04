import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { isUSDC, useCurrencyContext } from '../../contexts/currency-context'
import BackSvg from '../../components/svg/back-svg'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import { Currency } from '../../model/currency'
import OdosSwapModalContainer from '../../containers/modal/odos-swap-modal-container'
import LeverageFormContainer from '../../containers/form/leverage-form-container'

const LeverageForm = ({
  defaultDebtCurrency,
  defaultCollateralCurrency,
}: {
  defaultDebtCurrency: Currency
  defaultCollateralCurrency: Currency
}) => {
  const [helperModalOutputCurrency, setHelperModalOutputCurrency] = useState<
    Currency | undefined
  >(undefined)
  const [showHelperModal, setShowHelperModal] = useState(false)
  return (
    <LeverageFormContainer
      showHelperModal={showHelperModal}
      setShowHelperModal={setShowHelperModal}
      setHelperModalOutputCurrency={setHelperModalOutputCurrency}
      defaultDebtCurrency={defaultDebtCurrency}
      defaultCollateralCurrency={defaultCollateralCurrency}
    >
      <OdosSwapModalContainer
        onClose={() => setShowHelperModal(false)}
        defaultOutputCurrency={helperModalOutputCurrency}
      />
    </LeverageFormContainer>
  )
}

const Leverage = () => {
  const { assets } = useCurrencyContext()

  const router = useRouter()
  const [collateralCurrency, debtCurrency] = useMemo(() => {
    if (!router.query.symbol || !router.query.symbol.toString().includes('_')) {
      return [undefined, undefined]
    }

    const [collateralCurrencySymbol, debtCurrencySymbol] = router.query.symbol
      .toString()
      .split('_')
    const [debtCurrencies, collateralCurrencies] = [
      assets.map((asset) => asset.underlying),
      assets
        .map((asset) =>
          asset.collaterals.map((collateral) => collateral.underlying),
        )
        .flat(),
    ]
    if (debtCurrencySymbol === 'SHORT') {
      return [
        collateralCurrencies.find((currency) => isUSDC(currency)),
        debtCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        ),
      ]
    } else if (debtCurrencySymbol === 'LONG') {
      return [
        collateralCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        ),
        debtCurrencies.find((currency) => isUSDC(currency)),
      ]
    } else {
      return [
        collateralCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        ),
        debtCurrencies.find(
          (currency) => currency.symbol === debtCurrencySymbol,
        ),
      ]
    }
  }, [assets, router.query.symbol])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Leverage {collateralCurrency?.symbol}</title>
      </Head>

      {collateralCurrency ? (
        <main className="flex flex-1 flex-col justify-center items-center">
          <div className="flex flex-1 flex-col w-full gap-6">
            <Link
              className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-4 mb-2 sm:mb-2 ml-4 sm:ml-6"
              replace={true}
              href="/?mode=borrow"
            >
              <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
              Leverage
              <div className="flex gap-2">
                <CurrencyIcon
                  currency={collateralCurrency}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>{collateralCurrency.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
              {debtCurrency && collateralCurrency ? (
                <LeverageForm
                  defaultDebtCurrency={debtCurrency}
                  defaultCollateralCurrency={collateralCurrency}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Leverage
