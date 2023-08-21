/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  LoanPositionLibrary,
  LoanPositionLibraryInterface,
} from "../../../../contracts/libraries/LoanPosition.sol/LoanPositionLibrary";

const _abi = [
  {
    inputs: [],
    name: "InvalidPositionEpoch",
    type: "error",
  },
  {
    inputs: [],
    name: "UnmatchedPosition",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212206b5e070794d7996ee3cb003856373672ef351705320044c96e41b6b7aa54a78464736f6c63430008130033";

type LoanPositionLibraryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LoanPositionLibraryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LoanPositionLibrary__factory extends ContractFactory {
  constructor(...args: LoanPositionLibraryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LoanPositionLibrary> {
    return super.deploy(overrides || {}) as Promise<LoanPositionLibrary>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LoanPositionLibrary {
    return super.attach(address) as LoanPositionLibrary;
  }
  override connect(signer: Signer): LoanPositionLibrary__factory {
    return super.connect(signer) as LoanPositionLibrary__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LoanPositionLibraryInterface {
    return new utils.Interface(_abi) as LoanPositionLibraryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LoanPositionLibrary {
    return new Contract(address, _abi, signerOrProvider) as LoanPositionLibrary;
  }
}
