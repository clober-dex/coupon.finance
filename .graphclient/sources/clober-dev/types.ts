// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace CloberDevTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Depth = {
  id: Scalars['ID'];
  market: Market;
  priceIndex: Scalars['BigInt'];
  price: Scalars['BigInt'];
  isBid: Scalars['Boolean'];
  rawAmount: Scalars['BigInt'];
  baseAmount: Scalars['BigInt'];
};

export type Depth_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  market?: InputMaybe<Scalars['String']>;
  market_not?: InputMaybe<Scalars['String']>;
  market_gt?: InputMaybe<Scalars['String']>;
  market_lt?: InputMaybe<Scalars['String']>;
  market_gte?: InputMaybe<Scalars['String']>;
  market_lte?: InputMaybe<Scalars['String']>;
  market_in?: InputMaybe<Array<Scalars['String']>>;
  market_not_in?: InputMaybe<Array<Scalars['String']>>;
  market_contains?: InputMaybe<Scalars['String']>;
  market_contains_nocase?: InputMaybe<Scalars['String']>;
  market_not_contains?: InputMaybe<Scalars['String']>;
  market_not_contains_nocase?: InputMaybe<Scalars['String']>;
  market_starts_with?: InputMaybe<Scalars['String']>;
  market_starts_with_nocase?: InputMaybe<Scalars['String']>;
  market_not_starts_with?: InputMaybe<Scalars['String']>;
  market_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  market_ends_with?: InputMaybe<Scalars['String']>;
  market_ends_with_nocase?: InputMaybe<Scalars['String']>;
  market_not_ends_with?: InputMaybe<Scalars['String']>;
  market_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  market_?: InputMaybe<Market_filter>;
  priceIndex?: InputMaybe<Scalars['BigInt']>;
  priceIndex_not?: InputMaybe<Scalars['BigInt']>;
  priceIndex_gt?: InputMaybe<Scalars['BigInt']>;
  priceIndex_lt?: InputMaybe<Scalars['BigInt']>;
  priceIndex_gte?: InputMaybe<Scalars['BigInt']>;
  priceIndex_lte?: InputMaybe<Scalars['BigInt']>;
  priceIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  priceIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isBid?: InputMaybe<Scalars['Boolean']>;
  isBid_not?: InputMaybe<Scalars['Boolean']>;
  isBid_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isBid_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  rawAmount?: InputMaybe<Scalars['BigInt']>;
  rawAmount_not?: InputMaybe<Scalars['BigInt']>;
  rawAmount_gt?: InputMaybe<Scalars['BigInt']>;
  rawAmount_lt?: InputMaybe<Scalars['BigInt']>;
  rawAmount_gte?: InputMaybe<Scalars['BigInt']>;
  rawAmount_lte?: InputMaybe<Scalars['BigInt']>;
  rawAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseAmount?: InputMaybe<Scalars['BigInt']>;
  baseAmount_not?: InputMaybe<Scalars['BigInt']>;
  baseAmount_gt?: InputMaybe<Scalars['BigInt']>;
  baseAmount_lt?: InputMaybe<Scalars['BigInt']>;
  baseAmount_gte?: InputMaybe<Scalars['BigInt']>;
  baseAmount_lte?: InputMaybe<Scalars['BigInt']>;
  baseAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Depth_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Depth_filter>>>;
};

export type Depth_orderBy =
  | 'id'
  | 'market'
  | 'market__id'
  | 'market__orderToken'
  | 'market__quoteUnit'
  | 'market__makerFee'
  | 'market__takerFee'
  | 'market__a'
  | 'market__r'
  | 'market__d'
  | 'priceIndex'
  | 'price'
  | 'isBid'
  | 'rawAmount'
  | 'baseAmount';

export type Market = {
  id: Scalars['ID'];
  orderToken: Scalars['Bytes'];
  quoteToken: Token;
  baseToken: Token;
  quoteUnit: Scalars['BigInt'];
  makerFee: Scalars['BigInt'];
  takerFee: Scalars['BigInt'];
  a: Scalars['BigInt'];
  r: Scalars['BigInt'];
  d: Scalars['BigInt'];
  depths: Array<Depth>;
};


export type MarketdepthsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Depth_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Depth_filter>;
};

export type Market_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  orderToken?: InputMaybe<Scalars['Bytes']>;
  orderToken_not?: InputMaybe<Scalars['Bytes']>;
  orderToken_gt?: InputMaybe<Scalars['Bytes']>;
  orderToken_lt?: InputMaybe<Scalars['Bytes']>;
  orderToken_gte?: InputMaybe<Scalars['Bytes']>;
  orderToken_lte?: InputMaybe<Scalars['Bytes']>;
  orderToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  orderToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  orderToken_contains?: InputMaybe<Scalars['Bytes']>;
  orderToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_filter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_filter>;
  quoteUnit?: InputMaybe<Scalars['BigInt']>;
  quoteUnit_not?: InputMaybe<Scalars['BigInt']>;
  quoteUnit_gt?: InputMaybe<Scalars['BigInt']>;
  quoteUnit_lt?: InputMaybe<Scalars['BigInt']>;
  quoteUnit_gte?: InputMaybe<Scalars['BigInt']>;
  quoteUnit_lte?: InputMaybe<Scalars['BigInt']>;
  quoteUnit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quoteUnit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  makerFee?: InputMaybe<Scalars['BigInt']>;
  makerFee_not?: InputMaybe<Scalars['BigInt']>;
  makerFee_gt?: InputMaybe<Scalars['BigInt']>;
  makerFee_lt?: InputMaybe<Scalars['BigInt']>;
  makerFee_gte?: InputMaybe<Scalars['BigInt']>;
  makerFee_lte?: InputMaybe<Scalars['BigInt']>;
  makerFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  makerFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  takerFee?: InputMaybe<Scalars['BigInt']>;
  takerFee_not?: InputMaybe<Scalars['BigInt']>;
  takerFee_gt?: InputMaybe<Scalars['BigInt']>;
  takerFee_lt?: InputMaybe<Scalars['BigInt']>;
  takerFee_gte?: InputMaybe<Scalars['BigInt']>;
  takerFee_lte?: InputMaybe<Scalars['BigInt']>;
  takerFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  takerFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  a?: InputMaybe<Scalars['BigInt']>;
  a_not?: InputMaybe<Scalars['BigInt']>;
  a_gt?: InputMaybe<Scalars['BigInt']>;
  a_lt?: InputMaybe<Scalars['BigInt']>;
  a_gte?: InputMaybe<Scalars['BigInt']>;
  a_lte?: InputMaybe<Scalars['BigInt']>;
  a_in?: InputMaybe<Array<Scalars['BigInt']>>;
  a_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  r?: InputMaybe<Scalars['BigInt']>;
  r_not?: InputMaybe<Scalars['BigInt']>;
  r_gt?: InputMaybe<Scalars['BigInt']>;
  r_lt?: InputMaybe<Scalars['BigInt']>;
  r_gte?: InputMaybe<Scalars['BigInt']>;
  r_lte?: InputMaybe<Scalars['BigInt']>;
  r_in?: InputMaybe<Array<Scalars['BigInt']>>;
  r_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  d?: InputMaybe<Scalars['BigInt']>;
  d_not?: InputMaybe<Scalars['BigInt']>;
  d_gt?: InputMaybe<Scalars['BigInt']>;
  d_lt?: InputMaybe<Scalars['BigInt']>;
  d_gte?: InputMaybe<Scalars['BigInt']>;
  d_lte?: InputMaybe<Scalars['BigInt']>;
  d_in?: InputMaybe<Array<Scalars['BigInt']>>;
  d_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  depths_?: InputMaybe<Depth_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Market_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Market_filter>>>;
};

export type Market_orderBy =
  | 'id'
  | 'orderToken'
  | 'quoteToken'
  | 'quoteToken__id'
  | 'quoteToken__symbol'
  | 'quoteToken__name'
  | 'quoteToken__decimals'
  | 'baseToken'
  | 'baseToken__id'
  | 'baseToken__symbol'
  | 'baseToken__name'
  | 'baseToken__decimals'
  | 'quoteUnit'
  | 'makerFee'
  | 'takerFee'
  | 'a'
  | 'r'
  | 'd'
  | 'depths';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  market?: Maybe<Market>;
  markets: Array<Market>;
  depth?: Maybe<Depth>;
  depths: Array<Depth>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerymarketArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymarketsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Market_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Market_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepthArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydepthsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Depth_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Depth_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  market?: Maybe<Market>;
  markets: Array<Market>;
  depth?: Maybe<Depth>;
  depths: Array<Depth>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionmarketArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmarketsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Market_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Market_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepthArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondepthsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Depth_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Depth_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Token = {
  id: Scalars['ID'];
  symbol: Scalars['String'];
  name: Scalars['String'];
  decimals: Scalars['BigInt'];
};

export type Token_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Token_filter>>>;
};

export type Token_orderBy =
  | 'id'
  | 'symbol'
  | 'name'
  | 'decimals';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  market: InContextSdkMethod<Query['market'], QuerymarketArgs, MeshContext>,
  /** null **/
  markets: InContextSdkMethod<Query['markets'], QuerymarketsArgs, MeshContext>,
  /** null **/
  depth: InContextSdkMethod<Query['depth'], QuerydepthArgs, MeshContext>,
  /** null **/
  depths: InContextSdkMethod<Query['depths'], QuerydepthsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<Query['token'], QuerytokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<Query['tokens'], QuerytokensArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  market: InContextSdkMethod<Subscription['market'], SubscriptionmarketArgs, MeshContext>,
  /** null **/
  markets: InContextSdkMethod<Subscription['markets'], SubscriptionmarketsArgs, MeshContext>,
  /** null **/
  depth: InContextSdkMethod<Subscription['depth'], SubscriptiondepthArgs, MeshContext>,
  /** null **/
  depths: InContextSdkMethod<Subscription['depths'], SubscriptiondepthsArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<Subscription['token'], SubscriptiontokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<Subscription['tokens'], SubscriptiontokensArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["clober-dev"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
