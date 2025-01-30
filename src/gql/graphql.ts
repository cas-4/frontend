/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** Alert struct */
export type Alert = {
  __typename?: 'Alert';
  area: Scalars['String']['output'];
  areaLevel2: Scalars['String']['output'];
  areaLevel3: Scalars['String']['output'];
  audio1: Array<Scalars['Int']['output']>;
  audio2: Array<Scalars['Int']['output']>;
  audio3: Array<Scalars['Int']['output']>;
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  reachedUsers: Scalars['Int']['output'];
  text1: Scalars['String']['output'];
  text2: Scalars['String']['output'];
  text3: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

/** Alert input struct */
export type AlertInput = {
  points: Array<Point>;
  text1: Scalars['String']['input'];
  text2: Scalars['String']['input'];
  text3: Scalars['String']['input'];
};

/** Body used as response to login */
export type AuthBody = {
  __typename?: 'AuthBody';
  /** Access token string */
  accessToken: Scalars['String']['output'];
  /** "Bearer" string */
  tokenType: Scalars['String']['output'];
  /** User id */
  userId: Scalars['Int']['output'];
};

/** Enumeration which refers to the level of alert */
export enum LevelAlert {
  One = 'ONE',
  Three = 'THREE',
  Two = 'TWO'
}

export type LoginCredentials = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Enumeration which refers to the kind of moving activity */
export enum MovingActivity {
  InVehicle = 'IN_VEHICLE',
  Running = 'RUNNING',
  Still = 'STILL',
  Walking = 'WALKING'
}

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Make GraphQL login
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -d '{
   * "query": "mutation Login($input: LoginCredentials!) { login(input: $input) { accessToken tokenType userId } }",
   * "variables": {
   * "input": {
   * "email": "***",
   * "password": "***"
   * }
   * }
   * }'
   * ```
   */
  login: AuthBody;
  /**
   * Make GraphQL request to create new alert. Only for admins.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ****" \
   * -d '{
   * "query": "mutation NewAlert($input: AlertInput!) { newAlert(input: $input) { id createdAt } }",
   * "variables": {
   * "input": {
   * "points": [
   * { "latitude": 44.490025, "longitude": 11.311499},
   * { "latitude": 44.490361, "longitude": 11.327903},
   * { "latitude": 44.497280, "longitude": 11.327776},
   * { "latitude": 44.498321, "longitude": 11.312145},
   * { "latitude": 44.490025, "longitude": 11.311498}
   * ],
   * "text1": "Alert level 1",
   * "text2": "Alert level 2",
   * "text3": "Alert level 3"
   * }
   * }
   * }
   */
  newAlert: Alert;
  /**
   * Make GraphQL request to create new position to track
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation NewPosition($input: PositionInput!) { newPosition(input: $input) { id userId createdAt latitude longitude movingActivity } }",
   * "variables": {
   * "input": {
   * "latitude": 44.50800643571219,
   * "longitude": 11.299600981136905,
   * "movingActivity": "STILL"
   * }
   * }
   * }'
   * ```
   */
  newPosition: Position;
  /**
   * Make GraphQL request to update notification seen status.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ****" \
   * -d '{
   * "query": "mutation NotificationUpdate($input: NotificationUpdateInput!) { notificationUpdate(input: $input) { id seen } }",
   * "variables": {
   * "input": {
   * "id": 42,
   * "seen": true
   * }
   * }
   * }
   */
  notificationUpdate: Notification;
  /**
   * Make GraphQL call to register a notification device token for the user.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation RegisterDevice($input: RegisterNotificationToken!) { registerDevice(input: $input) { id name email } }",
   * "variables": {
   * "input": {
   * "token": "***",
   * }
   * }
   * }'
   * ```
   */
  registerDevice: User;
  /**
   * Make GraphQL call to edit an user. Not admins can edit only the user linked to the access
   * token used.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation UserEdit($input: UserEdit!, $id: Int!) { userEdit(input: $input, id: $id) { id email name address is_admin } }",
   * "variables": {
   * "input": {
   * "email": "mario.rossi@example.com",
   * "name": "Mario Rossi",
   * "address": ""
   * },
   * "id": 42
   * }
   * }'
   * ```
   */
  userEdit: User;
  /**
   * Make GraphQL call to edit their passowrd.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation UserPasswordEdit($input: UserPasswordEdit!) { userPasswordEdit(input: $input) { id email name address is_admin } }",
   * "variables": {
   * "input": {
   * "password1": "***",
   * "password2": "***"
   * }
   * }
   * }'
   * ```
   */
  userPasswordEdit: User;
};


export type MutationLoginArgs = {
  input: LoginCredentials;
};


export type MutationNewAlertArgs = {
  input: AlertInput;
};


export type MutationNewPositionArgs = {
  input: PositionInput;
};


export type MutationNotificationUpdateArgs = {
  input: NotificationUpdateInput;
};


export type MutationRegisterDeviceArgs = {
  input: RegisterNotificationToken;
};


export type MutationUserEditArgs = {
  id: Scalars['Int']['input'];
  input: UserEdit;
};


export type MutationUserPasswordEditArgs = {
  input: UserPasswordEdit;
};

/** Notification struct */
export type Notification = {
  __typename?: 'Notification';
  alert: Alert;
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  latitude: Scalars['Float']['output'];
  level: LevelAlert;
  longitude: Scalars['Float']['output'];
  movingActivity: MovingActivity;
  seen: Scalars['Boolean']['output'];
  userId: Scalars['Int']['output'];
};

/** Alert input struct */
export type NotificationUpdateInput = {
  id: Scalars['Int']['input'];
  seen: Scalars['Boolean']['input'];
};

export type Point = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

/** Position struct */
export type Position = {
  __typename?: 'Position';
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  movingActivity: MovingActivity;
  userId: Scalars['Int']['output'];
};

/** Position input struct */
export type PositionInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  movingActivity: MovingActivity;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Returns all the positions
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{alerts(id: 12) {id, userId, createdAt, area, areaLevel2, areaLevel3, text1, text2, text3}}"}'
   * ```
   */
  alerts?: Maybe<Array<Alert>>;
  /** Returns the API version. It is like a "greet" function */
  apiVersion: Scalars['String']['output'];
  /**
   * Returns all the notifications. They can be filtered by an alert id.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{notifications {
   * id,
   * alert { id, userId, createdAt, area, areaLevel2, areaLevel3, text1, text2, text3, audio1, audio2, audio3, reachedUsers },
   * userId, latitude, longitude, movingActivity, level, seen, createdAt
   * }}"}'
   * ```
   */
  notifications?: Maybe<Array<Notification>>;
  /**
   * Returns all the positions. It is restricted to admins only.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{positions(movingActivity: IN_VEHICLE) {id, userId, createdAt, latitude, longitude, movingActivity}}"}'
   * ```
   */
  positions?: Maybe<Array<Position>>;
  /**
   * Returns an user by ID. Admins can check everyone.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{user(id: 1) { id, email, password, name, address, isAdmin }}"}'
   * ```
   */
  user: User;
  /**
   * Returns all the users. It is restricted to admins only.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{users(limit: 2) { id, email, password, name, address, isAdmin }}"}'
   * ```
   */
  users?: Maybe<Array<User>>;
};


export type QueryAlertsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationsArgs = {
  alertId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  seen?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  movingActivity?: InputMaybe<Array<MovingActivity>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RegisterNotificationToken = {
  token: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notificationToken: Scalars['String']['output'];
  password: Scalars['String']['output'];
};

export type UserEdit = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UserPasswordEdit = {
  password1: Scalars['String']['input'];
  password2: Scalars['String']['input'];
};

export type GetUserNameQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GetUserNameQuery = { __typename?: 'Query', user: { __typename?: 'User', name: string } };

export type NewAlertMutationVariables = Exact<{
  input: AlertInput;
}>;


export type NewAlertMutation = { __typename?: 'Mutation', newAlert: { __typename?: 'Alert', id: number, createdAt: number } };

export type GetAlertsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAlertsQuery = { __typename?: 'Query', alerts?: Array<{ __typename?: 'Alert', id: number, userId: number, createdAt: number, area: string, areaLevel2: string, areaLevel3: string, text1: string, text2: string, text3: string, reachedUsers: number }> | null };

export type GetPositionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPositionsQuery = { __typename?: 'Query', positions?: Array<{ __typename?: 'Position', id: number, userId: number, createdAt: number, latitude: number, longitude: number, movingActivity: MovingActivity }> | null };

export type LoginMutationVariables = Exact<{
  input: LoginCredentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthBody', accessToken: string, userId: number } };

export type GetUserInfosQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GetUserInfosQuery = { __typename?: 'Query', user: { __typename?: 'User', email: string, name: string, address: string } };

export type UserEditMutationVariables = Exact<{
  input: UserEdit;
  userId: Scalars['Int']['input'];
}>;


export type UserEditMutation = { __typename?: 'Mutation', userEdit: { __typename?: 'User', id: number, email: string, name: string, address: string, isAdmin: boolean } };

export type UserPasswordEditMutationVariables = Exact<{
  input: UserPasswordEdit;
}>;


export type UserPasswordEditMutation = { __typename?: 'Mutation', userPasswordEdit: { __typename?: 'User', id: number, email: string, name: string, address: string, isAdmin: boolean } };


export const GetUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetUserNameQuery, GetUserNameQueryVariables>;
export const NewAlertDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NewAlert"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AlertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newAlert"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<NewAlertMutation, NewAlertMutationVariables>;
export const GetAlertsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAlerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alerts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"area"}},{"kind":"Field","name":{"kind":"Name","value":"areaLevel2"}},{"kind":"Field","name":{"kind":"Name","value":"areaLevel3"}},{"kind":"Field","name":{"kind":"Name","value":"text1"}},{"kind":"Field","name":{"kind":"Name","value":"text2"}},{"kind":"Field","name":{"kind":"Name","value":"text3"}},{"kind":"Field","name":{"kind":"Name","value":"reachedUsers"}}]}}]}}]} as unknown as DocumentNode<GetAlertsQuery, GetAlertsQueryVariables>;
export const GetPositionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"movingActivity"}}]}}]}}]} as unknown as DocumentNode<GetPositionsQuery, GetPositionsQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GetUserInfosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserInfos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<GetUserInfosQuery, GetUserInfosQueryVariables>;
export const UserEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserEdit"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]}}]} as unknown as DocumentNode<UserEditMutation, UserEditMutationVariables>;
export const UserPasswordEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserPasswordEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserPasswordEdit"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPasswordEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]}}]} as unknown as DocumentNode<UserPasswordEditMutation, UserPasswordEditMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** Alert struct */
export type Alert = {
  __typename?: 'Alert';
  area: Scalars['String']['output'];
  areaLevel2: Scalars['String']['output'];
  areaLevel3: Scalars['String']['output'];
  audio1: Array<Scalars['Int']['output']>;
  audio2: Array<Scalars['Int']['output']>;
  audio3: Array<Scalars['Int']['output']>;
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  reachedUsers: Scalars['Int']['output'];
  text1: Scalars['String']['output'];
  text2: Scalars['String']['output'];
  text3: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

/** Alert input struct */
export type AlertInput = {
  points: Array<Point>;
  text1: Scalars['String']['input'];
  text2: Scalars['String']['input'];
  text3: Scalars['String']['input'];
};

/** Body used as response to login */
export type AuthBody = {
  __typename?: 'AuthBody';
  /** Access token string */
  accessToken: Scalars['String']['output'];
  /** "Bearer" string */
  tokenType: Scalars['String']['output'];
  /** User id */
  userId: Scalars['Int']['output'];
};

/** Enumeration which refers to the level of alert */
export enum LevelAlert {
  One = 'ONE',
  Three = 'THREE',
  Two = 'TWO'
}

export type LoginCredentials = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** Enumeration which refers to the kind of moving activity */
export enum MovingActivity {
  InVehicle = 'IN_VEHICLE',
  Running = 'RUNNING',
  Still = 'STILL',
  Walking = 'WALKING'
}

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Make GraphQL login
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -d '{
   * "query": "mutation Login($input: LoginCredentials!) { login(input: $input) { accessToken tokenType userId } }",
   * "variables": {
   * "input": {
   * "email": "***",
   * "password": "***"
   * }
   * }
   * }'
   * ```
   */
  login: AuthBody;
  /**
   * Make GraphQL request to create new alert. Only for admins.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ****" \
   * -d '{
   * "query": "mutation NewAlert($input: AlertInput!) { newAlert(input: $input) { id createdAt } }",
   * "variables": {
   * "input": {
   * "points": [
   * { "latitude": 44.490025, "longitude": 11.311499},
   * { "latitude": 44.490361, "longitude": 11.327903},
   * { "latitude": 44.497280, "longitude": 11.327776},
   * { "latitude": 44.498321, "longitude": 11.312145},
   * { "latitude": 44.490025, "longitude": 11.311498}
   * ],
   * "text1": "Alert level 1",
   * "text2": "Alert level 2",
   * "text3": "Alert level 3"
   * }
   * }
   * }
   */
  newAlert: Alert;
  /**
   * Make GraphQL request to create new position to track
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation NewPosition($input: PositionInput!) { newPosition(input: $input) { id userId createdAt latitude longitude movingActivity } }",
   * "variables": {
   * "input": {
   * "latitude": 44.50800643571219,
   * "longitude": 11.299600981136905,
   * "movingActivity": "STILL"
   * }
   * }
   * }'
   * ```
   */
  newPosition: Position;
  /**
   * Make GraphQL request to update notification seen status.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ****" \
   * -d '{
   * "query": "mutation NotificationUpdate($input: NotificationUpdateInput!) { notificationUpdate(input: $input) { id seen } }",
   * "variables": {
   * "input": {
   * "id": 42,
   * "seen": true
   * }
   * }
   * }
   */
  notificationUpdate: Notification;
  /**
   * Make GraphQL call to register a notification device token for the user.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation RegisterDevice($input: RegisterNotificationToken!) { registerDevice(input: $input) { id name email } }",
   * "variables": {
   * "input": {
   * "token": "***",
   * }
   * }
   * }'
   * ```
   */
  registerDevice: User;
  /**
   * Make GraphQL call to edit an user. Not admins can edit only the user linked to the access
   * token used.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation UserEdit($input: UserEdit!, $id: Int!) { userEdit(input: $input, id: $id) { id email name address is_admin } }",
   * "variables": {
   * "input": {
   * "email": "mario.rossi@example.com",
   * "name": "Mario Rossi",
   * "address": ""
   * },
   * "id": 42
   * }
   * }'
   * ```
   */
  userEdit: User;
  /**
   * Make GraphQL call to edit their passowrd.
   *
   * Example:
   * ```text
   * curl -X POST http://localhost:8000/graphql \
   * -H "Content-Type: application/json" \
   * -H "Authorization: Bearer ***" \
   * -d '{
   * "query": "mutation UserPasswordEdit($input: UserPasswordEdit!) { userPasswordEdit(input: $input) { id email name address is_admin } }",
   * "variables": {
   * "input": {
   * "password1": "***",
   * "password2": "***"
   * }
   * }
   * }'
   * ```
   */
  userPasswordEdit: User;
};


export type MutationLoginArgs = {
  input: LoginCredentials;
};


export type MutationNewAlertArgs = {
  input: AlertInput;
};


export type MutationNewPositionArgs = {
  input: PositionInput;
};


export type MutationNotificationUpdateArgs = {
  input: NotificationUpdateInput;
};


export type MutationRegisterDeviceArgs = {
  input: RegisterNotificationToken;
};


export type MutationUserEditArgs = {
  id: Scalars['Int']['input'];
  input: UserEdit;
};


export type MutationUserPasswordEditArgs = {
  input: UserPasswordEdit;
};

/** Notification struct */
export type Notification = {
  __typename?: 'Notification';
  alert: Alert;
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  latitude: Scalars['Float']['output'];
  level: LevelAlert;
  longitude: Scalars['Float']['output'];
  movingActivity: MovingActivity;
  seen: Scalars['Boolean']['output'];
  userId: Scalars['Int']['output'];
};

/** Alert input struct */
export type NotificationUpdateInput = {
  id: Scalars['Int']['input'];
  seen: Scalars['Boolean']['input'];
};

export type Point = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

/** Position struct */
export type Position = {
  __typename?: 'Position';
  createdAt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  movingActivity: MovingActivity;
  userId: Scalars['Int']['output'];
};

/** Position input struct */
export type PositionInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  movingActivity: MovingActivity;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Returns all the positions
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{alerts(id: 12) {id, userId, createdAt, area, areaLevel2, areaLevel3, text1, text2, text3}}"}'
   * ```
   */
  alerts?: Maybe<Array<Alert>>;
  /** Returns the API version. It is like a "greet" function */
  apiVersion: Scalars['String']['output'];
  /**
   * Returns all the notifications. They can be filtered by an alert id.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{notifications {
   * id,
   * alert { id, userId, createdAt, area, areaLevel2, areaLevel3, text1, text2, text3, audio1, audio2, audio3, reachedUsers },
   * userId, latitude, longitude, movingActivity, level, seen, createdAt
   * }}"}'
   * ```
   */
  notifications?: Maybe<Array<Notification>>;
  /**
   * Returns all the positions. It is restricted to admins only.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{positions(movingActivity: IN_VEHICLE) {id, userId, createdAt, latitude, longitude, movingActivity}}"}'
   * ```
   */
  positions?: Maybe<Array<Position>>;
  /**
   * Returns an user by ID. Admins can check everyone.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{user(id: 1) { id, email, password, name, address, isAdmin }}"}'
   * ```
   */
  user: User;
  /**
   * Returns all the users. It is restricted to admins only.
   *
   * Request example:
   * ```text
   * curl http://localhost:8000/graphql
   * -H 'authorization: Bearer ***'
   * -H 'content-type: application/json'
   * -d '{"query":"{users(limit: 2) { id, email, password, name, address, isAdmin }}"}'
   * ```
   */
  users?: Maybe<Array<User>>;
};


export type QueryAlertsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationsArgs = {
  alertId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  seen?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  movingActivity?: InputMaybe<Array<MovingActivity>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type RegisterNotificationToken = {
  token: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notificationToken: Scalars['String']['output'];
  password: Scalars['String']['output'];
};

export type UserEdit = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UserPasswordEdit = {
  password1: Scalars['String']['input'];
  password2: Scalars['String']['input'];
};

export type GetUserNameQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GetUserNameQuery = { __typename?: 'Query', user: { __typename?: 'User', name: string } };

export type NewAlertMutationVariables = Exact<{
  input: AlertInput;
}>;


export type NewAlertMutation = { __typename?: 'Mutation', newAlert: { __typename?: 'Alert', id: number, createdAt: number } };

export type GetAlertsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAlertsQuery = { __typename?: 'Query', alerts?: Array<{ __typename?: 'Alert', id: number, userId: number, createdAt: number, area: string, areaLevel2: string, areaLevel3: string, text1: string, text2: string, text3: string, reachedUsers: number }> | null };

export type GetPositionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPositionsQuery = { __typename?: 'Query', positions?: Array<{ __typename?: 'Position', id: number, userId: number, createdAt: number, latitude: number, longitude: number, movingActivity: MovingActivity }> | null };

export type LoginMutationVariables = Exact<{
  input: LoginCredentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthBody', accessToken: string, userId: number } };

export type GetUserInfosQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GetUserInfosQuery = { __typename?: 'Query', user: { __typename?: 'User', email: string, name: string, address: string } };

export type UserEditMutationVariables = Exact<{
  input: UserEdit;
  userId: Scalars['Int']['input'];
}>;


export type UserEditMutation = { __typename?: 'Mutation', userEdit: { __typename?: 'User', id: number, email: string, name: string, address: string, isAdmin: boolean } };

export type UserPasswordEditMutationVariables = Exact<{
  input: UserPasswordEdit;
}>;


export type UserPasswordEditMutation = { __typename?: 'Mutation', userPasswordEdit: { __typename?: 'User', id: number, email: string, name: string, address: string, isAdmin: boolean } };


export const GetUserNameDocument = gql`
    query getUserName($userId: Int!) {
  user(id: $userId) {
    name
  }
}
    `;

/**
 * __useGetUserNameQuery__
 *
 * To run a query within a React component, call `useGetUserNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNameQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserNameQuery(baseOptions: Apollo.QueryHookOptions<GetUserNameQuery, GetUserNameQueryVariables> & ({ variables: GetUserNameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserNameQuery, GetUserNameQueryVariables>(GetUserNameDocument, options);
      }
export function useGetUserNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserNameQuery, GetUserNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserNameQuery, GetUserNameQueryVariables>(GetUserNameDocument, options);
        }
export function useGetUserNameSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserNameQuery, GetUserNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserNameQuery, GetUserNameQueryVariables>(GetUserNameDocument, options);
        }
export type GetUserNameQueryHookResult = ReturnType<typeof useGetUserNameQuery>;
export type GetUserNameLazyQueryHookResult = ReturnType<typeof useGetUserNameLazyQuery>;
export type GetUserNameSuspenseQueryHookResult = ReturnType<typeof useGetUserNameSuspenseQuery>;
export type GetUserNameQueryResult = Apollo.QueryResult<GetUserNameQuery, GetUserNameQueryVariables>;
export const NewAlertDocument = gql`
    mutation NewAlert($input: AlertInput!) {
  newAlert(input: $input) {
    id
    createdAt
  }
}
    `;
export type NewAlertMutationFn = Apollo.MutationFunction<NewAlertMutation, NewAlertMutationVariables>;

/**
 * __useNewAlertMutation__
 *
 * To run a mutation, you first call `useNewAlertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewAlertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newAlertMutation, { data, loading, error }] = useNewAlertMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNewAlertMutation(baseOptions?: Apollo.MutationHookOptions<NewAlertMutation, NewAlertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NewAlertMutation, NewAlertMutationVariables>(NewAlertDocument, options);
      }
export type NewAlertMutationHookResult = ReturnType<typeof useNewAlertMutation>;
export type NewAlertMutationResult = Apollo.MutationResult<NewAlertMutation>;
export type NewAlertMutationOptions = Apollo.BaseMutationOptions<NewAlertMutation, NewAlertMutationVariables>;
export const GetAlertsDocument = gql`
    query GetAlerts {
  alerts {
    id
    userId
    createdAt
    area
    areaLevel2
    areaLevel3
    text1
    text2
    text3
    reachedUsers
  }
}
    `;

/**
 * __useGetAlertsQuery__
 *
 * To run a query within a React component, call `useGetAlertsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAlertsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAlertsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAlertsQuery(baseOptions?: Apollo.QueryHookOptions<GetAlertsQuery, GetAlertsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAlertsQuery, GetAlertsQueryVariables>(GetAlertsDocument, options);
      }
export function useGetAlertsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAlertsQuery, GetAlertsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAlertsQuery, GetAlertsQueryVariables>(GetAlertsDocument, options);
        }
export function useGetAlertsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAlertsQuery, GetAlertsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAlertsQuery, GetAlertsQueryVariables>(GetAlertsDocument, options);
        }
export type GetAlertsQueryHookResult = ReturnType<typeof useGetAlertsQuery>;
export type GetAlertsLazyQueryHookResult = ReturnType<typeof useGetAlertsLazyQuery>;
export type GetAlertsSuspenseQueryHookResult = ReturnType<typeof useGetAlertsSuspenseQuery>;
export type GetAlertsQueryResult = Apollo.QueryResult<GetAlertsQuery, GetAlertsQueryVariables>;
export const GetPositionsDocument = gql`
    query GetPositions {
  positions {
    id
    userId
    createdAt
    latitude
    longitude
    movingActivity
  }
}
    `;

/**
 * __useGetPositionsQuery__
 *
 * To run a query within a React component, call `useGetPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPositionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPositionsQuery(baseOptions?: Apollo.QueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options);
      }
export function useGetPositionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options);
        }
export function useGetPositionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options);
        }
export type GetPositionsQueryHookResult = ReturnType<typeof useGetPositionsQuery>;
export type GetPositionsLazyQueryHookResult = ReturnType<typeof useGetPositionsLazyQuery>;
export type GetPositionsSuspenseQueryHookResult = ReturnType<typeof useGetPositionsSuspenseQuery>;
export type GetPositionsQueryResult = Apollo.QueryResult<GetPositionsQuery, GetPositionsQueryVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginCredentials!) {
  login(input: $input) {
    accessToken
    userId
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GetUserInfosDocument = gql`
    query getUserInfos($userId: Int!) {
  user(id: $userId) {
    email
    name
    address
  }
}
    `;

/**
 * __useGetUserInfosQuery__
 *
 * To run a query within a React component, call `useGetUserInfosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInfosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInfosQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserInfosQuery(baseOptions: Apollo.QueryHookOptions<GetUserInfosQuery, GetUserInfosQueryVariables> & ({ variables: GetUserInfosQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserInfosQuery, GetUserInfosQueryVariables>(GetUserInfosDocument, options);
      }
export function useGetUserInfosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserInfosQuery, GetUserInfosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserInfosQuery, GetUserInfosQueryVariables>(GetUserInfosDocument, options);
        }
export function useGetUserInfosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserInfosQuery, GetUserInfosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserInfosQuery, GetUserInfosQueryVariables>(GetUserInfosDocument, options);
        }
export type GetUserInfosQueryHookResult = ReturnType<typeof useGetUserInfosQuery>;
export type GetUserInfosLazyQueryHookResult = ReturnType<typeof useGetUserInfosLazyQuery>;
export type GetUserInfosSuspenseQueryHookResult = ReturnType<typeof useGetUserInfosSuspenseQuery>;
export type GetUserInfosQueryResult = Apollo.QueryResult<GetUserInfosQuery, GetUserInfosQueryVariables>;
export const UserEditDocument = gql`
    mutation UserEdit($input: UserEdit!, $userId: Int!) {
  userEdit(input: $input, id: $userId) {
    id
    email
    name
    address
    isAdmin
  }
}
    `;
export type UserEditMutationFn = Apollo.MutationFunction<UserEditMutation, UserEditMutationVariables>;

/**
 * __useUserEditMutation__
 *
 * To run a mutation, you first call `useUserEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userEditMutation, { data, loading, error }] = useUserEditMutation({
 *   variables: {
 *      input: // value for 'input'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserEditMutation(baseOptions?: Apollo.MutationHookOptions<UserEditMutation, UserEditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserEditMutation, UserEditMutationVariables>(UserEditDocument, options);
      }
export type UserEditMutationHookResult = ReturnType<typeof useUserEditMutation>;
export type UserEditMutationResult = Apollo.MutationResult<UserEditMutation>;
export type UserEditMutationOptions = Apollo.BaseMutationOptions<UserEditMutation, UserEditMutationVariables>;
export const UserPasswordEditDocument = gql`
    mutation UserPasswordEdit($input: UserPasswordEdit!) {
  userPasswordEdit(input: $input) {
    id
    email
    name
    address
    isAdmin
  }
}
    `;
export type UserPasswordEditMutationFn = Apollo.MutationFunction<UserPasswordEditMutation, UserPasswordEditMutationVariables>;

/**
 * __useUserPasswordEditMutation__
 *
 * To run a mutation, you first call `useUserPasswordEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserPasswordEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userPasswordEditMutation, { data, loading, error }] = useUserPasswordEditMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserPasswordEditMutation(baseOptions?: Apollo.MutationHookOptions<UserPasswordEditMutation, UserPasswordEditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserPasswordEditMutation, UserPasswordEditMutationVariables>(UserPasswordEditDocument, options);
      }
export type UserPasswordEditMutationHookResult = ReturnType<typeof useUserPasswordEditMutation>;
export type UserPasswordEditMutationResult = Apollo.MutationResult<UserPasswordEditMutation>;
export type UserPasswordEditMutationOptions = Apollo.BaseMutationOptions<UserPasswordEditMutation, UserPasswordEditMutationVariables>;