/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRepayAdapter,
  IRepayAdapterInterface,
} from "../../../contracts/interfaces/IRepayAdapter";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "CollateralSwapFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ControllerSlippage",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAccess",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMarket",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "Epoch",
        name: "epoch",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "cloberMarket",
        type: "address",
      },
    ],
    name: "SetCouponMarket",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SetManagerAllowance",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "giveManagerAllowance",
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
      {
        internalType: "uint256",
        name: "sellCollateralAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minRepayAmount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "swapData",
        type: "bytes",
      },
      {
        components: [
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
        internalType: "struct IController.PermitSignature",
        name: "positionPermitParams",
        type: "tuple",
      },
    ],
    name: "repayWithCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IRepayAdapter__factory {
  static readonly abi = _abi;
  static createInterface(): IRepayAdapterInterface {
    return new utils.Interface(_abi) as IRepayAdapterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRepayAdapter {
    return new Contract(address, _abi, signerOrProvider) as IRepayAdapter;
  }
}
