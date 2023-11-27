export const COUPON_MARKET_ROUTER_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wrapped1155Factory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'cloberMarketFactory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'couponManager',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'couponWrapper',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Deadline',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedToSendValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAccess',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMarket',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'market',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'deadline',
            type: 'uint64',
          },
          {
            internalType: 'uint16',
            name: 'limitPriceIndex',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'minRawAmount',
            type: 'uint64',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'asset',
                type: 'address',
              },
              {
                internalType: 'Epoch',
                name: 'epoch',
                type: 'uint16',
              },
            ],
            internalType: 'struct CouponKey',
            name: 'couponKey',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct ICouponMarketRouter.MarketSellParams[]',
        name: 'paramsList',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct PermitSignature',
        name: 'couponPermitParams',
        type: 'tuple',
      },
    ],
    name: 'batchMarketSellCoupons',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'cloberMarketSwapCallback',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'market',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'deadline',
            type: 'uint64',
          },
          {
            internalType: 'uint16',
            name: 'limitPriceIndex',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'minRawAmount',
            type: 'uint64',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'asset',
                type: 'address',
              },
              {
                internalType: 'Epoch',
                name: 'epoch',
                type: 'uint16',
              },
            ],
            internalType: 'struct CouponKey',
            name: 'couponKey',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct ICouponMarketRouter.MarketSellParams',
        name: 'params',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
          {
            internalType: 'uint8',
            name: 'v',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'r',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        internalType: 'struct PermitSignature',
        name: 'couponPermitParams',
        type: 'tuple',
      },
    ],
    name: 'marketSellCoupons',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
