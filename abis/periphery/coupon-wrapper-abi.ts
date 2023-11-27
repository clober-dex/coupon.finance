export const COUPON_WRAPPER_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'couponManager_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wrapped1155Factory_',
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
    name: 'FailedInnerCall',
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
            name: 'asset',
            type: 'address',
          },
          {
            internalType: 'Epoch',
            name: 'epoch',
            type: 'uint16',
          },
        ],
        internalType: 'struct CouponKey[]',
        name: 'couponKeys',
        type: 'tuple[]',
      },
    ],
    name: 'buildBatchMetadata',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
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
    name: 'buildMetadata',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
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
    name: 'getWrappedCoupon',
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
        internalType: 'struct CouponKey[]',
        name: 'couponKeys',
        type: 'tuple[]',
      },
    ],
    name: 'getWrappedCoupons',
    outputs: [
      {
        internalType: 'address[]',
        name: 'wrappedCoupons',
        type: 'address[]',
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
            name: 'key',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Coupon[]',
        name: 'coupons',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'unwrap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
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
            name: 'key',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Coupon[]',
        name: 'coupons',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'wrap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
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
        name: 'couponPermitSignature',
        type: 'tuple',
      },
      {
        components: [
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
            name: 'key',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct Coupon[]',
        name: 'coupons',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'wrapWithPermit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
