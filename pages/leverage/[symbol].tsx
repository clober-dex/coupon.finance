import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { useCurrencyContext } from '../../contexts/currency-context'
import BackSvg from '../../components/svg/back-svg'
import { CurrencyIcon } from '../../components/icon/currency-icon'
import { Currency } from '../../model/currency'
import OdosSwapModalContainer from '../../containers/modal/odos-swap-modal-container'
import LeverageFormContainer from '../../containers/form/leverage-form-container'

const LeverageForm = ({
  defaultCollateralCurrency,
}: {
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
  const collateral = useMemo(() => {
    return assets
      .map((asset) =>
        asset.collaterals.map((collateral) => collateral.underlying),
      )
      .flat()
      .find((collateral) => collateral.symbol === router.query.symbol)
  }, [assets, router.query.symbol])

  return (
    <div className="flex flex-1">
      <Head>
        <title>Leverage {collateral?.symbol}</title>
      </Head>

      {collateral ? (
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
                  currency={collateral}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div>{collateral.symbol}</div>
              </div>
            </Link>
            <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
              <LeverageForm defaultCollateralCurrency={collateral} />
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
