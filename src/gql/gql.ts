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
 */
const documents = {
    "\n  query getUserName($userId: Int!) {\n    user(id: $userId) {\n      name\n    }\n  }\n": types.GetUserNameDocument,
    "\n  mutation NewAlert($input: AlertInput!) {\n    newAlert(input: $input) {\n      id\n      createdAt\n    }\n  }\n": types.NewAlertDocument,
    "\n  query GetAlerts {\n    alerts {\n      id\n      userId\n      createdAt\n      area\n      areaLevel2\n      areaLevel3\n      text1\n      text2\n      text3\n      reachedUsers\n    }\n  }\n": types.GetAlertsDocument,
    "\n  query GetPositions {\n    positions {\n      id\n      userId\n      createdAt\n      latitude\n      longitude\n      movingActivity\n    }\n  }\n": types.GetPositionsDocument,
    "\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      userId\n    }\n  }\n": types.LoginDocument,
    "\n  query getUserInfos($userId: Int!) {\n    user(id: $userId) {\n      email\n      name\n      address\n    }\n  }\n": types.GetUserInfosDocument,
    "\n  mutation UserEdit($input: UserEdit!, $userId: Int!) {\n    userEdit(input: $input, id: $userId) {\n      id\n      email\n      name\n      address\n      isAdmin\n    }\n  }\n": types.UserEditDocument,
    "\n  mutation UserPasswordEdit($input: UserPasswordEdit!) {\n    userPasswordEdit(input: $input) {\n      id\n      email\n      name\n      address\n      isAdmin\n    }\n  }\n": types.UserPasswordEditDocument,
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
export function graphql(source: "\n  query getUserName($userId: Int!) {\n    user(id: $userId) {\n      name\n    }\n  }\n"): (typeof documents)["\n  query getUserName($userId: Int!) {\n    user(id: $userId) {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation NewAlert($input: AlertInput!) {\n    newAlert(input: $input) {\n      id\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation NewAlert($input: AlertInput!) {\n    newAlert(input: $input) {\n      id\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAlerts {\n    alerts {\n      id\n      userId\n      createdAt\n      area\n      areaLevel2\n      areaLevel3\n      text1\n      text2\n      text3\n      reachedUsers\n    }\n  }\n"): (typeof documents)["\n  query GetAlerts {\n    alerts {\n      id\n      userId\n      createdAt\n      area\n      areaLevel2\n      areaLevel3\n      text1\n      text2\n      text3\n      reachedUsers\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPositions {\n    positions {\n      id\n      userId\n      createdAt\n      latitude\n      longitude\n      movingActivity\n    }\n  }\n"): (typeof documents)["\n  query GetPositions {\n    positions {\n      id\n      userId\n      createdAt\n      latitude\n      longitude\n      movingActivity\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      userId\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUserInfos($userId: Int!) {\n    user(id: $userId) {\n      email\n      name\n      address\n    }\n  }\n"): (typeof documents)["\n  query getUserInfos($userId: Int!) {\n    user(id: $userId) {\n      email\n      name\n      address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UserEdit($input: UserEdit!, $userId: Int!) {\n    userEdit(input: $input, id: $userId) {\n      id\n      email\n      name\n      address\n      isAdmin\n    }\n  }\n"): (typeof documents)["\n  mutation UserEdit($input: UserEdit!, $userId: Int!) {\n    userEdit(input: $input, id: $userId) {\n      id\n      email\n      name\n      address\n      isAdmin\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UserPasswordEdit($input: UserPasswordEdit!) {\n    userPasswordEdit(input: $input) {\n      id\n      email\n      name\n      address\n      isAdmin\n    }\n  }\n"): (typeof documents)["\n  mutation UserPasswordEdit($input: UserPasswordEdit!) {\n    userPasswordEdit(input: $input) {\n      id\n      email\n      name\n      address\n      isAdmin\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;