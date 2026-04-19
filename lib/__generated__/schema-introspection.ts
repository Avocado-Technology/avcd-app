/* eslint-disable @typescript-eslint/no-explicit-any */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _Any: { input: any; output: any; }
};

export type ApiKeyCreated = {
  __typename?: 'ApiKeyCreated';
  apiKey: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  keyId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ApiKeyMeta = {
  __typename?: 'ApiKeyMeta';
  createdAt: Scalars['String']['output'];
  keyId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DateTimeFilterInput = {
  Eq?: InputMaybe<Scalars['String']['input']>;
  Gt?: InputMaybe<Scalars['String']['input']>;
  Gte?: InputMaybe<Scalars['String']['input']>;
  Lt?: InputMaybe<Scalars['String']['input']>;
  Lte?: InputMaybe<Scalars['String']['input']>;
  Neq?: InputMaybe<Scalars['String']['input']>;
};

export type Employee = {
  __typename?: 'Employee';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  salary: Scalars['Float']['output'];
};

export type EmployeeConnection = {
  __typename?: 'EmployeeConnection';
  edges: Array<EmployeeEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type EmployeeEdge = {
  __typename?: 'EmployeeEdge';
  cursor: Scalars['String']['output'];
  node: Employee;
};

export type EmployeeFilterInput = {
  And?: InputMaybe<Array<EmployeeFilterInput>>;
  Not?: InputMaybe<EmployeeFilterInput>;
  Or?: InputMaybe<Array<EmployeeFilterInput>>;
  address?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  organizationId?: InputMaybe<StringFilterInput>;
  salary?: InputMaybe<FloatFilterInput>;
};

export type EmployeeInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  salary: Scalars['Float']['input'];
};

export type EmployeeUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  salary?: InputMaybe<Scalars['Float']['input']>;
};

export type FloatFilterInput = {
  Eq?: InputMaybe<Scalars['Float']['input']>;
  Gt?: InputMaybe<Scalars['Float']['input']>;
  Gte?: InputMaybe<Scalars['Float']['input']>;
  In?: InputMaybe<Array<Scalars['Float']['input']>>;
  Lt?: InputMaybe<Scalars['Float']['input']>;
  Lte?: InputMaybe<Scalars['Float']['input']>;
  Neq?: InputMaybe<Scalars['Float']['input']>;
  Nin?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createApiKey: ApiKeyCreated;
  createEmployee: Employee;
  createOrganization: Organization;
  createStore: Store;
  createUser: User;
  deleteEmployee: Scalars['Boolean']['output'];
  deleteOrganization: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  revokeApiKey: Scalars['Boolean']['output'];
  updateEmployee?: Maybe<Employee>;
  updateOrganization?: Maybe<Organization>;
  updateStore?: Maybe<Store>;
  updateUser?: Maybe<User>;
};


export type MutationCreateApiKeyArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateEmployeeArgs = {
  data: EmployeeInput;
};


export type MutationCreateOrganizationArgs = {
  data: OrganizationInput;
};


export type MutationCreateStoreArgs = {
  data: StoreInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteStoreArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationRevokeApiKeyArgs = {
  keyId: Scalars['String']['input'];
};


export type MutationUpdateEmployeeArgs = {
  data: EmployeeUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateOrganizationArgs = {
  data: OrganizationUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateStoreArgs = {
  data: StoreUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  id: Scalars['String']['input'];
};

export type Organization = {
  __typename?: 'Organization';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type OrganizationConnection = {
  __typename?: 'OrganizationConnection';
  edges: Array<OrganizationEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type OrganizationEdge = {
  __typename?: 'OrganizationEdge';
  cursor: Scalars['String']['output'];
  node: Organization;
};

export type OrganizationFilterInput = {
  And?: InputMaybe<Array<OrganizationFilterInput>>;
  Not?: InputMaybe<OrganizationFilterInput>;
  Or?: InputMaybe<Array<OrganizationFilterInput>>;
  address?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
};

export type OrganizationInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type OrganizationUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  apiKeys: Array<ApiKeyMeta>;
  employee?: Maybe<Employee>;
  employees: Array<Employee>;
  employeesConnection: EmployeeConnection;
  llmApiGuide: Scalars['String']['output'];
  organization?: Maybe<Organization>;
  organizations: Array<Organization>;
  organizationsConnection: OrganizationConnection;
  store?: Maybe<Store>;
  stores: Array<Store>;
  storesConnection: StoreConnection;
  user?: Maybe<User>;
  users: Array<User>;
  usersConnection: UserConnection;
};


export type QueryEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type QueryEmployeesArgs = {
  organizationId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEmployeesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeTotalCount?: Scalars['Boolean']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<EmployeeFilterInput>;
};


export type QueryOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrganizationsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeTotalCount?: Scalars['Boolean']['input'];
  where?: InputMaybe<OrganizationFilterInput>;
};


export type QueryStoreArgs = {
  id: Scalars['String']['input'];
};


export type QueryStoresArgs = {
  organizationId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStoresConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeTotalCount?: Scalars['Boolean']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StoreFilterInput>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeTotalCount?: Scalars['Boolean']['input'];
  where?: InputMaybe<UserFilterInput>;
};

export type Store = {
  __typename?: 'Store';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
};

export type StoreConnection = {
  __typename?: 'StoreConnection';
  edges: Array<StoreEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type StoreEdge = {
  __typename?: 'StoreEdge';
  cursor: Scalars['String']['output'];
  node: Store;
};

export type StoreFilterInput = {
  And?: InputMaybe<Array<StoreFilterInput>>;
  Not?: InputMaybe<StoreFilterInput>;
  Or?: InputMaybe<Array<StoreFilterInput>>;
  address?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  organizationId?: InputMaybe<StringFilterInput>;
};

export type StoreInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};

export type StoreUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type StringFilterInput = {
  Eq?: InputMaybe<Scalars['String']['input']>;
  Ilike?: InputMaybe<Scalars['String']['input']>;
  In?: InputMaybe<Array<Scalars['String']['input']>>;
  Like?: InputMaybe<Scalars['String']['input']>;
  Neq?: InputMaybe<Scalars['String']['input']>;
  Nin?: InputMaybe<Array<Scalars['String']['input']>>;
  Regex?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastActiveAt?: Maybe<Scalars['String']['output']>;
  lastLoginAt?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ownerSub: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserFilterInput = {
  And?: InputMaybe<Array<UserFilterInput>>;
  Not?: InputMaybe<UserFilterInput>;
  Or?: InputMaybe<Array<UserFilterInput>>;
  address?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateTimeFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
};

export type UserInput = {
  address: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UserUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};
