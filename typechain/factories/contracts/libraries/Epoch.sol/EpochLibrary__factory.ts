/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  EpochLibrary,
  EpochLibraryInterface,
} from "../../../../contracts/libraries/Epoch.sol/EpochLibrary";

const _abi = [
  {
    inputs: [],
    name: "EpochOverflow",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220b8c5a5898be79281b7cbbead2262085fb5c597d660a916e4b40da6e0a28eba6a64736f6c63430008130033";

type EpochLibraryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EpochLibraryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EpochLibrary__factory extends ContractFactory {
  constructor(...args: EpochLibraryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<EpochLibrary> {
    return super.deploy(overrides || {}) as Promise<EpochLibrary>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): EpochLibrary {
    return super.attach(address) as EpochLibrary;
  }
  override connect(signer: Signer): EpochLibrary__factory {
    return super.connect(signer) as EpochLibrary__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EpochLibraryInterface {
    return new utils.Interface(_abi) as EpochLibraryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EpochLibrary {
    return new Contract(address, _abi, signerOrProvider) as EpochLibrary;
  }
}
