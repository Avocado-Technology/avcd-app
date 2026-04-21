 
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
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
  _Any: { input: unknown; output: unknown; }
};

export type ApiKeyCreated = {
  __typename: 'ApiKeyCreated';
  apiKey: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  keyId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ApiKeyMeta = {
  __typename: 'ApiKeyMeta';
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
  __typename: 'Employee';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organizationId: Maybe<Scalars['String']['output']>;
  salary: Scalars['Float']['output'];
  storeId: Maybe<Scalars['String']['output']>;
};

export type EmployeeConnection = {
  __typename: 'EmployeeConnection';
  edges: Array<EmployeeEdge>;
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type EmployeeEdge = {
  __typename: 'EmployeeEdge';
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
  storeId?: InputMaybe<StringFilterInput>;
};

export type EmployeeInput = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  salary: Scalars['Float']['input'];
  storeId?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  salary?: InputMaybe<Scalars['Float']['input']>;
};

export type FinanceAccount = {
  __typename: 'FinanceAccount';
  currency: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  kind: FinanceAccountKind;
  name: Scalars['String']['output'];
  openingBalanceCents: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
};

export type FinanceAccountInput = {
  currency: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  kind: FinanceAccountKind;
  name: Scalars['String']['input'];
  openingBalanceCents?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
};

export enum FinanceAccountKind {
  Asset = 'ASSET',
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type FinanceAccountUpdateInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  openingBalanceCents?: InputMaybe<Scalars['Int']['input']>;
};

export type FinanceSummary = {
  __typename: 'FinanceSummary';
  currency: Scalars['String']['output'];
  dateFrom: Maybe<Scalars['String']['output']>;
  dateTo: Maybe<Scalars['String']['output']>;
  netCents: Scalars['Int']['output'];
  totalExpenseCents: Scalars['Int']['output'];
  totalIncomeCents: Scalars['Int']['output'];
};

export type FinanceTransaction = {
  __typename: 'FinanceTransaction';
  accountId: Scalars['String']['output'];
  amountCents: Scalars['Int']['output'];
  categoryId: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  date: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  reference: Maybe<Scalars['String']['output']>;
  status: FinanceTransactionStatusEnum;
  type: FinanceTransactionTypeEnum;
};

export type FinanceTransactionInput = {
  accountId: Scalars['String']['input'];
  amountCents: Scalars['Int']['input'];
  categoryId: Scalars['String']['input'];
  currency: Scalars['String']['input'];
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<FinanceTransactionStatusEnum>;
  type: FinanceTransactionTypeEnum;
};

export enum FinanceTransactionStatusEnum {
  Draft = 'DRAFT',
  Posted = 'POSTED'
}

export enum FinanceTransactionTypeEnum {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

export type FinanceTransactionUpdateInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amountCents?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<FinanceTransactionStatusEnum>;
  type?: InputMaybe<FinanceTransactionTypeEnum>;
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
  __typename: 'Mutation';
  createApiKey: ApiKeyCreated;
  createEmployee: Employee;
  createFinanceAccount: FinanceAccount;
  createFinanceTransaction: FinanceTransaction;
  createOrganization: Organization;
  createStore: Store;
  createUser: User;
  deleteEmployee: Scalars['Boolean']['output'];
  deleteFinanceAccount: Scalars['Boolean']['output'];
  deleteFinanceTransaction: Scalars['Boolean']['output'];
  deleteOrganization: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  revokeApiKey: Scalars['Boolean']['output'];
  updateEmployee: Maybe<Employee>;
  updateFinanceAccount: Maybe<FinanceAccount>;
  updateFinanceTransaction: Maybe<FinanceTransaction>;
  updateOrganization: Maybe<Organization>;
  updateStore: Maybe<Store>;
  updateUser: Maybe<User>;
};


export type MutationCreateApiKeyArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateEmployeeArgs = {
  data: EmployeeInput;
};


export type MutationCreateFinanceAccountArgs = {
  data: FinanceAccountInput;
};


export type MutationCreateFinanceTransactionArgs = {
  data: FinanceTransactionInput;
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


export type MutationDeleteFinanceAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFinanceTransactionArgs = {
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


export type MutationUpdateFinanceAccountArgs = {
  data: FinanceAccountUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateFinanceTransactionArgs = {
  data: FinanceTransactionUpdateInput;
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
  __typename: 'Organization';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type OrganizationConnection = {
  __typename: 'OrganizationConnection';
  edges: Array<OrganizationEdge>;
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type OrganizationEdge = {
  __typename: 'OrganizationEdge';
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
  __typename: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename: 'Query';
  _service: _Service;
  apiKeys: Array<ApiKeyMeta>;
  employee: Maybe<Employee>;
  employees: Array<Employee>;
  employeesConnection: EmployeeConnection;
  financeAccount: Maybe<FinanceAccount>;
  financeAccounts: Array<FinanceAccount>;
  financeSummary: FinanceSummary;
  financeTransaction: Maybe<FinanceTransaction>;
  financeTransactions: Array<FinanceTransaction>;
  llmApiGuide: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organizations: Array<Organization>;
  organizationsConnection: OrganizationConnection;
  store: Maybe<Store>;
  stores: Array<Store>;
  storesConnection: StoreConnection;
  user: Maybe<User>;
  users: Array<User>;
  usersConnection: UserConnection;
};


export type QueryEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type QueryEmployeesArgs = {
  organizationId?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEmployeesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeTotalCount?: Scalars['Boolean']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<EmployeeFilterInput>;
};


export type QueryFinanceAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryFinanceAccountsArgs = {
  organizationId: Scalars['String']['input'];
};


export type QueryFinanceSummaryArgs = {
  currency: Scalars['String']['input'];
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};


export type QueryFinanceTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryFinanceTransactionsArgs = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<FinanceTransactionStatusEnum>;
  txnType?: InputMaybe<FinanceTransactionTypeEnum>;
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
  __typename: 'Store';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
};

export type StoreConnection = {
  __typename: 'StoreConnection';
  edges: Array<StoreEdge>;
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type StoreEdge = {
  __typename: 'StoreEdge';
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
  __typename: 'User';
  address: Scalars['String']['output'];
  createdAt: Maybe<Scalars['String']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastActiveAt: Maybe<Scalars['String']['output']>;
  lastLoginAt: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ownerSub: Scalars['String']['output'];
};

export type UserConnection = {
  __typename: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type UserEdge = {
  __typename: 'UserEdge';
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
  __typename: '_Service';
  sdl: Scalars['String']['output'];
};

export type EmployeeFieldsFragment = { __typename: 'Employee', id: string, name: string, address: string, salary: number, organizationId: string | null };

export type FinanceAccountFieldsFragment = { __typename: 'FinanceAccount', id: string, organizationId: string, name: string, kind: FinanceAccountKind, currency: string, openingBalanceCents: number, description: string | null, isActive: boolean };

export type FinanceTransactionFieldsFragment = { __typename: 'FinanceTransaction', id: string, organizationId: string, date: string, type: FinanceTransactionTypeEnum, amountCents: number, currency: string, accountId: string, categoryId: string, description: string, reference: string | null, status: FinanceTransactionStatusEnum };

export type OrganizationFieldsFragment = { __typename: 'Organization', id: string, name: string, address: string, userId: string };

export type StoreFieldsFragment = { __typename: 'Store', id: string, name: string, address: string, organizationId: string };

export type GetFinanceAccountsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetFinanceAccountsQuery = { financeAccounts: Array<{ __typename: 'FinanceAccount', id: string, organizationId: string, name: string, kind: FinanceAccountKind, currency: string, openingBalanceCents: number, description: string | null, isActive: boolean }> };

export type GetFinanceTransactionsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetFinanceTransactionsQuery = { financeTransactions: Array<{ __typename: 'FinanceTransaction', id: string, organizationId: string, date: string, type: FinanceTransactionTypeEnum, amountCents: number, currency: string, accountId: string, categoryId: string, description: string, reference: string | null, status: FinanceTransactionStatusEnum }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { organizations: Array<{ __typename: 'Organization', id: string, name: string, address: string, userId: string }> };

export type GetStoresByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetStoresByOrganizationQuery = { stores: Array<{ __typename: 'Store', id: string, name: string, address: string, organizationId: string }> };

export type GetEmployeesByOrganizationQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type GetEmployeesByOrganizationQuery = { employees: Array<{ __typename: 'Employee', id: string, name: string, address: string, salary: number, organizationId: string | null }> };

export const EmployeeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmployeeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Employee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]} as unknown as DocumentNode<EmployeeFieldsFragment, unknown>;
export const FinanceAccountFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FinanceAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FinanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalanceCents"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<FinanceAccountFieldsFragment, unknown>;
export const FinanceTransactionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FinanceTransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FinanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<FinanceTransactionFieldsFragment, unknown>;
export const OrganizationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<OrganizationFieldsFragment, unknown>;
export const StoreFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]} as unknown as DocumentNode<StoreFieldsFragment, unknown>;
export const GetFinanceAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFinanceAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"financeAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FinanceAccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FinanceAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FinanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalanceCents"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<GetFinanceAccountsQuery, GetFinanceAccountsQueryVariables>;
export const GetFinanceTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFinanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"financeTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FinanceTransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FinanceTransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FinanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetFinanceTransactionsQuery, GetFinanceTransactionsQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetStoresByOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStoresByOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]} as unknown as DocumentNode<GetStoresByOrganizationQuery, GetStoresByOrganizationQueryVariables>;
export const GetEmployeesByOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployeesByOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EmployeeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmployeeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Employee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]} as unknown as DocumentNode<GetEmployeesByOrganizationQuery, GetEmployeesByOrganizationQueryVariables>;