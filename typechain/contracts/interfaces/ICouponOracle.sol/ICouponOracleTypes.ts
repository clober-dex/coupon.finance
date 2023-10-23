/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, BigNumber, Signer, utils } from "ethers";
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface ICouponOracleTypesInterface extends utils.Interface {
  functions: {};

  events: {
    "SetFallbackOracle(address)": EventFragment;
    "SetFeed(address,address[])": EventFragment;
    "SetGracePeriod(uint256)": EventFragment;
    "SetSequencerOracle(address)": EventFragment;
    "SetTimeout(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SetFallbackOracle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetFeed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetGracePeriod"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetSequencerOracle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTimeout"): EventFragment;
}

export interface SetFallbackOracleEventObject {
  newFallbackOracle: string;
}
export type SetFallbackOracleEvent = TypedEvent<
  [string],
  SetFallbackOracleEventObject
>;

export type SetFallbackOracleEventFilter =
  TypedEventFilter<SetFallbackOracleEvent>;

export interface SetFeedEventObject {
  asset: string;
  feeds: string[];
}
export type SetFeedEvent = TypedEvent<[string, string[]], SetFeedEventObject>;

export type SetFeedEventFilter = TypedEventFilter<SetFeedEvent>;

export interface SetGracePeriodEventObject {
  newGracePeriod: BigNumber;
}
export type SetGracePeriodEvent = TypedEvent<
  [BigNumber],
  SetGracePeriodEventObject
>;

export type SetGracePeriodEventFilter = TypedEventFilter<SetGracePeriodEvent>;

export interface SetSequencerOracleEventObject {
  newSequencerOracle: string;
}
export type SetSequencerOracleEvent = TypedEvent<
  [string],
  SetSequencerOracleEventObject
>;

export type SetSequencerOracleEventFilter =
  TypedEventFilter<SetSequencerOracleEvent>;

export interface SetTimeoutEventObject {
  newTimeout: BigNumber;
}
export type SetTimeoutEvent = TypedEvent<[BigNumber], SetTimeoutEventObject>;

export type SetTimeoutEventFilter = TypedEventFilter<SetTimeoutEvent>;

export interface ICouponOracleTypes extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ICouponOracleTypesInterface;

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
    "SetFallbackOracle(address)"(
      newFallbackOracle?: PromiseOrValue<string> | null
    ): SetFallbackOracleEventFilter;
    SetFallbackOracle(
      newFallbackOracle?: PromiseOrValue<string> | null
    ): SetFallbackOracleEventFilter;

    "SetFeed(address,address[])"(
      asset?: PromiseOrValue<string> | null,
      feeds?: null
    ): SetFeedEventFilter;
    SetFeed(
      asset?: PromiseOrValue<string> | null,
      feeds?: null
    ): SetFeedEventFilter;

    "SetGracePeriod(uint256)"(newGracePeriod?: null): SetGracePeriodEventFilter;
    SetGracePeriod(newGracePeriod?: null): SetGracePeriodEventFilter;

    "SetSequencerOracle(address)"(
      newSequencerOracle?: PromiseOrValue<string> | null
    ): SetSequencerOracleEventFilter;
    SetSequencerOracle(
      newSequencerOracle?: PromiseOrValue<string> | null
    ): SetSequencerOracleEventFilter;

    "SetTimeout(uint256)"(newTimeout?: null): SetTimeoutEventFilter;
    SetTimeout(newTimeout?: null): SetTimeoutEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
