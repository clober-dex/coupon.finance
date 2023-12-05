import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { isAddressEqual } from 'viem'

import { useCurrencyContext } from '../../contexts/currency-context'
import { Currency } from '../../model/currency'
import OdosSwapModalContainer from '../../containers/modal/odos-swap-modal-container'
import LeverageFormContainer from '../../containers/form/leverage-form-container'

const LeverageForm = ({
  defaultDebtCurrency,
  defaultCollateralCurrency,
}: {
  defaultDebtCurrency?: Currency
  defaultCollateralCurrency?: Currency
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
      assets
        .map((asset) => asset.underlying)
        .filter((currency, index, self) =>
          self.findIndex((c) => isAddressEqual(c.address, currency.address)) ===
          index
            ? currency
            : undefined,
        ),
      assets
        .map((asset) =>
          asset.collaterals.map((collateral) => collateral.underlying),
        )
        .flat()
        .filter((currency, index, self) =>
          self.findIndex((c) => isAddressEqual(c.address, currency.address)) ===
          index
            ? currency
            : undefined,
        ),
    ]
    if (debtCurrencySymbol === 'SHORT') {
      return [
        undefined,
        debtCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        ),
      ]
    } else if (debtCurrencySymbol === 'LONG') {
      return [
        collateralCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        ),
        undefined,
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
      {debtCurrency || collateralCurrency ? (
        <LeverageForm
          defaultDebtCurrency={debtCurrency}
          defaultCollateralCurrency={collateralCurrency}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default Leverage
