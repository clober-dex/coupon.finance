/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  CloberMarketFactory,
  CloberMarketFactoryInterface,
} from "../../../../contracts/external/clober/CloberMarketFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousTreasury",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "ChangeDaoTreasury",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "previousHost",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newHost",
        type: "address",
      },
    ],
    name: "ChangeHost",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "ChangeOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "orderToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quoteUnit",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "makerFee",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint24",
        name: "takerFee",
        type: "uint24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "a",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "d",
        type: "uint128",
      },
    ],
    name: "CreateStableMarket",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "orderToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quoteUnit",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "makerFee",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint24",
        name: "takerFee",
        type: "uint24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "a",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "r",
        type: "uint128",
      },
    ],
    name: "CreateVolatileMarket",
    type: "event",
  },
  {
    inputs: [],
    name: "canceler",
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
        name: "treasury",
        type: "address",
      },
    ],
    name: "changeDaoTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "quoteUnit",
        type: "uint96",
      },
      {
        internalType: "int24",
        name: "makerFee",
        type: "int24",
      },
      {
        internalType: "uint24",
        name: "takerFee",
        type: "uint24",
      },
      {
        internalType: "uint128",
        name: "a",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "d",
        type: "uint128",
      },
    ],
    name: "createStableMarket",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "host",
        type: "address",
      },
      {
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "quoteUnit",
        type: "uint96",
      },
      {
        internalType: "int24",
        name: "makerFee",
        type: "int24",
      },
      {
        internalType: "uint24",
        name: "takerFee",
        type: "uint24",
      },
      {
        internalType: "uint128",
        name: "a",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "r",
        type: "uint128",
      },
    ],
    name: "createVolatileMarket",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "daoTreasury",
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
        internalType: "uint128",
        name: "a",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "d",
        type: "uint128",
      },
    ],
    name: "deployedArithmeticPriceBook",
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
        internalType: "uint128",
        name: "a",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "r",
        type: "uint128",
      },
    ],
    name: "deployedGeometricPriceBook",
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
    inputs: [],
    name: "executeChangeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
    ],
    name: "executeHandOverHost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "quoteToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "marketNonce",
        type: "uint256",
      },
    ],
    name: "formatOrderTokenName",
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
        name: "quoteToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "marketNonce",
        type: "uint256",
      },
    ],
    name: "formatOrderTokenSymbol",
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
    name: "futureOwner",
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
        name: "market",
        type: "address",
      },
    ],
    name: "getMarketHost",
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
        name: "market",
        type: "address",
      },
    ],
    name: "getMarketInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "host",
            type: "address",
          },
          {
            internalType: "enum CloberMarketFactory.MarketType",
            name: "marketType",
            type: "uint8",
          },
          {
            internalType: "uint128",
            name: "a",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "factor",
            type: "uint128",
          },
          {
            internalType: "address",
            name: "futureHost",
            type: "address",
          },
        ],
        internalType: "struct CloberMarketFactory.MarketInfo",
        name: "marketInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketDeployer",
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
    inputs: [],
    name: "nonce",
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
    name: "orderTokenDeployer",
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
    inputs: [],
    name: "owner",
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
        name: "newOwner",
        type: "address",
      },
    ],
    name: "prepareChangeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "market",
        type: "address",
      },
      {
        internalType: "address",
        name: "newHost",
        type: "address",
      },
    ],
    name: "prepareHandOverHost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "priceBookDeployer",
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
    ],
    name: "registerQuoteToken",
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
    ],
    name: "registeredQuoteTokens",
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
        name: "token",
        type: "address",
      },
    ],
    name: "unregisterQuoteToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class CloberMarketFactory__factory {
  static readonly abi = _abi;
  static createInterface(): CloberMarketFactoryInterface {
    return new utils.Interface(_abi) as CloberMarketFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CloberMarketFactory {
    return new Contract(address, _abi, signerOrProvider) as CloberMarketFactory;
  }
}