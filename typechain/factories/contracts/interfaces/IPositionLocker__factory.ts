/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPositionLocker,
  IPositionLockerInterface,
} from "../../../contracts/interfaces/IPositionLocker";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "positionLockAcquired",
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
] as const;

export class IPositionLocker__factory {
  static readonly abi = _abi;
  static createInterface(): IPositionLockerInterface {
    return new utils.Interface(_abi) as IPositionLockerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPositionLocker {
    return new Contract(address, _abi, signerOrProvider) as IPositionLocker;
  }
}