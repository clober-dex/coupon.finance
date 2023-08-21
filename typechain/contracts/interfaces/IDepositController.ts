/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export type PermitParamsStruct = {
  deadline: PromiseOrValue<BigNumberish>;
  v: PromiseOrValue<BigNumberish>;
  r: PromiseOrValue<BytesLike>;
  s: PromiseOrValue<BytesLike>;
};

export type PermitParamsStructOutput = [BigNumber, number, string, string] & {
  deadline: BigNumber;
  v: number;
  r: string;
  s: string;
};

export interface IDepositControllerInterface extends utils.Interface {
  functions: {
    "collect(uint256,(uint256,uint8,bytes32,bytes32))": FunctionFragment;
    "deposit(address,uint256,uint8,uint256,(uint256,uint8,bytes32,bytes32))": FunctionFragment;
    "withdraw(uint256,uint256,uint256,(uint256,uint8,bytes32,bytes32))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "collect" | "deposit" | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "collect",
    values: [PromiseOrValue<BigNumberish>, PermitParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PermitParamsStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PermitParamsStruct
    ]
  ): string;

  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {};
}

export interface IDepositController extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDepositControllerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    collect(
      positionId: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deposit(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockEpochs: PromiseOrValue<BigNumberish>,
      minEarnInterest: PromiseOrValue<BigNumberish>,
      tokenPermitParams: PermitParamsStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      positionId: PromiseOrValue<BigNumberish>,
      withdrawAmount: PromiseOrValue<BigNumberish>,
      maxPayInterest: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  collect(
    positionId: PromiseOrValue<BigNumberish>,
    positionPermitParams: PermitParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deposit(
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    lockEpochs: PromiseOrValue<BigNumberish>,
    minEarnInterest: PromiseOrValue<BigNumberish>,
    tokenPermitParams: PermitParamsStruct,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    positionId: PromiseOrValue<BigNumberish>,
    withdrawAmount: PromiseOrValue<BigNumberish>,
    maxPayInterest: PromiseOrValue<BigNumberish>,
    positionPermitParams: PermitParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    collect(
      positionId: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    deposit(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockEpochs: PromiseOrValue<BigNumberish>,
      minEarnInterest: PromiseOrValue<BigNumberish>,
      tokenPermitParams: PermitParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      positionId: PromiseOrValue<BigNumberish>,
      withdrawAmount: PromiseOrValue<BigNumberish>,
      maxPayInterest: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    collect(
      positionId: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deposit(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockEpochs: PromiseOrValue<BigNumberish>,
      minEarnInterest: PromiseOrValue<BigNumberish>,
      tokenPermitParams: PermitParamsStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      positionId: PromiseOrValue<BigNumberish>,
      withdrawAmount: PromiseOrValue<BigNumberish>,
      maxPayInterest: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    collect(
      positionId: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      lockEpochs: PromiseOrValue<BigNumberish>,
      minEarnInterest: PromiseOrValue<BigNumberish>,
      tokenPermitParams: PermitParamsStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      positionId: PromiseOrValue<BigNumberish>,
      withdrawAmount: PromiseOrValue<BigNumberish>,
      maxPayInterest: PromiseOrValue<BigNumberish>,
      positionPermitParams: PermitParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}