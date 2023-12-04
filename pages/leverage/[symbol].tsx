import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { isAddressEqual } from 'viem'

import { useCurrencyContext } from '../../contexts/currency-context'
import { Currency } from '../../model/currency'
import OdosSwapModalContainer from '../../containers/modal/odos-swap-modal-container'
import LeverageFormContainer from '../../containers/form/leverage-form-container'

const LeverageForm = ({
  defaultDebtCurrency,
  availableDebtCurrencies,
  defaultCollateralCurrency,
}: {
  defaultDebtCurrency?: Currency
  availableDebtCurrencies?: Currency[]
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
      availableDebtCurrencies={availableDebtCurrencies}
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
  const [collateralCurrency, debtCurrency, availableDebtCurrencies] =
    useMemo(() => {
      if (
        !router.query.symbol ||
        !router.query.symbol.toString().includes('_')
      ) {
        return [undefined, undefined, undefined]
      }

      const [collateralCurrencySymbol, debtCurrencySymbol] = router.query.symbol
        .toString()
        .split('_')
      const [debtCurrencies, collateralCurrencies] = [
        assets
          .map((asset) => asset.underlying)
          .filter((currency, index, self) =>
            self.findIndex((c) =>
              isAddressEqual(c.address, currency.address),
            ) === index
              ? currency
              : undefined,
          ),
        assets
          .map((asset) =>
            asset.collaterals.map((collateral) => collateral.underlying),
          )
          .flat()
          .filter((currency, index, self) =>
            self.findIndex((c) =>
              isAddressEqual(c.address, currency.address),
            ) === index
              ? currency
              : undefined,
          ),
      ]
      if (debtCurrencySymbol === 'SHORT') {
        const debtCurrency = debtCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        )
        return [undefined, debtCurrency, debtCurrency ? [debtCurrency] : []]
      } else if (debtCurrencySymbol === 'LONG') {
        const collateralCurrency = collateralCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        )
        return [
          collateralCurrency,
          undefined,
          collateralCurrency
            ? debtCurrencies.filter(
                (currency) =>
                  !isAddressEqual(currency.address, collateralCurrency.address),
              )
            : [],
        ]
      } else {
        const debtCurrency = debtCurrencies.find(
          (currency) => currency.symbol === debtCurrencySymbol,
        )
        const collateralCurrency = collateralCurrencies.find(
          (currency) => currency.symbol === collateralCurrencySymbol,
        )
        return [
          collateralCurrency,
          debtCurrency,
          debtCurrency ? [debtCurrency] : [],
        ]
      }
    }, [assets, router.query.symbol])

  return (
    <div className="flex flex-1">
      {debtCurrency || collateralCurrency ? (
        <LeverageForm
          defaultDebtCurrency={debtCurrency}
          availableDebtCurrencies={availableDebtCurrencies}
          defaultCollateralCurrency={collateralCurrency}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default Leverage
