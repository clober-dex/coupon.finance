export const ETH_SUBSTITUTE_MINTER_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'weth',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ExceedsAmount',
    type: 'error',
  },
  {
    inputs: [
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
            internalType: 'struct PermitSignature',
            name: 'signature',
            type: 'tuple',
          },
        ],
        internalType: 'struct ERC20PermitParams',
        name: 'permitParams',
        type: 'tuple',
      },
      {
        internalType: 'contract ISubstitute',
        name: 'substitute',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
