/* eslint-disable */
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
  createdAt: Scalars['Int']['output'];
  extendedArea: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  level: LevelAlert;
  reachedUsers: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

/** Alert input struct */
export type AlertInput = {
  level: LevelAlert;
  points: Array<Point>;
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
  OnFoot = 'ON_FOOT',
  Running = 'RUNNING',
  Still = 'STILL',
  Walking = 'WALKING'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Make GraphQL login */
  login: AuthBody;
  /** Make GraphQL request to create new alert. Only for admins. */
  newAlert: Alert;
  /** Make GraphQL request to create new position to track */
  newPosition: Position;
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
  /** Returns all the positions */
  alerts?: Maybe<Array<Alert>>;
  /** Returns the API version. It is like a "greet" function */
  apiVersion: Scalars['String']['output'];
  /**
   * Returns all the last positions for each user.
   * It is restricted to only admin users.
   */
  lastPositions?: Maybe<Array<Position>>;
  /** Returns all the positions */
  positions?: Maybe<Array<Position>>;
  /** Returns all the users */
  users?: Maybe<Array<User>>;
};


export type QueryAlertsArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLastPositionsArgs = {
  movingActivity?: InputMaybe<MovingActivity>;
};


export type QueryPositionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isAdmin: Scalars['Boolean']['output'];
  password: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginCredentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthBody', accessToken: string, tokenType: string, userId: number } };


export const LoginDocument = gql`
    mutation Login($input: LoginCredentials!) {
  login(input: $input) {
    accessToken
    tokenType
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
