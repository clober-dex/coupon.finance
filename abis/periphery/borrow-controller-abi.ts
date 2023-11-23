export const BORROW_CONTROLLER_ABI = [
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
        name: 'weth',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'loanPositionManager',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'CollateralSwapFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ControllerSlippage',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EpochOverflow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAccess',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidDebtAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMarket',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Reentrancy',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'Epoch',
        name: 'epoch',
        type: 'uint16',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'cloberMarket',
        type: 'address',
      },
    ],
    name: 'SetCouponMarket',
    type: 'event',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
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
        internalType: 'struct IController.PermitSignature',
        name: 'positionPermitParams',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'permitAmount',
            type: 'uint256',
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
            internalType: 'struct IController.PermitSignature',
            name: 'signature',
            type: 'tuple',
          },
        ],
        internalType: 'struct IController.ERC20PermitParams',
        name: 'collateralPermitParams',
        type: 'tuple',
      },
    ],
    name: 'addCollateral',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collateralToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'debtToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'collateralAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrowAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxPayInterest',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'loanEpochs',
        type: 'uint16',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'permitAmount',
            type: 'uint256',
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
            internalType: 'struct IController.PermitSignature',
            name: 'signature',
            type: 'tuple',
          },
        ],
        internalType: 'struct IController.ERC20PermitParams',
        name: 'collateralPermitParams',
        type: 'tuple',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxPayInterest',
        type: 'uint256',
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
        internalType: 'struct IController.PermitSignature',
        name: 'positionPermitParams',
        type: 'tuple',
      },
    ],
    name: 'borrowMore',
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
        name: '',
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
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'epochs',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: 'maxPayInterest',
        type: 'uint256',
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
        internalType: 'struct IController.PermitSignature',
        name: 'positionPermitParams',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'permitAmount',
            type: 'uint256',
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
            internalType: 'struct IController.PermitSignature',
            name: 'signature',
            type: 'tuple',
          },
        ],
        internalType: 'struct IController.ERC20PermitParams',
        name: 'debtPermitParams',
        type: 'tuple',
      },
    ],
    name: 'extendLoanDuration',
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
    ],
    name: 'getCouponMarket',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
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
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
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
    name: 'pendingOwner',
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
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'positionLockAcquired',
    outputs: [
      {
        internalType: 'bytes',
        name: 'result',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
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
        internalType: 'struct IController.PermitSignature',
        name: 'positionPermitParams',
        type: 'tuple',
      },
    ],
    name: 'removeCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'minEarnInterest',
        type: 'uint256',
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
        internalType: 'struct IController.PermitSignature',
        name: 'positionPermitParams',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'permitAmount',
            type: 'uint256',
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
            internalType: 'struct IController.PermitSignature',
            name: 'signature',
            type: 'tuple',
          },
        ],
        internalType: 'struct IController.ERC20PermitParams',
        name: 'debtPermitParams',
        type: 'tuple',
      },
    ],
    name: 'repay',
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
        internalType: 'address',
        name: 'cloberMarket',
        type: 'address',
      },
    ],
    name: 'setCouponMarket',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'positionId',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'epochs',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: 'minEarnInterest',
        type: 'uint256',
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
        internalType: 'struct IController.PermitSignature',
        name: 'positionPermitParams',
        type: 'tuple',
      },
    ],
    name: 'shortenLoanDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
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
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
