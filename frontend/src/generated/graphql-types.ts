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
  DateTimeISO: { input: any; output: any; }
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  resource: Resource;
  user: User;
};

export type CommentInput = {
  content: Scalars['String']['input'];
  resource: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};

export type Contact = {
  __typename?: 'Contact';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  sourceUser: User;
  status: ContactStatus;
  targetUser: User;
};

export type ContactInput = {
  targetUserId: Scalars['ID']['input'];
};

/** Le statut d'un contact : en attente, accepté ou refusé */
export enum ContactStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Refused = 'REFUSED'
}

export type Like = {
  __typename?: 'Like';
  id: Scalars['ID']['output'];
  resource: Resource;
  user: User;
};

export type LikeInput = {
  resource: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptContactRequest: Contact;
  confirmEmail: Scalars['String']['output'];
  createComment: Comment;
  createLike: Like;
  createReport: Report;
  createResource: Resource;
  createSubscription: Subscription;
  createUser: User;
  deleteComment: Scalars['String']['output'];
  deleteLike: Scalars['String']['output'];
  deleteReport: Scalars['String']['output'];
  deleteResource: Scalars['String']['output'];
  deleteSubscription: Scalars['String']['output'];
  login: Scalars['String']['output'];
  logout: Scalars['String']['output'];
  refuseContactRequest: Contact;
  register: Scalars['String']['output'];
  removeContact: Scalars['Boolean']['output'];
  resetSendCode: Scalars['String']['output'];
  sendContactRequest: Contact;
};


export type MutationAcceptContactRequestArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationConfirmEmailArgs = {
  codeByUser: Scalars['String']['input'];
};


export type MutationCreateCommentArgs = {
  newComment: CommentInput;
};


export type MutationCreateLikeArgs = {
  data: LikeInput;
};


export type MutationCreateReportArgs = {
  newReport: ReportInput;
};


export type MutationCreateResourceArgs = {
  data: ResourceInput;
};


export type MutationCreateSubscriptionArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationDeleteCommentArgs = {
  commentToDelete: CommentInput;
};


export type MutationDeleteLikeArgs = {
  likeToDelete: LikeInput;
};


export type MutationDeleteReportArgs = {
  reportToDelete: ReportInput;
};


export type MutationDeleteResourceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubscriptionArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  data: UserInput;
};


export type MutationRefuseContactRequestArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  data: UserInput;
};


export type MutationRemoveContactArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationResetSendCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationSendContactRequestArgs = {
  contactToCreate: ContactInput;
};

export type Query = {
  __typename?: 'Query';
  getAllResources: Array<Resource>;
  getAllUsers: Array<User>;
  getCommentsByResource: Array<Comment>;
  getCommentsByUser: Array<Comment>;
  getLikesByResource: Array<Like>;
  getLikesByUser: Array<Like>;
  getMyContacts: Array<Contact>;
  getPendingContactRequests: Array<Contact>;
  getReportsByResource: Array<Report>;
  getReportsByUser: Array<Report>;
  getResourceById?: Maybe<Resource>;
  getUserInfo: UserInfo;
};


export type QueryGetCommentsByResourceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCommentsByUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLikesByResourceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLikesByUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReportsByResourceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReportsByUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetResourceByIdArgs = {
  id: Scalars['ID']['input'];
};

/** The reasons for reporting a resource */
export enum Reason {
  Harassment = 'HARASSMENT',
  Innapropriate = 'INNAPROPRIATE',
  None = 'NONE',
  Other = 'OTHER',
  Spam = 'SPAM'
}

export type Report = {
  __typename?: 'Report';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reason: Reason;
};

export type ReportInput = {
  content: Scalars['String']['input'];
  reason: Reason;
  resource: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};

export type Resource = {
  __typename?: 'Resource';
  comments: Array<Comment>;
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  likes: Array<Like>;
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  reports: Array<Report>;
  url: Scalars['String']['output'];
  usersWithAccess: Array<User>;
};

export type ResourceInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  path: Scalars['String']['input'];
  url: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  endAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  paidAt: Scalars['DateTimeISO']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  subscription?: Maybe<Subscription>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email?: Maybe<Scalars['String']['output']>;
  isLoggedIn: Scalars['Boolean']['output'];
};

export type UserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GetMyContactsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyContactsQuery = { __typename?: 'Query', getMyContacts: Array<{ __typename?: 'Contact', id: string, status: ContactStatus, createdAt: any, sourceUser: { __typename?: 'User', id: string, email: string }, targetUser: { __typename?: 'User', id: string, email: string } }> };

export type LoginMutationVariables = Exact<{
  data: UserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: string };

export type RegisterMutationVariables = Exact<{
  data: UserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type ConfirmEmailMutationVariables = Exact<{
  codeByUser: Scalars['String']['input'];
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: string };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, email: string }> };

export type GetUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', email?: string | null, isLoggedIn: boolean } };


export const GetMyContactsDocument = gql`
    query GetMyContacts {
  getMyContacts {
    id
    status
    createdAt
    sourceUser {
      id
      email
    }
    targetUser {
      id
      email
    }
  }
}
    `;

/**
 * __useGetMyContactsQuery__
 *
 * To run a query within a React component, call `useGetMyContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyContactsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyContactsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyContactsQuery, GetMyContactsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyContactsQuery, GetMyContactsQueryVariables>(GetMyContactsDocument, options);
      }
export function useGetMyContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyContactsQuery, GetMyContactsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyContactsQuery, GetMyContactsQueryVariables>(GetMyContactsDocument, options);
        }
export function useGetMyContactsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyContactsQuery, GetMyContactsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyContactsQuery, GetMyContactsQueryVariables>(GetMyContactsDocument, options);
        }
export type GetMyContactsQueryHookResult = ReturnType<typeof useGetMyContactsQuery>;
export type GetMyContactsLazyQueryHookResult = ReturnType<typeof useGetMyContactsLazyQuery>;
export type GetMyContactsSuspenseQueryHookResult = ReturnType<typeof useGetMyContactsSuspenseQuery>;
export type GetMyContactsQueryResult = Apollo.QueryResult<GetMyContactsQuery, GetMyContactsQueryVariables>;
export const LoginDocument = gql`
    mutation Login($data: UserInput!) {
  login(data: $data)
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
 *      data: // value for 'data'
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($data: UserInput!) {
  register(data: $data)
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($codeByUser: String!) {
  confirmEmail(codeByUser: $codeByUser)
}
    `;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      codeByUser: // value for 'codeByUser'
 *   },
 * });
 */
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, options);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const GetAllUsersDocument = gql`
    query getAllUsers {
  getAllUsers {
    id
    email
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetUserInfoDocument = gql`
    query GetUserInfo {
  getUserInfo {
    email
    isLoggedIn
  }
}
    `;

/**
 * __useGetUserInfoQuery__
 *
 * To run a query within a React component, call `useGetUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
      }
export function useGetUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
        }
export function useGetUserInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
        }
export type GetUserInfoQueryHookResult = ReturnType<typeof useGetUserInfoQuery>;
export type GetUserInfoLazyQueryHookResult = ReturnType<typeof useGetUserInfoLazyQuery>;
export type GetUserInfoSuspenseQueryHookResult = ReturnType<typeof useGetUserInfoSuspenseQuery>;
export type GetUserInfoQueryResult = Apollo.QueryResult<GetUserInfoQuery, GetUserInfoQueryVariables>;