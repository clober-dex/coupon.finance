/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IController,
  IControllerInterface,
} from "../../../contracts/interfaces/IController";

const _abi = [
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
    inputs: [],
    name: "ValueTransferFailed",
    type: "error",
  },
] as const;

export class IController__factory {
  static readonly abi = _abi;
  static createInterface(): IControllerInterface {
    return new utils.Interface(_abi) as IControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IController {
    return new Contract(address, _abi, signerOrProvider) as IController;
  }
}
