// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { CloberDevTypes } from './sources/clober-dev/types';
import * as importedModule$0 from "./sources/clober-dev/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Depth: ResolverTypeWrapper<Depth>;
  Depth_filter: Depth_filter;
  Depth_orderBy: Depth_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Market: ResolverTypeWrapper<Market>;
  Market_filter: Market_filter;
  Market_orderBy: Market_orderBy;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
  Token_filter: Token_filter;
  Token_orderBy: Token_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Depth: Depth;
  Depth_filter: Depth_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Market: Market;
  Market_filter: Market_filter;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Token: Token;
  Token_filter: Token_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type DepthResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Depth'] = ResolversParentTypes['Depth']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  market?: Resolver<ResolversTypes['Market'], ParentType, ContextType>;
  priceIndex?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  isBid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rawAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  baseAmount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarketResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Market'] = ResolversParentTypes['Market']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderToken?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  quoteToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  baseToken?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  quoteUnit?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  makerFee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  takerFee?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  a?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  r?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  d?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  depths?: Resolver<Array<ResolversTypes['Depth']>, ParentType, ContextType, RequireFields<MarketdepthsArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  market?: Resolver<Maybe<ResolversTypes['Market']>, ParentType, ContextType, RequireFields<QuerymarketArgs, 'id' | 'subgraphError'>>;
  markets?: Resolver<Array<ResolversTypes['Market']>, ParentType, ContextType, RequireFields<QuerymarketsArgs, 'skip' | 'first' | 'subgraphError'>>;
  depth?: Resolver<Maybe<ResolversTypes['Depth']>, ParentType, ContextType, RequireFields<QuerydepthArgs, 'id' | 'subgraphError'>>;
  depths?: Resolver<Array<ResolversTypes['Depth']>, ParentType, ContextType, RequireFields<QuerydepthsArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokenArgs, 'id' | 'subgraphError'>>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  market?: SubscriptionResolver<Maybe<ResolversTypes['Market']>, "market", ParentType, ContextType, RequireFields<SubscriptionmarketArgs, 'id' | 'subgraphError'>>;
  markets?: SubscriptionResolver<Array<ResolversTypes['Market']>, "markets", ParentType, ContextType, RequireFields<SubscriptionmarketsArgs, 'skip' | 'first' | 'subgraphError'>>;
  depth?: SubscriptionResolver<Maybe<ResolversTypes['Depth']>, "depth", ParentType, ContextType, RequireFields<SubscriptiondepthArgs, 'id' | 'subgraphError'>>;
  depths?: SubscriptionResolver<Array<ResolversTypes['Depth']>, "depths", ParentType, ContextType, RequireFields<SubscriptiondepthsArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: SubscriptionResolver<Maybe<ResolversTypes['Token']>, "token", ParentType, ContextType, RequireFields<SubscriptiontokenArgs, 'id' | 'subgraphError'>>;
  tokens?: SubscriptionResolver<Array<ResolversTypes['Token']>, "tokens", ParentType, ContextType, RequireFields<SubscriptiontokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type TokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  decimals?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Depth?: DepthResolvers<ContextType>;
  Market?: MarketResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = CloberDevTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/clober-dev/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const cloberDevTransforms = [];
const additionalTypeDefs = [] as any[];
const cloberDevHandler = new GraphqlHandler({
              name: "clober-dev",
              config: {"endpoint":"http://dev-subgraph.coupon.finance/subgraphs/name/core-v1-subgraph"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("clober-dev"),
              logger: logger.child("clober-dev"),
              importFn,
            });
sources[0] = {
          name: 'clober-dev',
          handler: cloberDevHandler,
          transforms: cloberDevTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));