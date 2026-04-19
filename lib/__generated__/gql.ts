/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment EmployeeFields on Employee {\n    id\n    name\n    address\n    salary\n    organizationId\n  }\n": typeof types.EmployeeFieldsFragmentDoc,
    "\n  fragment OrganizationFields on Organization {\n    id\n    name\n    address\n    userId\n  }\n": typeof types.OrganizationFieldsFragmentDoc,
    "\n  fragment StoreFields on Store {\n    id\n    name\n    address\n    organizationId\n  }\n": typeof types.StoreFieldsFragmentDoc,
    "\n  query GetOrganizations {\n    organizations {\n      ...OrganizationFields\n    }\n  }\n  \n": typeof types.GetOrganizationsDocument,
    "\n  query GetStoresByOrganization($organizationId: String!) {\n    stores(organizationId: $organizationId) {\n      ...StoreFields\n    }\n  }\n  \n": typeof types.GetStoresByOrganizationDocument,
    "\n  query GetEmployeesByOrganization($organizationId: String!) {\n    employees(organizationId: $organizationId) {\n      ...EmployeeFields\n    }\n  }\n  \n": typeof types.GetEmployeesByOrganizationDocument,
};
const documents: Documents = {
    "\n  fragment EmployeeFields on Employee {\n    id\n    name\n    address\n    salary\n    organizationId\n  }\n": types.EmployeeFieldsFragmentDoc,
    "\n  fragment OrganizationFields on Organization {\n    id\n    name\n    address\n    userId\n  }\n": types.OrganizationFieldsFragmentDoc,
    "\n  fragment StoreFields on Store {\n    id\n    name\n    address\n    organizationId\n  }\n": types.StoreFieldsFragmentDoc,
    "\n  query GetOrganizations {\n    organizations {\n      ...OrganizationFields\n    }\n  }\n  \n": types.GetOrganizationsDocument,
    "\n  query GetStoresByOrganization($organizationId: String!) {\n    stores(organizationId: $organizationId) {\n      ...StoreFields\n    }\n  }\n  \n": types.GetStoresByOrganizationDocument,
    "\n  query GetEmployeesByOrganization($organizationId: String!) {\n    employees(organizationId: $organizationId) {\n      ...EmployeeFields\n    }\n  }\n  \n": types.GetEmployeesByOrganizationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EmployeeFields on Employee {\n    id\n    name\n    address\n    salary\n    organizationId\n  }\n"): (typeof documents)["\n  fragment EmployeeFields on Employee {\n    id\n    name\n    address\n    salary\n    organizationId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrganizationFields on Organization {\n    id\n    name\n    address\n    userId\n  }\n"): (typeof documents)["\n  fragment OrganizationFields on Organization {\n    id\n    name\n    address\n    userId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StoreFields on Store {\n    id\n    name\n    address\n    organizationId\n  }\n"): (typeof documents)["\n  fragment StoreFields on Store {\n    id\n    name\n    address\n    organizationId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOrganizations {\n    organizations {\n      ...OrganizationFields\n    }\n  }\n  \n"): (typeof documents)["\n  query GetOrganizations {\n    organizations {\n      ...OrganizationFields\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetStoresByOrganization($organizationId: String!) {\n    stores(organizationId: $organizationId) {\n      ...StoreFields\n    }\n  }\n  \n"): (typeof documents)["\n  query GetStoresByOrganization($organizationId: String!) {\n    stores(organizationId: $organizationId) {\n      ...StoreFields\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmployeesByOrganization($organizationId: String!) {\n    employees(organizationId: $organizationId) {\n      ...EmployeeFields\n    }\n  }\n  \n"): (typeof documents)["\n  query GetEmployeesByOrganization($organizationId: String!) {\n    employees(organizationId: $organizationId) {\n      ...EmployeeFields\n    }\n  }\n  \n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;