/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ILoanPositionManager,
  ILoanPositionManagerInterface,
} from "../../../../contracts/interfaces/ILoanPositionManager.sol/ILoanPositionManager";

const _abi = [
  {
    inputs: [],
    name: "AlreadyExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAccess",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPair",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "LiquidationThreshold",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "locker",
        type: "address",
      },
    ],
    name: "LockedBy",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSettled",
    type: "error",
  },
  {
    inputs: [],
    name: "PermitExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "TooSmallDebt",
    type: "error",
  },
  {
    inputs: [],
    name: "UnableToLiquidate",
    type: "error",
  },
  {
    inputs: [],
    name: "UnpaidDebt",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "liquidator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidationAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "protocolFeeAmount",
        type: "uint256",
      },
    ],
    name: "LiquidatePosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "debt",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "liquidationThreshold",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "liquidationFee",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "liquidationProtocolFee",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "liquidationTargetLtv",
        type: "uint32",
      },
    ],
    name: "SetLoanConfiguration",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "collateralAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "Epoch",
        name: "unlockedAt",
        type: "uint8",
      },
    ],
    name: "UpdatePosition",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "collateralAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "debtAmount",
        type: "uint256",
      },
      {
        internalType: "Epoch",
        name: "expiredWith",
        type: "uint8",
      },
    ],
    name: "adjustPosition",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "Epoch",
                name: "epoch",
                type: "uint8",
              },
            ],
            internalType: "struct CouponKey",
            name: "key",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Coupon[]",
        name: "couponsToPay",
        type: "tuple[]",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "Epoch",
                name: "epoch",
                type: "uint8",
              },
            ],
            internalType: "struct CouponKey",
            name: "key",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Coupon[]",
        name: "couponsToRefund",
        type: "tuple[]",
      },
      {
        internalType: "int256",
        name: "collateralDelta",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "debtDelta",
        type: "int256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "locker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "assetId",
        type: "uint256",
      },
    ],
    name: "assetDelta",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assetPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "Epoch",
                name: "epoch",
                type: "uint8",
              },
            ],
            internalType: "struct CouponKey",
            name: "key",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Coupon[]",
        name: "coupons",
        type: "tuple[]",
      },
    ],
    name: "burnCoupons",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "asset",
            type: "address",
          },
          {
            internalType: "Epoch",
            name: "epoch",
            type: "uint8",
          },
        ],
        internalType: "struct CouponKey[]",
        name: "couponKeys",
        type: "tuple[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "claimOwedCoupons",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "depositToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxRepayAmount",
        type: "uint256",
      },
    ],
    name: "getLiquidationStatus",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidationAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "protocolFeeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        internalType: "address",
        name: "debt",
        type: "address",
      },
    ],
    name: "getLoanConfiguration",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "collateralDecimal",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "debtDecimal",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "liquidationThreshold",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "liquidationFee",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "liquidationProtocolFee",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "liquidationTargetLtv",
            type: "uint32",
          },
        ],
        internalType: "struct ILoanPositionManagerTypes.LoanConfiguration",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "couponId",
        type: "uint256",
      },
    ],
    name: "getOwedCouponAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "getPosition",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
          {
            internalType: "Epoch",
            name: "expiredWith",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "isSettled",
            type: "bool",
          },
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "debtToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "collateralAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "debtAmount",
            type: "uint256",
          },
        ],
        internalType: "struct LoanPosition",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        internalType: "address",
        name: "debt",
        type: "address",
      },
    ],
    name: "isPairRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxRepayAmount",
        type: "uint256",
      },
    ],
    name: "liquidate",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidationAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "protocolFeeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "lock",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockData",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minDebtValueInEth",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateralToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "debtToken",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "asset",
                type: "address",
              },
              {
                internalType: "Epoch",
                name: "epoch",
                type: "uint8",
              },
            ],
            internalType: "struct CouponKey",
            name: "key",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct Coupon[]",
        name: "coupons",
        type: "tuple[]",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mintCoupons",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collateral",
        type: "address",
      },
      {
        internalType: "address",
        name: "debt",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "liquidationThreshold",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "liquidationFee",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "liquidationProtocolFee",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "liquidationTargetLtv",
        type: "uint32",
      },
    ],
    name: "setLoanConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
    ],
    name: "settlePosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ILoanPositionManager__factory {
  static readonly abi = _abi;
  static createInterface(): ILoanPositionManagerInterface {
    return new utils.Interface(_abi) as ILoanPositionManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ILoanPositionManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ILoanPositionManager;
  }
}
