/* eslint-disable */
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
  /** Date with time (isoformat) */
  DateTime: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](https://ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf). */
  JSON: { input: Record<string, any>; output: Record<string, any>; }
  _Any: { input: unknown; output: unknown; }
};

export type ApiKeyCreated = {
  __typename: 'ApiKeyCreated';
  apiKey: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  keyId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ApiKeyCreatedResult = {
  __typename: 'ApiKeyCreatedResult';
  data: Maybe<ApiKeyCreated>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type ApiKeyMeta = {
  __typename: 'ApiKeyMeta';
  createdAt: Scalars['String']['output'];
  keyId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type BoolResult = {
  __typename: 'BoolResult';
  data: Maybe<Scalars['Boolean']['output']>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type DateTimeFilterInput = {
  Eq?: InputMaybe<Scalars['String']['input']>;
  Gt?: InputMaybe<Scalars['String']['input']>;
  Gte?: InputMaybe<Scalars['String']['input']>;
  Lt?: InputMaybe<Scalars['String']['input']>;
  Lte?: InputMaybe<Scalars['String']['input']>;
  Neq?: InputMaybe<Scalars['String']['input']>;
};

export type DistributionResult = {
  __typename: 'DistributionResult';
  distributableAmount: Scalars['Float']['output'];
  distributions: Array<TipDistribution>;
  ownerRetained: Scalars['Float']['output'];
  retentionPercentage: Scalars['Float']['output'];
  tipId: Scalars['String']['output'];
  totalCollected: Scalars['Float']['output'];
};

export type DistributionResultResult = {
  __typename: 'DistributionResultResult';
  data: Maybe<DistributionResult>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type DomainEvent = {
  __typename: 'DomainEvent';
  action: Scalars['String']['output'];
  data: Maybe<Scalars['JSON']['output']>;
  entity: Scalars['String']['output'];
  entityId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  occurredAt: Scalars['DateTime']['output'];
};

export type Employee = {
  __typename: 'Employee';
  address: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  organizationId: Maybe<Scalars['String']['output']>;
  points: Scalars['Float']['output'];
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
  points?: InputMaybe<Scalars['Float']['input']>;
  salary: Scalars['Float']['input'];
  storeId?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeResult = {
  __typename: 'EmployeeResult';
  data: Maybe<Employee>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type EmployeeUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['Float']['input']>;
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

export type FinanceAccountResult = {
  __typename: 'FinanceAccountResult';
  data: Maybe<FinanceAccount>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type FinanceAccountUpdateInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  openingBalanceCents?: InputMaybe<Scalars['Int']['input']>;
};

export enum FinanceGroupByDimension {
  Account = 'ACCOUNT',
  Category = 'CATEGORY',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Type = 'TYPE',
  Year = 'YEAR'
}

export type FinanceGroupKey = {
  __typename: 'FinanceGroupKey';
  accountId: Maybe<Scalars['String']['output']>;
  categoryId: Maybe<Scalars['String']['output']>;
  period: Maybe<Scalars['String']['output']>;
  txnType: Maybe<Scalars['String']['output']>;
};

export type FinanceGroupedResult = {
  __typename: 'FinanceGroupedResult';
  count: Scalars['Int']['output'];
  groupKey: FinanceGroupKey;
  netCents: Scalars['Int']['output'];
  totalExpenseCents: Scalars['Int']['output'];
  totalIncomeCents: Scalars['Int']['output'];
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

export type FinanceTransactionAggregateFields = {
  __typename: 'FinanceTransactionAggregateFields';
  avgAmountCents: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  maxAmountCents: Scalars['Int']['output'];
  minAmountCents: Scalars['Int']['output'];
  sumAmountCents: Scalars['Int']['output'];
};

export type FinanceTransactionAggregateResult = {
  __typename: 'FinanceTransactionAggregateResult';
  aggregate: FinanceTransactionAggregateFields;
  nodes: Array<FinanceTransaction>;
};

export type FinanceTransactionConnection = {
  __typename: 'FinanceTransactionConnection';
  edges: Array<FinanceTransactionEdge>;
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

export type FinanceTransactionEdge = {
  __typename: 'FinanceTransactionEdge';
  cursor: Scalars['String']['output'];
  node: FinanceTransaction;
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

export type FinanceTransactionResult = {
  __typename: 'FinanceTransactionResult';
  data: Maybe<FinanceTransaction>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
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

export type Heartbeat = {
  __typename: 'Heartbeat';
  ping: Scalars['String']['output'];
  sequence: Scalars['Int']['output'];
  serverTime: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  assignRole: BoolResult;
  createApiKey: ApiKeyCreatedResult;
  createEmployee: EmployeeResult;
  createFinanceAccount: FinanceAccountResult;
  createFinanceTransaction: FinanceTransactionResult;
  createOrganization: OrganizationResult;
  createShift: ShiftResult;
  createStore: StoreResult;
  createTipRetentionPolicy: TipRetentionPolicyResult;
  createTips: TipsResult;
  createUser: UserResult;
  deleteEmployee: BoolResult;
  deleteFinanceAccount: BoolResult;
  deleteFinanceTransaction: BoolResult;
  deleteOrganization: BoolResult;
  deleteShift: BoolResult;
  deleteStore: BoolResult;
  deleteTips: BoolResult;
  deleteUser: BoolResult;
  distributeTips: DistributionResultResult;
  grantPermission: BoolResult;
  listUserRoles: UserRoleAssignmentListResult;
  revokeApiKey: BoolResult;
  revokeRole: BoolResult;
  transferEmployeeToOrganization: EmployeeResult;
  transferEmployeeToStore: EmployeeResult;
  updateEmployee: EmployeeResult;
  updateFinanceAccount: FinanceAccountResult;
  updateFinanceTransaction: FinanceTransactionResult;
  updateOrganization: OrganizationResult;
  updateStore: StoreResult;
  updateTips: TipsResult;
  updateUser: UserResult;
};


export type MutationAssignRoleArgs = {
  domain: Scalars['String']['input'];
  role: Scalars['String']['input'];
  userSub: Scalars['String']['input'];
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


export type MutationCreateShiftArgs = {
  data: ShiftInput;
};


export type MutationCreateStoreArgs = {
  data: StoreInput;
};


export type MutationCreateTipRetentionPolicyArgs = {
  data: TipRetentionPolicyInput;
};


export type MutationCreateTipsArgs = {
  data: TipsInput;
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


export type MutationDeleteShiftArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteStoreArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTipsArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationDistributeTipsArgs = {
  date: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};


export type MutationGrantPermissionArgs = {
  action: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  resource: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationListUserRolesArgs = {
  userSub: Scalars['String']['input'];
};


export type MutationRevokeApiKeyArgs = {
  keyId: Scalars['String']['input'];
};


export type MutationRevokeRoleArgs = {
  domain: Scalars['String']['input'];
  role: Scalars['String']['input'];
  userSub: Scalars['String']['input'];
};


export type MutationTransferEmployeeToOrganizationArgs = {
  id: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
};


export type MutationTransferEmployeeToStoreArgs = {
  id: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
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


export type MutationUpdateTipsArgs = {
  data: TipsUpdateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  id: Scalars['String']['input'];
};

export type OperationError = {
  __typename: 'OperationError';
  code: Scalars['String']['output'];
  field: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type Organization = {
  __typename: 'Organization';
  address: Scalars['String']['output'];
  employees: Array<Employee>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  stores: Array<Store>;
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

export type OrganizationResult = {
  __typename: 'OrganizationResult';
  data: Maybe<Organization>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
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
  employeeTipHistory: Array<TipDistribution>;
  employees: Array<Employee>;
  employeesConnection: EmployeeConnection;
  financeAccount: Maybe<FinanceAccount>;
  financeAccounts: Array<FinanceAccount>;
  financeSummary: FinanceSummary;
  financeTransaction: Maybe<FinanceTransaction>;
  financeTransactions: Array<FinanceTransaction>;
  financeTransactionsAggregate: FinanceTransactionAggregateResult;
  financeTransactionsConnection: FinanceTransactionConnection;
  financeTransactionsGrouped: Array<FinanceGroupedResult>;
  llmApiGuide: Scalars['String']['output'];
  organization: Maybe<Organization>;
  organizations: Array<Organization>;
  organizationsConnection: OrganizationConnection;
  shifts: Array<Shift>;
  shiftsForEmployee: Array<Shift>;
  store: Maybe<Store>;
  stores: Array<Store>;
  storesConnection: StoreConnection;
  tipDistributions: Array<TipDistribution>;
  tipRetentionPolicies: Array<TipRetentionPolicy>;
  tips: Array<Tips>;
  tipsById: Maybe<Tips>;
  undistributedTips: Array<Tips>;
  user: Maybe<User>;
  users: Array<User>;
  usersConnection: UserConnection;
};


export type QueryEmployeeArgs = {
  id: Scalars['String']['input'];
};


export type QueryEmployeeTipHistoryArgs = {
  employeeId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
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


export type QueryFinanceTransactionsAggregateArgs = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  currency: Scalars['String']['input'];
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<FinanceTransactionStatusEnum>;
  txnType?: InputMaybe<FinanceTransactionTypeEnum>;
};


export type QueryFinanceTransactionsConnectionArgs = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeTotalCount?: Scalars['Boolean']['input'];
  organizationId: Scalars['String']['input'];
  status?: InputMaybe<FinanceTransactionStatusEnum>;
  txnType?: InputMaybe<FinanceTransactionTypeEnum>;
};


export type QueryFinanceTransactionsGroupedArgs = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  currency: Scalars['String']['input'];
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  dimensions: Array<FinanceGroupByDimension>;
  organizationId: Scalars['String']['input'];
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


export type QueryShiftsArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShiftsForEmployeeArgs = {
  employeeId: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
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


export type QueryTipDistributionsArgs = {
  tipId: Scalars['String']['input'];
};


export type QueryTipsArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTipsByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryUndistributedTipsArgs = {
  storeId: Scalars['String']['input'];
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

export type Shift = {
  __typename: 'Shift';
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  storeId: Scalars['String']['output'];
  workDate: Scalars['String']['output'];
};

export type ShiftInput = {
  employeeId: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
  workDate: Scalars['String']['input'];
};

export type ShiftResult = {
  __typename: 'ShiftResult';
  data: Maybe<Shift>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type Store = {
  __typename: 'Store';
  address: Scalars['String']['output'];
  employees: Array<Employee>;
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

export type StoreResult = {
  __typename: 'StoreResult';
  data: Maybe<Store>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
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

export type Subscription = {
  __typename: 'Subscription';
  financeEvents: DomainEvent;
  heartbeat: Heartbeat;
  orgEvents: DomainEvent;
  systemEvents: DomainEvent;
};


export type SubscriptionFinanceEventsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  orgId: Scalars['String']['input'];
};


export type SubscriptionHeartbeatArgs = {
  intervalSeconds?: Scalars['Int']['input'];
};


export type SubscriptionOrgEventsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  orgId: Scalars['String']['input'];
};


export type SubscriptionSystemEventsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
};

export type TipDistribution = {
  __typename: 'TipDistribution';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  employeeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ownerRetainedAmount: Scalars['Float']['output'];
  ownerRetainedPercentage: Scalars['Float']['output'];
  points: Scalars['Float']['output'];
  preRetentionAmount: Scalars['Float']['output'];
  tipId: Scalars['String']['output'];
  totalPoints: Scalars['Float']['output'];
};

export type TipRetentionPolicy = {
  __typename: 'TipRetentionPolicy';
  countryCode: Scalars['String']['output'];
  effectiveDate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ownerRetentionPercentage: Scalars['Float']['output'];
  retentionPurpose: Maybe<Scalars['String']['output']>;
  taxRegime: Maybe<Scalars['String']['output']>;
};

export type TipRetentionPolicyInput = {
  countryCode: Scalars['String']['input'];
  effectiveDate: Scalars['String']['input'];
  ownerRetentionPercentage: Scalars['Float']['input'];
  retentionPurpose?: InputMaybe<Scalars['String']['input']>;
  taxRegime?: InputMaybe<Scalars['String']['input']>;
};

export type TipRetentionPolicyResult = {
  __typename: 'TipRetentionPolicyResult';
  data: Maybe<TipRetentionPolicy>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type Tips = {
  __typename: 'Tips';
  amount: Scalars['Float']['output'];
  countryCode: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  distributableAmount: Maybe<Scalars['Float']['output']>;
  distributed: Scalars['Boolean']['output'];
  distributedAt: Maybe<Scalars['String']['output']>;
  distributedBy: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  ownerRetentionAmount: Maybe<Scalars['Float']['output']>;
  ownerRetentionPercentage: Maybe<Scalars['Float']['output']>;
  storeId: Scalars['String']['output'];
  taxRegime: Maybe<Scalars['String']['output']>;
  tipDate: Scalars['String']['output'];
};

export type TipsInput = {
  amount: Scalars['Float']['input'];
  countryCode: Scalars['String']['input'];
  currency: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
  taxRegime?: InputMaybe<Scalars['String']['input']>;
  tipDate: Scalars['String']['input'];
};

export type TipsResult = {
  __typename: 'TipsResult';
  data: Maybe<Tips>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type TipsUpdateInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
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
  roles: Array<UserRoleAssignment>;
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

export type UserResult = {
  __typename: 'UserResult';
  data: Maybe<User>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
};

export type UserRoleAssignment = {
  __typename: 'UserRoleAssignment';
  domain: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type UserRoleAssignmentListResult = {
  __typename: 'UserRoleAssignmentListResult';
  data: Maybe<Array<UserRoleAssignment>>;
  error: Maybe<OperationError>;
  success: Scalars['Boolean']['output'];
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
export const GetFinanceAccountsDocument = {"__meta__":{"__documentHash":"62756e4b93a93a0717cb164ba54793b35aeee89a7700581fc96ef53babe80668"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFinanceAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"financeAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FinanceAccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FinanceAccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FinanceAccount"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalanceCents"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<GetFinanceAccountsQuery, GetFinanceAccountsQueryVariables>;
export const GetFinanceTransactionsDocument = {"__meta__":{"__documentHash":"07e62fe033c94427ca79d495ca6691b08f6cada2f54da84b556aa3accdb7cea0"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFinanceTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"financeTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FinanceTransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FinanceTransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FinanceTransaction"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amountCents"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]} as unknown as DocumentNode<GetFinanceTransactionsQuery, GetFinanceTransactionsQueryVariables>;
export const GetOrganizationsDocument = {"__meta__":{"__documentHash":"27b2a06533d778aa9eeba155f18cff4090675116c8bba31f5883f2db22d25c74"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrganizationFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrganizationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Organization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetStoresByOrganizationDocument = {"__meta__":{"__documentHash":"1c511cb73d99c53ba6a89399b5131584670823460580234852cd08c83dcccef5"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStoresByOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StoreFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StoreFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Store"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]} as unknown as DocumentNode<GetStoresByOrganizationQuery, GetStoresByOrganizationQueryVariables>;
export const GetEmployeesByOrganizationDocument = {"__meta__":{"__documentHash":"6c6f391422e1c2054cf3b1c7f7375d9464a1253f196a1b8bd8c1f636148b3251"},"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployeesByOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EmployeeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmployeeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Employee"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]} as unknown as DocumentNode<GetEmployeesByOrganizationQuery, GetEmployeesByOrganizationQueryVariables>;