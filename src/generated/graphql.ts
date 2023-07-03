import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  StringOrInt: any;
};

export type AddToCollectionResponse = {
  __typename?: 'AddToCollectionResponse';
  instance_id: Scalars['String'];
};

export type Artist = {
  __typename?: 'Artist';
  name?: Maybe<Scalars['String']>;
};

export type ArtistMember = {
  __typename?: 'ArtistMember';
  active?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  thumbnail_url?: Maybe<Scalars['String']>;
};

export type ArtistPage = {
  __typename?: 'ArtistPage';
  images?: Maybe<Array<Maybe<Image>>>;
  members?: Maybe<Array<Maybe<ArtistMember>>>;
  name: Scalars['String'];
  namevariations?: Maybe<Array<Maybe<Scalars['String']>>>;
  profile?: Maybe<Scalars['String']>;
};

export type ArtistSearch = {
  __typename?: 'ArtistSearch';
  cover_image?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  thumb?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: Scalars['String'];
  user_data: UserData;
};

export type ArtistSearchResult = {
  __typename?: 'ArtistSearchResult';
  isArtists?: Maybe<Scalars['Boolean']>;
  pagination: Pagination;
  results: Array<Maybe<ArtistSearch>>;
};

export type BasicInformation = {
  __typename?: 'BasicInformation';
  artists?: Maybe<Array<Maybe<Artist>>>;
  country?: Maybe<Scalars['String']>;
  format?: Maybe<Array<Maybe<Scalars['String']>>>;
  formats?: Maybe<Array<Maybe<Format>>>;
  genres?: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['ID'];
  label?: Maybe<Array<Maybe<Scalars['String']>>>;
  released?: Maybe<Scalars['String']>;
  styles?: Maybe<Array<Maybe<Scalars['String']>>>;
  thumb?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  user_data?: Maybe<UserData>;
  year?: Maybe<Scalars['StringOrInt']>;
};

export type Collection = {
  __typename?: 'Collection';
  pagination: Pagination;
  releases: Array<Maybe<CollectionInstance>>;
};

export type CollectionInstance = {
  __typename?: 'CollectionInstance';
  basic_information: BasicInformation;
  date_added?: Maybe<Scalars['String']>;
  folder_id?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  instance_id: Scalars['ID'];
  notes?: Maybe<Array<Maybe<InstanceNotes>>>;
  rating?: Maybe<Scalars['Float']>;
};

export type Company = {
  __typename?: 'Company';
  entity_type_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CustomField = {
  __typename?: 'CustomField';
  id: Scalars['Int'];
  lines?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  options?: Maybe<Array<Maybe<Scalars['String']>>>;
  position: Scalars['Int'];
  public: Scalars['Boolean'];
  type: Scalars['String'];
};

export type CustomFieldsResponse = {
  __typename?: 'CustomFieldsResponse';
  fields?: Maybe<Array<Maybe<CustomField>>>;
};

export type DiscogsCommunity = {
  __typename?: 'DiscogsCommunity';
  have: Scalars['Int'];
  rating: DiscogsRating;
  want: Scalars['Int'];
};

export type DiscogsMasterVersions = {
  __typename?: 'DiscogsMasterVersions';
  pagination?: Maybe<Pagination>;
  versions?: Maybe<Array<Maybe<Releases>>>;
};

export type DiscogsRating = {
  __typename?: 'DiscogsRating';
  average: Scalars['Float'];
  count: Scalars['Int'];
};

export type DiscogsStats = {
  __typename?: 'DiscogsStats';
  community: UserData;
  user: UserData;
};

export type DiscogsVersions = {
  __typename?: 'DiscogsVersions';
  country?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['String']>;
  stats?: Maybe<DiscogsStats>;
  thumb?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Folder = {
  __typename?: 'Folder';
  count: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Format = {
  __typename?: 'Format';
  descriptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type Identifier = {
  __typename?: 'Identifier';
  description?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  value: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  height?: Maybe<Scalars['Int']>;
  resource_url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type InstanceNotes = {
  __typename?: 'InstanceNotes';
  field_id?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
};

export type IsInCollectionResponse = {
  __typename?: 'IsInCollectionResponse';
  isInCollection: Scalars['Boolean'];
  pagination: Pagination;
  releases: Array<Maybe<CollectionInstance>>;
};

export type Label = {
  __typename?: 'Label';
  name?: Maybe<Scalars['String']>;
};

export type MasterRelease = {
  __typename?: 'MasterRelease';
  artists: Array<Maybe<Artist>>;
  genres: Array<Maybe<Scalars['String']>>;
  id: Scalars['ID'];
  images?: Maybe<Array<Maybe<Image>>>;
  lowest_price?: Maybe<Scalars['Float']>;
  main_release?: Maybe<Scalars['Int']>;
  most_recent_release?: Maybe<Scalars['Int']>;
  num_for_sale?: Maybe<Scalars['Int']>;
  released?: Maybe<Scalars['String']>;
  styles?: Maybe<Array<Maybe<Scalars['String']>>>;
  title: Scalars['String'];
  tracklist: Array<Maybe<TrackList>>;
  year?: Maybe<Scalars['StringOrInt']>;
};

export type MasterSearchResult = {
  __typename?: 'MasterSearchResult';
  isMasters?: Maybe<Scalars['Boolean']>;
  pagination: Pagination;
  results: Array<Maybe<Releases>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addRating?: Maybe<VrRating>;
  addRelease: VrRelease;
  addToCollection?: Maybe<AddToCollectionResponse>;
  addWashedOn?: Maybe<UserCopy>;
  removeFromCollection?: Maybe<RemoveFromCollectionResponse>;
};


export type MutationAddRatingArgs = {
  clarity: Scalars['Int'];
  flatness: Scalars['Int'];
  notes?: InputMaybe<Scalars['String']>;
  quietness: Scalars['Int'];
  releaseId: Scalars['Int'];
};


export type MutationAddReleaseArgs = {
  artist: Scalars['String'];
  instanceId: Scalars['Int'];
  releaseId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationAddToCollectionArgs = {
  folderId: Scalars['Int'];
  releaseId: Scalars['Int'];
};


export type MutationAddWashedOnArgs = {
  artist: Scalars['String'];
  instanceId: Scalars['Int'];
  releaseId: Scalars['Int'];
  title: Scalars['String'];
  washedOn: Scalars['String'];
};


export type MutationRemoveFromCollectionArgs = {
  folderId: Scalars['Int'];
  instanceId: Scalars['Int'];
  releaseId: Scalars['Int'];
};

export type Pagination = {
  __typename?: 'Pagination';
  items: Scalars['Int'];
  page: Scalars['Int'];
  pages: Scalars['Int'];
  per_page: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getArtist: ArtistPage;
  getCollection: Collection;
  getCustomFields: CustomFieldsResponse;
  getFolders: Array<Maybe<Folder>>;
  getMasterRelease: MasterRelease;
  getMasterReleaseVersions: DiscogsMasterVersions;
  getRelease: Release;
  getReleaseInCollection: IsInCollectionResponse;
  getSearch?: Maybe<SearchResults>;
  getUser: User;
  getWantList: Wants;
};


export type QueryGetArtistArgs = {
  id: Scalars['Int'];
};


export type QueryGetCollectionArgs = {
  folder?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  sort_order?: InputMaybe<Scalars['String']>;
};


export type QueryGetMasterReleaseArgs = {
  id: Scalars['Int'];
};


export type QueryGetMasterReleaseVersionsArgs = {
  country?: InputMaybe<Scalars['String']>;
  master_id?: InputMaybe<Scalars['ID']>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  released?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  sort_order?: InputMaybe<Scalars['String']>;
};


export type QueryGetReleaseArgs = {
  id: Scalars['Int'];
  instanceId?: InputMaybe<Scalars['Int']>;
};


export type QueryGetReleaseInCollectionArgs = {
  id: Scalars['Int'];
};


export type QueryGetSearchArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  sort_order?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryGetUserArgs = {
  auth: Scalars['String'];
};


export type QueryGetWantListArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  sort_order?: InputMaybe<Scalars['String']>;
};

export type Ratings = {
  clarity: Scalars['Float'];
  flatness: Scalars['Float'];
  quietness: Scalars['Float'];
};

export type Release = {
  __typename?: 'Release';
  artists: Array<Maybe<Artist>>;
  artists_sort?: Maybe<Scalars['String']>;
  community?: Maybe<DiscogsCommunity>;
  companies: Array<Maybe<Company>>;
  country?: Maybe<Scalars['String']>;
  formats: Array<Maybe<Format>>;
  genres: Array<Maybe<Scalars['String']>>;
  id: Scalars['ID'];
  identifiers: Array<Maybe<Identifier>>;
  images?: Maybe<Array<Maybe<Image>>>;
  labels: Array<Maybe<Label>>;
  master_id: Scalars['ID'];
  notes?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['String']>;
  series: Array<Maybe<SeriesEntry>>;
  styles?: Maybe<Array<Maybe<Scalars['String']>>>;
  thumb: Scalars['String'];
  title: Scalars['String'];
  tracklist: Array<Maybe<TrackList>>;
  uri: Scalars['String'];
  vinylRatingsRelease?: Maybe<VrRelease>;
  year?: Maybe<Scalars['StringOrInt']>;
};

export type Releases = {
  __typename?: 'Releases';
  basic_information: BasicInformation;
  date_added?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  rating?: Maybe<Scalars['Float']>;
};

export type ReleasesSearchResult = {
  __typename?: 'ReleasesSearchResult';
  isReleases?: Maybe<Scalars['Boolean']>;
  pagination: Pagination;
  results: Array<Maybe<Releases>>;
};

export type RemoveFromCollectionResponse = {
  __typename?: 'RemoveFromCollectionResponse';
  isGood?: Maybe<Scalars['Boolean']>;
};

export type SearchResults = ArtistSearchResult | MasterSearchResult | ReleasesSearchResult;

export type SeriesEntry = {
  __typename?: 'SeriesEntry';
  entity_type_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type TrackList = {
  __typename?: 'TrackList';
  duration: Scalars['String'];
  position: Scalars['String'];
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  avatarUrl: Scalars['String'];
  discogsUserId: Scalars['Int'];
  releasesRated: Scalars['Int'];
  token: Scalars['String'];
  username: Scalars['String'];
  vinylRatings?: Maybe<Array<Maybe<VrRating>>>;
};

export type UserCopy = {
  __typename?: 'UserCopy';
  instanceId?: Maybe<Scalars['Int']>;
  notes?: Maybe<Array<Maybe<InstanceNotes>>>;
  releaseId?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  washedOn?: Maybe<Scalars['String']>;
};

export type UserData = {
  __typename?: 'UserData';
  in_collection?: Maybe<Scalars['Boolean']>;
  in_wantlist?: Maybe<Scalars['Boolean']>;
};

export type VrRating = {
  __typename?: 'VRRating';
  _id: Scalars['ID'];
  clarity: Scalars['Float'];
  createdAt?: Maybe<Scalars['String']>;
  flatness: Scalars['Float'];
  notes?: Maybe<Scalars['String']>;
  quietness: Scalars['Float'];
  rating?: Maybe<Scalars['Float']>;
  release?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type VrRelease = {
  __typename?: 'VRRelease';
  artist: Scalars['String'];
  clarityAvg: Scalars['Float'];
  currentUserRating?: Maybe<VrRating>;
  flatnessAvg: Scalars['Float'];
  quietnessAvg: Scalars['Float'];
  ratingAvg: Scalars['Float'];
  ratingsCount: Scalars['Int'];
  releaseId: Scalars['Int'];
  title: Scalars['String'];
  userCopy?: Maybe<UserCopy>;
  vinylRatings?: Maybe<Array<Maybe<VrRating>>>;
};

export type WantListReleases = {
  __typename?: 'WantListReleases';
  basic_information: BasicInformation;
  id?: Maybe<Scalars['Int']>;
  rating?: Maybe<Scalars['Int']>;
};

export type Wants = {
  __typename?: 'Wants';
  pagination: Pagination;
  wants?: Maybe<Array<Maybe<WantListReleases>>>;
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

/** Mapping of union types */
export type ResolversUnionTypes = ResolversObject<{
  SearchResults: ( ArtistSearchResult ) | ( MasterSearchResult ) | ( ReleasesSearchResult );
}>;

/** Mapping of union parent types */
export type ResolversUnionParentTypes = ResolversObject<{
  SearchResults: ( ArtistSearchResult ) | ( MasterSearchResult ) | ( ReleasesSearchResult );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddToCollectionResponse: ResolverTypeWrapper<AddToCollectionResponse>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Artist: ResolverTypeWrapper<Artist>;
  ArtistMember: ResolverTypeWrapper<ArtistMember>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ArtistPage: ResolverTypeWrapper<ArtistPage>;
  ArtistSearch: ResolverTypeWrapper<ArtistSearch>;
  ArtistSearchResult: ResolverTypeWrapper<ArtistSearchResult>;
  BasicInformation: ResolverTypeWrapper<BasicInformation>;
  Collection: ResolverTypeWrapper<Collection>;
  CollectionInstance: ResolverTypeWrapper<CollectionInstance>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Company: ResolverTypeWrapper<Company>;
  CustomField: ResolverTypeWrapper<CustomField>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  CustomFieldsResponse: ResolverTypeWrapper<CustomFieldsResponse>;
  DiscogsCommunity: ResolverTypeWrapper<DiscogsCommunity>;
  DiscogsMasterVersions: ResolverTypeWrapper<DiscogsMasterVersions>;
  DiscogsRating: ResolverTypeWrapper<DiscogsRating>;
  DiscogsStats: ResolverTypeWrapper<DiscogsStats>;
  DiscogsVersions: ResolverTypeWrapper<DiscogsVersions>;
  Folder: ResolverTypeWrapper<Folder>;
  Format: ResolverTypeWrapper<Format>;
  Identifier: ResolverTypeWrapper<Identifier>;
  Image: ResolverTypeWrapper<Image>;
  InstanceNotes: ResolverTypeWrapper<InstanceNotes>;
  IsInCollectionResponse: ResolverTypeWrapper<IsInCollectionResponse>;
  Label: ResolverTypeWrapper<Label>;
  MasterRelease: ResolverTypeWrapper<MasterRelease>;
  MasterSearchResult: ResolverTypeWrapper<MasterSearchResult>;
  Mutation: ResolverTypeWrapper<{}>;
  Pagination: ResolverTypeWrapper<Pagination>;
  Query: ResolverTypeWrapper<{}>;
  Ratings: Ratings;
  Release: ResolverTypeWrapper<Release>;
  Releases: ResolverTypeWrapper<Releases>;
  ReleasesSearchResult: ResolverTypeWrapper<ReleasesSearchResult>;
  RemoveFromCollectionResponse: ResolverTypeWrapper<RemoveFromCollectionResponse>;
  SearchResults: ResolverTypeWrapper<ResolversUnionTypes['SearchResults']>;
  SeriesEntry: ResolverTypeWrapper<SeriesEntry>;
  StringOrInt: ResolverTypeWrapper<Scalars['StringOrInt']>;
  TrackList: ResolverTypeWrapper<TrackList>;
  User: ResolverTypeWrapper<User>;
  UserCopy: ResolverTypeWrapper<UserCopy>;
  UserData: ResolverTypeWrapper<UserData>;
  VRRating: ResolverTypeWrapper<VrRating>;
  VRRelease: ResolverTypeWrapper<VrRelease>;
  WantListReleases: ResolverTypeWrapper<WantListReleases>;
  Wants: ResolverTypeWrapper<Wants>;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddToCollectionResponse: AddToCollectionResponse;
  String: Scalars['String'];
  Artist: Artist;
  ArtistMember: ArtistMember;
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  ArtistPage: ArtistPage;
  ArtistSearch: ArtistSearch;
  ArtistSearchResult: ArtistSearchResult;
  BasicInformation: BasicInformation;
  Collection: Collection;
  CollectionInstance: CollectionInstance;
  Float: Scalars['Float'];
  Company: Company;
  CustomField: CustomField;
  Int: Scalars['Int'];
  CustomFieldsResponse: CustomFieldsResponse;
  DiscogsCommunity: DiscogsCommunity;
  DiscogsMasterVersions: DiscogsMasterVersions;
  DiscogsRating: DiscogsRating;
  DiscogsStats: DiscogsStats;
  DiscogsVersions: DiscogsVersions;
  Folder: Folder;
  Format: Format;
  Identifier: Identifier;
  Image: Image;
  InstanceNotes: InstanceNotes;
  IsInCollectionResponse: IsInCollectionResponse;
  Label: Label;
  MasterRelease: MasterRelease;
  MasterSearchResult: MasterSearchResult;
  Mutation: {};
  Pagination: Pagination;
  Query: {};
  Ratings: Ratings;
  Release: Release;
  Releases: Releases;
  ReleasesSearchResult: ReleasesSearchResult;
  RemoveFromCollectionResponse: RemoveFromCollectionResponse;
  SearchResults: ResolversUnionParentTypes['SearchResults'];
  SeriesEntry: SeriesEntry;
  StringOrInt: Scalars['StringOrInt'];
  TrackList: TrackList;
  User: User;
  UserCopy: UserCopy;
  UserData: UserData;
  VRRating: VrRating;
  VRRelease: VrRelease;
  WantListReleases: WantListReleases;
  Wants: Wants;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AddToCollectionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddToCollectionResponse'] = ResolversParentTypes['AddToCollectionResponse']> = ResolversObject<{
  instance_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArtistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Artist'] = ResolversParentTypes['Artist']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArtistMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArtistMember'] = ResolversParentTypes['ArtistMember']> = ResolversObject<{
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  thumbnail_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArtistPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArtistPage'] = ResolversParentTypes['ArtistPage']> = ResolversObject<{
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['Image']>>>, ParentType, ContextType>;
  members?: Resolver<Maybe<Array<Maybe<ResolversTypes['ArtistMember']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  namevariations?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArtistSearchResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArtistSearch'] = ResolversParentTypes['ArtistSearch']> = ResolversObject<{
  cover_image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  thumb?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_data?: Resolver<ResolversTypes['UserData'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArtistSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArtistSearchResult'] = ResolversParentTypes['ArtistSearchResult']> = ResolversObject<{
  isArtists?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['ArtistSearch']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BasicInformationResolvers<ContextType = any, ParentType extends ResolversParentTypes['BasicInformation'] = ResolversParentTypes['BasicInformation']> = ResolversObject<{
  artists?: Resolver<Maybe<Array<Maybe<ResolversTypes['Artist']>>>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  format?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  formats?: Resolver<Maybe<Array<Maybe<ResolversTypes['Format']>>>, ParentType, ContextType>;
  genres?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  released?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  styles?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  thumb?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_data?: Resolver<Maybe<ResolversTypes['UserData']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['StringOrInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = ResolversObject<{
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  releases?: Resolver<Array<Maybe<ResolversTypes['CollectionInstance']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CollectionInstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionInstance'] = ResolversParentTypes['CollectionInstance']> = ResolversObject<{
  basic_information?: Resolver<ResolversTypes['BasicInformation'], ParentType, ContextType>;
  date_added?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  folder_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instance_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<Array<Maybe<ResolversTypes['InstanceNotes']>>>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = ResolversObject<{
  entity_type_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomFieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomField'] = ResolversParentTypes['CustomField']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lines?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CustomFieldsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomFieldsResponse'] = ResolversParentTypes['CustomFieldsResponse']> = ResolversObject<{
  fields?: Resolver<Maybe<Array<Maybe<ResolversTypes['CustomField']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscogsCommunityResolvers<ContextType = any, ParentType extends ResolversParentTypes['DiscogsCommunity'] = ResolversParentTypes['DiscogsCommunity']> = ResolversObject<{
  have?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['DiscogsRating'], ParentType, ContextType>;
  want?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscogsMasterVersionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DiscogsMasterVersions'] = ResolversParentTypes['DiscogsMasterVersions']> = ResolversObject<{
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  versions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Releases']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscogsRatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['DiscogsRating'] = ResolversParentTypes['DiscogsRating']> = ResolversObject<{
  average?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscogsStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DiscogsStats'] = ResolversParentTypes['DiscogsStats']> = ResolversObject<{
  community?: Resolver<ResolversTypes['UserData'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserData'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscogsVersionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DiscogsVersions'] = ResolversParentTypes['DiscogsVersions']> = ResolversObject<{
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  released?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<ResolversTypes['DiscogsStats']>, ParentType, ContextType>;
  thumb?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FolderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Folder'] = ResolversParentTypes['Folder']> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FormatResolvers<ContextType = any, ParentType extends ResolversParentTypes['Format'] = ResolversParentTypes['Format']> = ResolversObject<{
  descriptions?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  qty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IdentifierResolvers<ContextType = any, ParentType extends ResolversParentTypes['Identifier'] = ResolversParentTypes['Identifier']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  resource_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InstanceNotesResolvers<ContextType = any, ParentType extends ResolversParentTypes['InstanceNotes'] = ResolversParentTypes['InstanceNotes']> = ResolversObject<{
  field_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IsInCollectionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['IsInCollectionResponse'] = ResolversParentTypes['IsInCollectionResponse']> = ResolversObject<{
  isInCollection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  releases?: Resolver<Array<Maybe<ResolversTypes['CollectionInstance']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MasterReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MasterRelease'] = ResolversParentTypes['MasterRelease']> = ResolversObject<{
  artists?: Resolver<Array<Maybe<ResolversTypes['Artist']>>, ParentType, ContextType>;
  genres?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['Image']>>>, ParentType, ContextType>;
  lowest_price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  main_release?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  most_recent_release?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  num_for_sale?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  released?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  styles?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tracklist?: Resolver<Array<Maybe<ResolversTypes['TrackList']>>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['StringOrInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MasterSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MasterSearchResult'] = ResolversParentTypes['MasterSearchResult']> = ResolversObject<{
  isMasters?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['Releases']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addRating?: Resolver<Maybe<ResolversTypes['VRRating']>, ParentType, ContextType, RequireFields<MutationAddRatingArgs, 'clarity' | 'flatness' | 'quietness' | 'releaseId'>>;
  addRelease?: Resolver<ResolversTypes['VRRelease'], ParentType, ContextType, RequireFields<MutationAddReleaseArgs, 'artist' | 'instanceId' | 'releaseId' | 'title'>>;
  addToCollection?: Resolver<Maybe<ResolversTypes['AddToCollectionResponse']>, ParentType, ContextType, RequireFields<MutationAddToCollectionArgs, 'folderId' | 'releaseId'>>;
  addWashedOn?: Resolver<Maybe<ResolversTypes['UserCopy']>, ParentType, ContextType, RequireFields<MutationAddWashedOnArgs, 'artist' | 'instanceId' | 'releaseId' | 'title' | 'washedOn'>>;
  removeFromCollection?: Resolver<Maybe<ResolversTypes['RemoveFromCollectionResponse']>, ParentType, ContextType, RequireFields<MutationRemoveFromCollectionArgs, 'folderId' | 'instanceId' | 'releaseId'>>;
}>;

export type PaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = ResolversObject<{
  items?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  per_page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getArtist?: Resolver<ResolversTypes['ArtistPage'], ParentType, ContextType, RequireFields<QueryGetArtistArgs, 'id'>>;
  getCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, Partial<QueryGetCollectionArgs>>;
  getCustomFields?: Resolver<ResolversTypes['CustomFieldsResponse'], ParentType, ContextType>;
  getFolders?: Resolver<Array<Maybe<ResolversTypes['Folder']>>, ParentType, ContextType>;
  getMasterRelease?: Resolver<ResolversTypes['MasterRelease'], ParentType, ContextType, RequireFields<QueryGetMasterReleaseArgs, 'id'>>;
  getMasterReleaseVersions?: Resolver<ResolversTypes['DiscogsMasterVersions'], ParentType, ContextType, Partial<QueryGetMasterReleaseVersionsArgs>>;
  getRelease?: Resolver<ResolversTypes['Release'], ParentType, ContextType, RequireFields<QueryGetReleaseArgs, 'id'>>;
  getReleaseInCollection?: Resolver<ResolversTypes['IsInCollectionResponse'], ParentType, ContextType, RequireFields<QueryGetReleaseInCollectionArgs, 'id'>>;
  getSearch?: Resolver<Maybe<ResolversTypes['SearchResults']>, ParentType, ContextType, Partial<QueryGetSearchArgs>>;
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryGetUserArgs, 'auth'>>;
  getWantList?: Resolver<ResolversTypes['Wants'], ParentType, ContextType, Partial<QueryGetWantListArgs>>;
}>;

export type ReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Release'] = ResolversParentTypes['Release']> = ResolversObject<{
  artists?: Resolver<Array<Maybe<ResolversTypes['Artist']>>, ParentType, ContextType>;
  artists_sort?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  community?: Resolver<Maybe<ResolversTypes['DiscogsCommunity']>, ParentType, ContextType>;
  companies?: Resolver<Array<Maybe<ResolversTypes['Company']>>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  formats?: Resolver<Array<Maybe<ResolversTypes['Format']>>, ParentType, ContextType>;
  genres?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identifiers?: Resolver<Array<Maybe<ResolversTypes['Identifier']>>, ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['Image']>>>, ParentType, ContextType>;
  labels?: Resolver<Array<Maybe<ResolversTypes['Label']>>, ParentType, ContextType>;
  master_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  released?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  series?: Resolver<Array<Maybe<ResolversTypes['SeriesEntry']>>, ParentType, ContextType>;
  styles?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  thumb?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tracklist?: Resolver<Array<Maybe<ResolversTypes['TrackList']>>, ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vinylRatingsRelease?: Resolver<Maybe<ResolversTypes['VRRelease']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['StringOrInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReleasesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Releases'] = ResolversParentTypes['Releases']> = ResolversObject<{
  basic_information?: Resolver<ResolversTypes['BasicInformation'], ParentType, ContextType>;
  date_added?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReleasesSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReleasesSearchResult'] = ResolversParentTypes['ReleasesSearchResult']> = ResolversObject<{
  isReleases?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  results?: Resolver<Array<Maybe<ResolversTypes['Releases']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RemoveFromCollectionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveFromCollectionResponse'] = ResolversParentTypes['RemoveFromCollectionResponse']> = ResolversObject<{
  isGood?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SearchResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResults'] = ResolversParentTypes['SearchResults']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ArtistSearchResult' | 'MasterSearchResult' | 'ReleasesSearchResult', ParentType, ContextType>;
}>;

export type SeriesEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['SeriesEntry'] = ResolversParentTypes['SeriesEntry']> = ResolversObject<{
  entity_type_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface StringOrIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['StringOrInt'], any> {
  name: 'StringOrInt';
}

export type TrackListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrackList'] = ResolversParentTypes['TrackList']> = ResolversObject<{
  duration?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discogsUserId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  releasesRated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vinylRatings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VRRating']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserCopyResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserCopy'] = ResolversParentTypes['UserCopy']> = ResolversObject<{
  instanceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<Array<Maybe<ResolversTypes['InstanceNotes']>>>, ParentType, ContextType>;
  releaseId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  washedOn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserData'] = ResolversParentTypes['UserData']> = ResolversObject<{
  in_collection?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  in_wantlist?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VrRatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['VRRating'] = ResolversParentTypes['VRRating']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  clarity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flatness?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quietness?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  release?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VrReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VRRelease'] = ResolversParentTypes['VRRelease']> = ResolversObject<{
  artist?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  clarityAvg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currentUserRating?: Resolver<Maybe<ResolversTypes['VRRating']>, ParentType, ContextType>;
  flatnessAvg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quietnessAvg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ratingAvg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ratingsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  releaseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userCopy?: Resolver<Maybe<ResolversTypes['UserCopy']>, ParentType, ContextType>;
  vinylRatings?: Resolver<Maybe<Array<Maybe<ResolversTypes['VRRating']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WantListReleasesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WantListReleases'] = ResolversParentTypes['WantListReleases']> = ResolversObject<{
  basic_information?: Resolver<ResolversTypes['BasicInformation'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WantsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Wants'] = ResolversParentTypes['Wants']> = ResolversObject<{
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  wants?: Resolver<Maybe<Array<Maybe<ResolversTypes['WantListReleases']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AddToCollectionResponse?: AddToCollectionResponseResolvers<ContextType>;
  Artist?: ArtistResolvers<ContextType>;
  ArtistMember?: ArtistMemberResolvers<ContextType>;
  ArtistPage?: ArtistPageResolvers<ContextType>;
  ArtistSearch?: ArtistSearchResolvers<ContextType>;
  ArtistSearchResult?: ArtistSearchResultResolvers<ContextType>;
  BasicInformation?: BasicInformationResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  CollectionInstance?: CollectionInstanceResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  CustomField?: CustomFieldResolvers<ContextType>;
  CustomFieldsResponse?: CustomFieldsResponseResolvers<ContextType>;
  DiscogsCommunity?: DiscogsCommunityResolvers<ContextType>;
  DiscogsMasterVersions?: DiscogsMasterVersionsResolvers<ContextType>;
  DiscogsRating?: DiscogsRatingResolvers<ContextType>;
  DiscogsStats?: DiscogsStatsResolvers<ContextType>;
  DiscogsVersions?: DiscogsVersionsResolvers<ContextType>;
  Folder?: FolderResolvers<ContextType>;
  Format?: FormatResolvers<ContextType>;
  Identifier?: IdentifierResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  InstanceNotes?: InstanceNotesResolvers<ContextType>;
  IsInCollectionResponse?: IsInCollectionResponseResolvers<ContextType>;
  Label?: LabelResolvers<ContextType>;
  MasterRelease?: MasterReleaseResolvers<ContextType>;
  MasterSearchResult?: MasterSearchResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Release?: ReleaseResolvers<ContextType>;
  Releases?: ReleasesResolvers<ContextType>;
  ReleasesSearchResult?: ReleasesSearchResultResolvers<ContextType>;
  RemoveFromCollectionResponse?: RemoveFromCollectionResponseResolvers<ContextType>;
  SearchResults?: SearchResultsResolvers<ContextType>;
  SeriesEntry?: SeriesEntryResolvers<ContextType>;
  StringOrInt?: GraphQLScalarType;
  TrackList?: TrackListResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserCopy?: UserCopyResolvers<ContextType>;
  UserData?: UserDataResolvers<ContextType>;
  VRRating?: VrRatingResolvers<ContextType>;
  VRRelease?: VrReleaseResolvers<ContextType>;
  WantListReleases?: WantListReleasesResolvers<ContextType>;
  Wants?: WantsResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
}>;

import { ObjectId } from 'mongodb';