export const CLOBER_ORDER_BOOK_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isBid',
        type: 'bool',
      },
    ],
    name: 'CancelOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bountyAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isBase',
        type: 'bool',
      },
    ],
    name: 'ClaimOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quoteAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'earnedQuote',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'earnedBase',
        type: 'uint256',
      },
    ],
    name: 'Flash',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'claimBounty',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'orderIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'options',
        type: 'uint8',
      },
    ],
    name: 'MakeOrder',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'options',
        type: 'uint8',
      },
    ],
    name: 'TakeOrder',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        internalType: 'bool',
        name: 'roundingUp',
        type: 'bool',
      },
    ],
    name: 'baseToRaw',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isBid',
        type: 'bool',
      },
    ],
    name: 'bestPriceIndex',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'blockTradeLogIndex',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
    ],
    name: 'blockTradeLogs',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'blockTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'askVolume',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'bidVolume',
            type: 'uint64',
          },
          {
            internalType: 'uint16',
            name: 'open',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'high',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'low',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'close',
            type: 'uint16',
          },
        ],
        internalType: 'struct CloberOrderBook.BlockTradeLog',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isBid',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'priceIndex',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'orderIndex',
            type: 'uint256',
          },
        ],
        internalType: 'struct OrderKey[]',
        name: 'orderKeys',
        type: 'tuple[]',
      },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isBid',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'priceIndex',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'orderIndex',
            type: 'uint256',
          },
        ],
        internalType: 'struct OrderKey',
        name: 'orderKey',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'changeOrderOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isBid',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'priceIndex',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'orderIndex',
            type: 'uint256',
          },
        ],
        internalType: 'struct OrderKey[]',
        name: 'orderKeys',
        type: 'tuple[]',
      },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'destination',
        type: 'address',
      },
    ],
    name: 'collectFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'quoteAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'flash',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isBid',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'priceIndex',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'orderIndex',
            type: 'uint256',
          },
        ],
        internalType: 'struct OrderKey',
        name: 'orderKey',
        type: 'tuple',
      },
    ],
    name: 'getClaimable',
    outputs: [
      {
        internalType: 'uint64',
        name: 'claimableRawAmount',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'claimableAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rebateAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isBid',
        type: 'bool',
      },
      {
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
    ],
    name: 'getDepth',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'limitPriceIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'options',
        type: 'uint8',
      },
    ],
    name: 'getExpectedAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFeeBalance',
    outputs: [
      {
        internalType: 'uint128',
        name: 'quote',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'base',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bool',
            name: 'isBid',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'priceIndex',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'orderIndex',
            type: 'uint256',
          },
        ],
        internalType: 'struct OrderKey',
        name: 'orderKey',
        type: 'tuple',
      },
    ],
    name: 'getOrder',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'amount',
            type: 'uint64',
          },
          {
            internalType: 'uint32',
            name: 'claimBounty',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        internalType: 'struct CloberOrderBook.Order',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
    ],
    name: 'indexToPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'isBid',
        type: 'bool',
      },
    ],
    name: 'isEmpty',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'options',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'limitOrder',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'makerFee',
    outputs: [
      {
        internalType: 'int24',
        name: '',
        type: 'int24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'limitPriceIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'baseAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'options',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'marketOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'orderToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceBook',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'roundingUp',
        type: 'bool',
      },
    ],
    name: 'priceToIndex',
    outputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: 'correctedPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'quoteAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'roundingUp',
        type: 'bool',
      },
    ],
    name: 'quoteToRaw',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quoteToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'quoteUnit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
      {
        internalType: 'uint16',
        name: 'priceIndex',
        type: 'uint16',
      },
      {
        internalType: 'bool',
        name: 'roundingUp',
        type: 'bool',
      },
    ],
    name: 'rawToBase',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'rawAmount',
        type: 'uint64',
      },
    ],
    name: 'rawToQuote',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'takerFee',
    outputs: [
      {
        internalType: 'uint24',
        name: '',
        type: 'uint24',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'uncollectedHostFees',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'uncollectedProtocolFees',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
