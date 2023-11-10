/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  Signer,
  utils,
} from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface ILoanPositionManagerTypesInterface extends utils.Interface {
  functions: {};

  events: {
    "LiquidatePosition(uint256,address,uint256,uint256,uint256)": EventFragment;
    "SetLoanConfiguration(address,address,uint32,uint32,uint32,uint32,address)": EventFragment;
    "SetTreasury(address)": EventFragment;
    "UpdatePosition(uint256,uint256,uint256,uint16)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LiquidatePosition"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetLoanConfiguration"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTreasury"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UpdatePosition"): EventFragment;
}

export interface LiquidatePositionEventObject {
  positionId: BigNumber;
  liquidator: string;
  liquidationAmount: BigNumber;
  repayAmount: BigNumber;
  protocolFeeAmount: BigNumber;
}
export type LiquidatePositionEvent = TypedEvent<
  [BigNumber, string, BigNumber, BigNumber, BigNumber],
  LiquidatePositionEventObject
>;

export type LiquidatePositionEventFilter =
  TypedEventFilter<LiquidatePositionEvent>;

export interface SetLoanConfigurationEventObject {
  collateral: string;
  debt: string;
  liquidationThreshold: number;
  liquidationFee: number;
  liquidationProtocolFee: number;
  liquidationTargetLtv: number;
  hook: string;
}
export type SetLoanConfigurationEvent = TypedEvent<
  [string, string, number, number, number, number, string],
  SetLoanConfigurationEventObject
>;

export type SetLoanConfigurationEventFilter =
  TypedEventFilter<SetLoanConfigurationEvent>;

export interface SetTreasuryEventObject {
  newTreasury: string;
}
export type SetTreasuryEvent = TypedEvent<[string], SetTreasuryEventObject>;

export type SetTreasuryEventFilter = TypedEventFilter<SetTreasuryEvent>;

export interface UpdatePositionEventObject {
  positionId: BigNumber;
  collateralAmount: BigNumber;
  debtAmount: BigNumber;
  unlockedAt: number;
}
export type UpdatePositionEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, number],
  UpdatePositionEventObject
>;

export type UpdatePositionEventFilter = TypedEventFilter<UpdatePositionEvent>;

export interface ILoanPositionManagerTypes extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ILoanPositionManagerTypesInterface;

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

  functions: {};

  callStatic: {};

  filters: {
    "LiquidatePosition(uint256,address,uint256,uint256,uint256)"(
      positionId?: PromiseOrValue<BigNumberish> | null,
      liquidator?: PromiseOrValue<string> | null,
      liquidationAmount?: null,
      repayAmount?: null,
      protocolFeeAmount?: null
    ): LiquidatePositionEventFilter;
    LiquidatePosition(
      positionId?: PromiseOrValue<BigNumberish> | null,
      liquidator?: PromiseOrValue<string> | null,
      liquidationAmount?: null,
      repayAmount?: null,
      protocolFeeAmount?: null
    ): LiquidatePositionEventFilter;

    "SetLoanConfiguration(address,address,uint32,uint32,uint32,uint32,address)"(
      collateral?: PromiseOrValue<string> | null,
      debt?: PromiseOrValue<string> | null,
      liquidationThreshold?: null,
      liquidationFee?: null,
      liquidationProtocolFee?: null,
      liquidationTargetLtv?: null,
      hook?: null
    ): SetLoanConfigurationEventFilter;
    SetLoanConfiguration(
      collateral?: PromiseOrValue<string> | null,
      debt?: PromiseOrValue<string> | null,
      liquidationThreshold?: null,
      liquidationFee?: null,
      liquidationProtocolFee?: null,
      liquidationTargetLtv?: null,
      hook?: null
    ): SetLoanConfigurationEventFilter;

    "SetTreasury(address)"(
      newTreasury?: PromiseOrValue<string> | null
    ): SetTreasuryEventFilter;
    SetTreasury(
      newTreasury?: PromiseOrValue<string> | null
    ): SetTreasuryEventFilter;

    "UpdatePosition(uint256,uint256,uint256,uint16)"(
      positionId?: PromiseOrValue<BigNumberish> | null,
      collateralAmount?: null,
      debtAmount?: null,
      unlockedAt?: null
    ): UpdatePositionEventFilter;
    UpdatePosition(
      positionId?: PromiseOrValue<BigNumberish> | null,
      collateralAmount?: null,
      debtAmount?: null,
      unlockedAt?: null
    ): UpdatePositionEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
