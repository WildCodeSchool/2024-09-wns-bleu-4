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
  targetUserEmail: Scalars['String']['input'];
};

/** Le statut d'un contact : en attente, accepté ou refusé */
export enum ContactStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Refused = 'REFUSED'
}

export type ContactsResponse = {
  __typename?: 'ContactsResponse';
  acceptedContacts: Array<Contact>;
  pendingRequestsReceived: Array<Contact>;
  pendingRequestsSent: Array<Contact>;
};

export type CreateLogInput = {
  details?: InputMaybe<Scalars['String']['input']>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  message: Scalars['String']['input'];
  type: LogType;
  userId?: InputMaybe<Scalars['String']['input']>;
};

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

/** System log type enum */
export enum LogType {
  Error = 'ERROR',
  Info = 'INFO',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptContactRequest: Contact;
  clearSystemLogs: Scalars['String']['output'];
  confirmEmail: Scalars['String']['output'];
  createComment: Comment;
  createLike: Like;
  createReport: Report;
  createResource: Resource;
  createSubscription: Subscription;
  createSystemLog: SystemLog;
  createUser: User;
  createUserAccess: Scalars['String']['output'];
  deleteComment: Scalars['String']['output'];
  deleteLike: Scalars['String']['output'];
  deleteReport: Scalars['String']['output'];
  deleteResource: Scalars['String']['output'];
  deleteSubscription: Scalars['String']['output'];
  deleteSystemLog: Scalars['String']['output'];
  deleteUser: Scalars['String']['output'];
  login: Scalars['String']['output'];
  logout: Scalars['String']['output'];
  refuseContactRequest: Contact;
  register: Scalars['String']['output'];
  removeContact: Scalars['Boolean']['output'];
  resetSendCode: Scalars['String']['output'];
  sendContactRequest: Contact;
  updateUserRole: Scalars['String']['output'];
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


export type MutationCreateSystemLogArgs = {
  data: CreateLogInput;
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationCreateUserAccessArgs = {
  resourceId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
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


export type MutationDeleteSystemLogArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  data: UserInput;
};


export type MutationRefuseContactRequestArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  data: UserInput;
  lang: Scalars['String']['input'];
};


export type MutationRemoveContactArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationResetSendCodeArgs = {
  email: Scalars['String']['input'];
  lang: Scalars['String']['input'];
};


export type MutationSendContactRequestArgs = {
  contactToCreate: ContactInput;
};


export type MutationUpdateUserRoleArgs = {
  id: Scalars['ID']['input'];
  role: UserRole;
};

export type Query = {
  __typename?: 'Query';
  getAllResources: Array<Resource>;
  getAllUsers: Array<User>;
  getCommentsByResource: Array<Comment>;
  getCommentsByUser: Array<Comment>;
  getLikesByResource: Array<Like>;
  getLikesByUser: Array<Like>;
  getMyContacts: ContactsResponse;
  getReportsByResource: Array<Report>;
  getReportsByUser: Array<Report>;
  getResourceById?: Maybe<Resource>;
  getResourcesByUserId: Array<Resource>;
  getSystemLogById?: Maybe<SystemLog>;
  getSystemLogs: Array<SystemLog>;
  getUserInfo: UserInfo;
  getUserSharedResources: Array<Resource>;
  getUserSubscription?: Maybe<Subscription>;
  getUsersWithAccess: Array<User>;
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


export type QueryGetResourcesByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetSystemLogByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSystemLogsArgs = {
  limit?: Scalars['Float']['input'];
  offset?: Scalars['Float']['input'];
  type?: InputMaybe<LogType>;
};


export type QueryGetUserSharedResourcesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserSubscriptionArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUsersWithAccessArgs = {
  resourceId: Scalars['ID']['input'];
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
  user: User;
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

export type SystemLog = {
  __typename?: 'SystemLog';
  createdAt: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  type: LogType;
  userId?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: UserRole;
  subscription?: Maybe<Subscription>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isLoggedIn: Scalars['Boolean']['output'];
  isSubscribed?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<UserRole>;
};

export type UserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** User role enum */
export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SendContactRequestMutationVariables = Exact<{
  contactToCreate: ContactInput;
}>;


export type SendContactRequestMutation = { __typename?: 'Mutation', sendContactRequest: { __typename?: 'Contact', createdAt: any } };

export type AcceptContactRequestMutationVariables = Exact<{
  contactId: Scalars['ID']['input'];
}>;


export type AcceptContactRequestMutation = { __typename?: 'Mutation', acceptContactRequest: { __typename?: 'Contact', id: string, status: ContactStatus } };

export type RefuseContactRequestMutationVariables = Exact<{
  contactId: Scalars['ID']['input'];
}>;


export type RefuseContactRequestMutation = { __typename?: 'Mutation', refuseContactRequest: { __typename?: 'Contact', id: string, status: ContactStatus } };

export type RemoveContactMutationVariables = Exact<{
  contactId: Scalars['ID']['input'];
}>;


export type RemoveContactMutation = { __typename?: 'Mutation', removeContact: boolean };

export type GetMyContactsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyContactsQuery = { __typename?: 'Query', getMyContacts: { __typename?: 'ContactsResponse', acceptedContacts: Array<{ __typename?: 'Contact', id: string, status: ContactStatus, createdAt: any, sourceUser: { __typename?: 'User', id: string, email: string, role: UserRole }, targetUser: { __typename?: 'User', id: string, email: string } }>, pendingRequestsReceived: Array<{ __typename?: 'Contact', id: string, status: ContactStatus, createdAt: any, sourceUser: { __typename?: 'User', id: string, email: string }, targetUser: { __typename?: 'User', id: string, email: string } }>, pendingRequestsSent: Array<{ __typename?: 'Contact', id: string, status: ContactStatus, createdAt: any, sourceUser: { __typename?: 'User', id: string, email: string }, targetUser: { __typename?: 'User', id: string, email: string } }> } };

export type CreateResourceMutationVariables = Exact<{
  data: ResourceInput;
}>;


export type CreateResourceMutation = { __typename?: 'Mutation', createResource: { __typename?: 'Resource', id: number, name: string, description: string, path: string, url: string } };

export type DeleteResourceMutationVariables = Exact<{
  deleteResourceId: Scalars['ID']['input'];
}>;


export type DeleteResourceMutation = { __typename?: 'Mutation', deleteResource: string };

export type CreateUserAccessMutationVariables = Exact<{
  resourceId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type CreateUserAccessMutation = { __typename?: 'Mutation', createUserAccess: string };

export type GetAllResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllResourcesQuery = { __typename?: 'Query', getAllResources: Array<{ __typename?: 'Resource', id: number, name: string, description: string, path: string, url: string, user: { __typename?: 'User', id: string, email: string } }> };

export type GetResourcesByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetResourcesByUserIdQuery = { __typename?: 'Query', getResourcesByUserId: Array<{ __typename?: 'Resource', description: string, id: number, name: string, path: string, url: string }> };

export type GetUserSharedResourcesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserSharedResourcesQuery = { __typename?: 'Query', getUserSharedResources: Array<{ __typename?: 'Resource', id: number, name: string, description: string, path: string, url: string, user: { __typename?: 'User', id: string, email: string } }> };

export type GetResourceStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetResourceStatsQuery = { __typename?: 'Query', getAllResources: Array<{ __typename?: 'Resource', id: number }> };

export type CreateSubscriptionMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type CreateSubscriptionMutation = { __typename?: 'Mutation', createSubscription: { __typename?: 'Subscription', id: string, paidAt: any, endAt: any } };

export type DeleteSubscriptionMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type DeleteSubscriptionMutation = { __typename?: 'Mutation', deleteSubscription: string };

export type GetUserSubscriptionQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserSubscriptionQuery = { __typename?: 'Query', getUserSubscription?: { __typename?: 'Subscription', id: string, paidAt: any, endAt: any } | null };

export type CreateSystemLogMutationVariables = Exact<{
  data: CreateLogInput;
}>;


export type CreateSystemLogMutation = { __typename?: 'Mutation', createSystemLog: { __typename?: 'SystemLog', id: string, type: LogType, message: string, details?: string | null, userId?: string | null, ipAddress?: string | null, createdAt: string } };

export type DeleteSystemLogMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSystemLogMutation = { __typename?: 'Mutation', deleteSystemLog: string };

export type ClearSystemLogsMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearSystemLogsMutation = { __typename?: 'Mutation', clearSystemLogs: string };

export type GetSystemLogsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<LogType>;
}>;


export type GetSystemLogsQuery = { __typename?: 'Query', getSystemLogs: Array<{ __typename?: 'SystemLog', id: string, type: LogType, message: string, details?: string | null, userId?: string | null, ipAddress?: string | null, createdAt: string }> };

export type GetSystemLogByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSystemLogByIdQuery = { __typename?: 'Query', getSystemLogById?: { __typename?: 'SystemLog', id: string, type: LogType, message: string, details?: string | null, userId?: string | null, ipAddress?: string | null, createdAt: string } | null };

export type LoginMutationVariables = Exact<{
  data: UserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: string };

export type RegisterMutationVariables = Exact<{
  data: UserInput;
  lang: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type ConfirmEmailMutationVariables = Exact<{
  codeByUser: Scalars['String']['input'];
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: string };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: string };

export type UpdateUserRoleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  role: UserRole;
}>;


export type UpdateUserRoleMutation = { __typename?: 'Mutation', updateUserRole: string };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, subscription?: { __typename?: 'Subscription', id: string } | null }> };

export type GetUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', email?: string | null, isLoggedIn: boolean, id?: string | null, isSubscribed?: boolean | null, role?: UserRole | null } };

export type GetUserIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserIdQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', id?: string | null, email?: string | null } };

export type GetUserStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatsQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, role: UserRole, subscription?: { __typename?: 'Subscription', id: string } | null }> };


export const SendContactRequestDocument = gql`
    mutation SendContactRequest($contactToCreate: ContactInput!) {
  sendContactRequest(contactToCreate: $contactToCreate) {
    createdAt
  }
}
    `;
export type SendContactRequestMutationFn = Apollo.MutationFunction<SendContactRequestMutation, SendContactRequestMutationVariables>;

/**
 * __useSendContactRequestMutation__
 *
 * To run a mutation, you first call `useSendContactRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendContactRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendContactRequestMutation, { data, loading, error }] = useSendContactRequestMutation({
 *   variables: {
 *      contactToCreate: // value for 'contactToCreate'
 *   },
 * });
 */
export function useSendContactRequestMutation(baseOptions?: Apollo.MutationHookOptions<SendContactRequestMutation, SendContactRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendContactRequestMutation, SendContactRequestMutationVariables>(SendContactRequestDocument, options);
      }
export type SendContactRequestMutationHookResult = ReturnType<typeof useSendContactRequestMutation>;
export type SendContactRequestMutationResult = Apollo.MutationResult<SendContactRequestMutation>;
export type SendContactRequestMutationOptions = Apollo.BaseMutationOptions<SendContactRequestMutation, SendContactRequestMutationVariables>;
export const AcceptContactRequestDocument = gql`
    mutation AcceptContactRequest($contactId: ID!) {
  acceptContactRequest(contactId: $contactId) {
    id
    status
  }
}
    `;
export type AcceptContactRequestMutationFn = Apollo.MutationFunction<AcceptContactRequestMutation, AcceptContactRequestMutationVariables>;

/**
 * __useAcceptContactRequestMutation__
 *
 * To run a mutation, you first call `useAcceptContactRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptContactRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptContactRequestMutation, { data, loading, error }] = useAcceptContactRequestMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useAcceptContactRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptContactRequestMutation, AcceptContactRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptContactRequestMutation, AcceptContactRequestMutationVariables>(AcceptContactRequestDocument, options);
      }
export type AcceptContactRequestMutationHookResult = ReturnType<typeof useAcceptContactRequestMutation>;
export type AcceptContactRequestMutationResult = Apollo.MutationResult<AcceptContactRequestMutation>;
export type AcceptContactRequestMutationOptions = Apollo.BaseMutationOptions<AcceptContactRequestMutation, AcceptContactRequestMutationVariables>;
export const RefuseContactRequestDocument = gql`
    mutation RefuseContactRequest($contactId: ID!) {
  refuseContactRequest(contactId: $contactId) {
    id
    status
  }
}
    `;
export type RefuseContactRequestMutationFn = Apollo.MutationFunction<RefuseContactRequestMutation, RefuseContactRequestMutationVariables>;

/**
 * __useRefuseContactRequestMutation__
 *
 * To run a mutation, you first call `useRefuseContactRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefuseContactRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refuseContactRequestMutation, { data, loading, error }] = useRefuseContactRequestMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useRefuseContactRequestMutation(baseOptions?: Apollo.MutationHookOptions<RefuseContactRequestMutation, RefuseContactRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefuseContactRequestMutation, RefuseContactRequestMutationVariables>(RefuseContactRequestDocument, options);
      }
export type RefuseContactRequestMutationHookResult = ReturnType<typeof useRefuseContactRequestMutation>;
export type RefuseContactRequestMutationResult = Apollo.MutationResult<RefuseContactRequestMutation>;
export type RefuseContactRequestMutationOptions = Apollo.BaseMutationOptions<RefuseContactRequestMutation, RefuseContactRequestMutationVariables>;
export const RemoveContactDocument = gql`
    mutation RemoveContact($contactId: ID!) {
  removeContact(contactId: $contactId)
}
    `;
export type RemoveContactMutationFn = Apollo.MutationFunction<RemoveContactMutation, RemoveContactMutationVariables>;

/**
 * __useRemoveContactMutation__
 *
 * To run a mutation, you first call `useRemoveContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeContactMutation, { data, loading, error }] = useRemoveContactMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useRemoveContactMutation(baseOptions?: Apollo.MutationHookOptions<RemoveContactMutation, RemoveContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveContactMutation, RemoveContactMutationVariables>(RemoveContactDocument, options);
      }
export type RemoveContactMutationHookResult = ReturnType<typeof useRemoveContactMutation>;
export type RemoveContactMutationResult = Apollo.MutationResult<RemoveContactMutation>;
export type RemoveContactMutationOptions = Apollo.BaseMutationOptions<RemoveContactMutation, RemoveContactMutationVariables>;
export const GetMyContactsDocument = gql`
    query GetMyContacts {
  getMyContacts {
    acceptedContacts {
      id
      status
      createdAt
      sourceUser {
        id
        email
        role
      }
      targetUser {
        id
        email
      }
    }
    pendingRequestsReceived {
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
    pendingRequestsSent {
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
export const CreateResourceDocument = gql`
    mutation CreateResource($data: ResourceInput!) {
  createResource(data: $data) {
    id
    name
    description
    path
    url
  }
}
    `;
export type CreateResourceMutationFn = Apollo.MutationFunction<CreateResourceMutation, CreateResourceMutationVariables>;

/**
 * __useCreateResourceMutation__
 *
 * To run a mutation, you first call `useCreateResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createResourceMutation, { data, loading, error }] = useCreateResourceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateResourceMutation(baseOptions?: Apollo.MutationHookOptions<CreateResourceMutation, CreateResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResourceMutation, CreateResourceMutationVariables>(CreateResourceDocument, options);
      }
export type CreateResourceMutationHookResult = ReturnType<typeof useCreateResourceMutation>;
export type CreateResourceMutationResult = Apollo.MutationResult<CreateResourceMutation>;
export type CreateResourceMutationOptions = Apollo.BaseMutationOptions<CreateResourceMutation, CreateResourceMutationVariables>;
export const DeleteResourceDocument = gql`
    mutation DeleteResource($deleteResourceId: ID!) {
  deleteResource(id: $deleteResourceId)
}
    `;
export type DeleteResourceMutationFn = Apollo.MutationFunction<DeleteResourceMutation, DeleteResourceMutationVariables>;

/**
 * __useDeleteResourceMutation__
 *
 * To run a mutation, you first call `useDeleteResourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteResourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteResourceMutation, { data, loading, error }] = useDeleteResourceMutation({
 *   variables: {
 *      deleteResourceId: // value for 'deleteResourceId'
 *   },
 * });
 */
export function useDeleteResourceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResourceMutation, DeleteResourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteResourceMutation, DeleteResourceMutationVariables>(DeleteResourceDocument, options);
      }
export type DeleteResourceMutationHookResult = ReturnType<typeof useDeleteResourceMutation>;
export type DeleteResourceMutationResult = Apollo.MutationResult<DeleteResourceMutation>;
export type DeleteResourceMutationOptions = Apollo.BaseMutationOptions<DeleteResourceMutation, DeleteResourceMutationVariables>;
export const CreateUserAccessDocument = gql`
    mutation CreateUserAccess($resourceId: ID!, $userId: ID!) {
  createUserAccess(resourceId: $resourceId, userId: $userId)
}
    `;
export type CreateUserAccessMutationFn = Apollo.MutationFunction<CreateUserAccessMutation, CreateUserAccessMutationVariables>;

/**
 * __useCreateUserAccessMutation__
 *
 * To run a mutation, you first call `useCreateUserAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserAccessMutation, { data, loading, error }] = useCreateUserAccessMutation({
 *   variables: {
 *      resourceId: // value for 'resourceId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateUserAccessMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserAccessMutation, CreateUserAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserAccessMutation, CreateUserAccessMutationVariables>(CreateUserAccessDocument, options);
      }
export type CreateUserAccessMutationHookResult = ReturnType<typeof useCreateUserAccessMutation>;
export type CreateUserAccessMutationResult = Apollo.MutationResult<CreateUserAccessMutation>;
export type CreateUserAccessMutationOptions = Apollo.BaseMutationOptions<CreateUserAccessMutation, CreateUserAccessMutationVariables>;
export const GetAllResourcesDocument = gql`
    query GetAllResources {
  getAllResources {
    id
    name
    description
    path
    url
    user {
      id
      email
    }
  }
}
    `;

/**
 * __useGetAllResourcesQuery__
 *
 * To run a query within a React component, call `useGetAllResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllResourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllResourcesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllResourcesQuery, GetAllResourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllResourcesQuery, GetAllResourcesQueryVariables>(GetAllResourcesDocument, options);
      }
export function useGetAllResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllResourcesQuery, GetAllResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllResourcesQuery, GetAllResourcesQueryVariables>(GetAllResourcesDocument, options);
        }
export function useGetAllResourcesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllResourcesQuery, GetAllResourcesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllResourcesQuery, GetAllResourcesQueryVariables>(GetAllResourcesDocument, options);
        }
export type GetAllResourcesQueryHookResult = ReturnType<typeof useGetAllResourcesQuery>;
export type GetAllResourcesLazyQueryHookResult = ReturnType<typeof useGetAllResourcesLazyQuery>;
export type GetAllResourcesSuspenseQueryHookResult = ReturnType<typeof useGetAllResourcesSuspenseQuery>;
export type GetAllResourcesQueryResult = Apollo.QueryResult<GetAllResourcesQuery, GetAllResourcesQueryVariables>;
export const GetResourcesByUserIdDocument = gql`
    query GetResourcesByUserId($userId: ID!) {
  getResourcesByUserId(userId: $userId) {
    description
    id
    name
    path
    url
  }
}
    `;

/**
 * __useGetResourcesByUserIdQuery__
 *
 * To run a query within a React component, call `useGetResourcesByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResourcesByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResourcesByUserIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetResourcesByUserIdQuery(baseOptions: Apollo.QueryHookOptions<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables> & ({ variables: GetResourcesByUserIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables>(GetResourcesByUserIdDocument, options);
      }
export function useGetResourcesByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables>(GetResourcesByUserIdDocument, options);
        }
export function useGetResourcesByUserIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables>(GetResourcesByUserIdDocument, options);
        }
export type GetResourcesByUserIdQueryHookResult = ReturnType<typeof useGetResourcesByUserIdQuery>;
export type GetResourcesByUserIdLazyQueryHookResult = ReturnType<typeof useGetResourcesByUserIdLazyQuery>;
export type GetResourcesByUserIdSuspenseQueryHookResult = ReturnType<typeof useGetResourcesByUserIdSuspenseQuery>;
export type GetResourcesByUserIdQueryResult = Apollo.QueryResult<GetResourcesByUserIdQuery, GetResourcesByUserIdQueryVariables>;
export const GetUserSharedResourcesDocument = gql`
    query GetUserSharedResources($userId: ID!) {
  getUserSharedResources(userId: $userId) {
    id
    name
    description
    path
    url
    user {
      id
      email
    }
  }
}
    `;

/**
 * __useGetUserSharedResourcesQuery__
 *
 * To run a query within a React component, call `useGetUserSharedResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSharedResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSharedResourcesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserSharedResourcesQuery(baseOptions: Apollo.QueryHookOptions<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables> & ({ variables: GetUserSharedResourcesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables>(GetUserSharedResourcesDocument, options);
      }
export function useGetUserSharedResourcesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables>(GetUserSharedResourcesDocument, options);
        }
export function useGetUserSharedResourcesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables>(GetUserSharedResourcesDocument, options);
        }
export type GetUserSharedResourcesQueryHookResult = ReturnType<typeof useGetUserSharedResourcesQuery>;
export type GetUserSharedResourcesLazyQueryHookResult = ReturnType<typeof useGetUserSharedResourcesLazyQuery>;
export type GetUserSharedResourcesSuspenseQueryHookResult = ReturnType<typeof useGetUserSharedResourcesSuspenseQuery>;
export type GetUserSharedResourcesQueryResult = Apollo.QueryResult<GetUserSharedResourcesQuery, GetUserSharedResourcesQueryVariables>;
export const GetResourceStatsDocument = gql`
    query GetResourceStats {
  getAllResources {
    id
  }
}
    `;

/**
 * __useGetResourceStatsQuery__
 *
 * To run a query within a React component, call `useGetResourceStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResourceStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResourceStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetResourceStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetResourceStatsQuery, GetResourceStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetResourceStatsQuery, GetResourceStatsQueryVariables>(GetResourceStatsDocument, options);
      }
export function useGetResourceStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetResourceStatsQuery, GetResourceStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetResourceStatsQuery, GetResourceStatsQueryVariables>(GetResourceStatsDocument, options);
        }
export function useGetResourceStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetResourceStatsQuery, GetResourceStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetResourceStatsQuery, GetResourceStatsQueryVariables>(GetResourceStatsDocument, options);
        }
export type GetResourceStatsQueryHookResult = ReturnType<typeof useGetResourceStatsQuery>;
export type GetResourceStatsLazyQueryHookResult = ReturnType<typeof useGetResourceStatsLazyQuery>;
export type GetResourceStatsSuspenseQueryHookResult = ReturnType<typeof useGetResourceStatsSuspenseQuery>;
export type GetResourceStatsQueryResult = Apollo.QueryResult<GetResourceStatsQuery, GetResourceStatsQueryVariables>;
export const CreateSubscriptionDocument = gql`
    mutation CreateSubscription($userId: ID!) {
  createSubscription(userId: $userId) {
    id
    paidAt
    endAt
  }
}
    `;
export type CreateSubscriptionMutationFn = Apollo.MutationFunction<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>;

/**
 * __useCreateSubscriptionMutation__
 *
 * To run a mutation, you first call `useCreateSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubscriptionMutation, { data, loading, error }] = useCreateSubscriptionMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>(CreateSubscriptionDocument, options);
      }
export type CreateSubscriptionMutationHookResult = ReturnType<typeof useCreateSubscriptionMutation>;
export type CreateSubscriptionMutationResult = Apollo.MutationResult<CreateSubscriptionMutation>;
export type CreateSubscriptionMutationOptions = Apollo.BaseMutationOptions<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>;
export const DeleteSubscriptionDocument = gql`
    mutation DeleteSubscription($userId: ID!) {
  deleteSubscription(userId: $userId)
}
    `;
export type DeleteSubscriptionMutationFn = Apollo.MutationFunction<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>;

/**
 * __useDeleteSubscriptionMutation__
 *
 * To run a mutation, you first call `useDeleteSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSubscriptionMutation, { data, loading, error }] = useDeleteSubscriptionMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>(DeleteSubscriptionDocument, options);
      }
export type DeleteSubscriptionMutationHookResult = ReturnType<typeof useDeleteSubscriptionMutation>;
export type DeleteSubscriptionMutationResult = Apollo.MutationResult<DeleteSubscriptionMutation>;
export type DeleteSubscriptionMutationOptions = Apollo.BaseMutationOptions<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>;
export const GetUserSubscriptionDocument = gql`
    query GetUserSubscription($userId: ID!) {
  getUserSubscription(userId: $userId) {
    id
    paidAt
    endAt
  }
}
    `;

/**
 * __useGetUserSubscriptionQuery__
 *
 * To run a query within a React component, call `useGetUserSubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSubscriptionQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserSubscriptionQuery(baseOptions: Apollo.QueryHookOptions<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables> & ({ variables: GetUserSubscriptionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables>(GetUserSubscriptionDocument, options);
      }
export function useGetUserSubscriptionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables>(GetUserSubscriptionDocument, options);
        }
export function useGetUserSubscriptionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables>(GetUserSubscriptionDocument, options);
        }
export type GetUserSubscriptionQueryHookResult = ReturnType<typeof useGetUserSubscriptionQuery>;
export type GetUserSubscriptionLazyQueryHookResult = ReturnType<typeof useGetUserSubscriptionLazyQuery>;
export type GetUserSubscriptionSuspenseQueryHookResult = ReturnType<typeof useGetUserSubscriptionSuspenseQuery>;
export type GetUserSubscriptionQueryResult = Apollo.QueryResult<GetUserSubscriptionQuery, GetUserSubscriptionQueryVariables>;
export const CreateSystemLogDocument = gql`
    mutation CreateSystemLog($data: CreateLogInput!) {
  createSystemLog(data: $data) {
    id
    type
    message
    details
    userId
    ipAddress
    createdAt
  }
}
    `;
export type CreateSystemLogMutationFn = Apollo.MutationFunction<CreateSystemLogMutation, CreateSystemLogMutationVariables>;

/**
 * __useCreateSystemLogMutation__
 *
 * To run a mutation, you first call `useCreateSystemLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemLogMutation, { data, loading, error }] = useCreateSystemLogMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSystemLogMutation(baseOptions?: Apollo.MutationHookOptions<CreateSystemLogMutation, CreateSystemLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSystemLogMutation, CreateSystemLogMutationVariables>(CreateSystemLogDocument, options);
      }
export type CreateSystemLogMutationHookResult = ReturnType<typeof useCreateSystemLogMutation>;
export type CreateSystemLogMutationResult = Apollo.MutationResult<CreateSystemLogMutation>;
export type CreateSystemLogMutationOptions = Apollo.BaseMutationOptions<CreateSystemLogMutation, CreateSystemLogMutationVariables>;
export const DeleteSystemLogDocument = gql`
    mutation DeleteSystemLog($id: ID!) {
  deleteSystemLog(id: $id)
}
    `;
export type DeleteSystemLogMutationFn = Apollo.MutationFunction<DeleteSystemLogMutation, DeleteSystemLogMutationVariables>;

/**
 * __useDeleteSystemLogMutation__
 *
 * To run a mutation, you first call `useDeleteSystemLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSystemLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSystemLogMutation, { data, loading, error }] = useDeleteSystemLogMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSystemLogMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSystemLogMutation, DeleteSystemLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSystemLogMutation, DeleteSystemLogMutationVariables>(DeleteSystemLogDocument, options);
      }
export type DeleteSystemLogMutationHookResult = ReturnType<typeof useDeleteSystemLogMutation>;
export type DeleteSystemLogMutationResult = Apollo.MutationResult<DeleteSystemLogMutation>;
export type DeleteSystemLogMutationOptions = Apollo.BaseMutationOptions<DeleteSystemLogMutation, DeleteSystemLogMutationVariables>;
export const ClearSystemLogsDocument = gql`
    mutation ClearSystemLogs {
  clearSystemLogs
}
    `;
export type ClearSystemLogsMutationFn = Apollo.MutationFunction<ClearSystemLogsMutation, ClearSystemLogsMutationVariables>;

/**
 * __useClearSystemLogsMutation__
 *
 * To run a mutation, you first call `useClearSystemLogsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearSystemLogsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearSystemLogsMutation, { data, loading, error }] = useClearSystemLogsMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearSystemLogsMutation(baseOptions?: Apollo.MutationHookOptions<ClearSystemLogsMutation, ClearSystemLogsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearSystemLogsMutation, ClearSystemLogsMutationVariables>(ClearSystemLogsDocument, options);
      }
export type ClearSystemLogsMutationHookResult = ReturnType<typeof useClearSystemLogsMutation>;
export type ClearSystemLogsMutationResult = Apollo.MutationResult<ClearSystemLogsMutation>;
export type ClearSystemLogsMutationOptions = Apollo.BaseMutationOptions<ClearSystemLogsMutation, ClearSystemLogsMutationVariables>;
export const GetSystemLogsDocument = gql`
    query GetSystemLogs($limit: Float, $offset: Float, $type: LogType) {
  getSystemLogs(limit: $limit, offset: $offset, type: $type) {
    id
    type
    message
    details
    userId
    ipAddress
    createdAt
  }
}
    `;

/**
 * __useGetSystemLogsQuery__
 *
 * To run a query within a React component, call `useGetSystemLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemLogsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetSystemLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetSystemLogsQuery, GetSystemLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemLogsQuery, GetSystemLogsQueryVariables>(GetSystemLogsDocument, options);
      }
export function useGetSystemLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemLogsQuery, GetSystemLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemLogsQuery, GetSystemLogsQueryVariables>(GetSystemLogsDocument, options);
        }
export function useGetSystemLogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemLogsQuery, GetSystemLogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemLogsQuery, GetSystemLogsQueryVariables>(GetSystemLogsDocument, options);
        }
export type GetSystemLogsQueryHookResult = ReturnType<typeof useGetSystemLogsQuery>;
export type GetSystemLogsLazyQueryHookResult = ReturnType<typeof useGetSystemLogsLazyQuery>;
export type GetSystemLogsSuspenseQueryHookResult = ReturnType<typeof useGetSystemLogsSuspenseQuery>;
export type GetSystemLogsQueryResult = Apollo.QueryResult<GetSystemLogsQuery, GetSystemLogsQueryVariables>;
export const GetSystemLogByIdDocument = gql`
    query GetSystemLogById($id: ID!) {
  getSystemLogById(id: $id) {
    id
    type
    message
    details
    userId
    ipAddress
    createdAt
  }
}
    `;

/**
 * __useGetSystemLogByIdQuery__
 *
 * To run a query within a React component, call `useGetSystemLogByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemLogByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemLogByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemLogByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables> & ({ variables: GetSystemLogByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables>(GetSystemLogByIdDocument, options);
      }
export function useGetSystemLogByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables>(GetSystemLogByIdDocument, options);
        }
export function useGetSystemLogByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables>(GetSystemLogByIdDocument, options);
        }
export type GetSystemLogByIdQueryHookResult = ReturnType<typeof useGetSystemLogByIdQuery>;
export type GetSystemLogByIdLazyQueryHookResult = ReturnType<typeof useGetSystemLogByIdLazyQuery>;
export type GetSystemLogByIdSuspenseQueryHookResult = ReturnType<typeof useGetSystemLogByIdSuspenseQuery>;
export type GetSystemLogByIdQueryResult = Apollo.QueryResult<GetSystemLogByIdQuery, GetSystemLogByIdQueryVariables>;
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
    mutation Register($data: UserInput!, $lang: String!) {
  register(data: $data, lang: $lang)
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
 *      lang: // value for 'lang'
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
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const UpdateUserRoleDocument = gql`
    mutation UpdateUserRole($id: ID!, $role: UserRole!) {
  updateUserRole(id: $id, role: $role)
}
    `;
export type UpdateUserRoleMutationFn = Apollo.MutationFunction<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;

/**
 * __useUpdateUserRoleMutation__
 *
 * To run a mutation, you first call `useUpdateUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserRoleMutation, { data, loading, error }] = useUpdateUserRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUpdateUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>(UpdateUserRoleDocument, options);
      }
export type UpdateUserRoleMutationHookResult = ReturnType<typeof useUpdateUserRoleMutation>;
export type UpdateUserRoleMutationResult = Apollo.MutationResult<UpdateUserRoleMutation>;
export type UpdateUserRoleMutationOptions = Apollo.BaseMutationOptions<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const GetAllUsersDocument = gql`
    query getAllUsers {
  getAllUsers {
    id
    email
    role
    subscription {
      id
    }
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
    id
    isSubscribed
    role
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
export const GetUserIdDocument = gql`
    query GetUserId {
  getUserInfo {
    id
    email
  }
}
    `;

/**
 * __useGetUserIdQuery__
 *
 * To run a query within a React component, call `useGetUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserIdQuery(baseOptions?: Apollo.QueryHookOptions<GetUserIdQuery, GetUserIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserIdQuery, GetUserIdQueryVariables>(GetUserIdDocument, options);
      }
export function useGetUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserIdQuery, GetUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserIdQuery, GetUserIdQueryVariables>(GetUserIdDocument, options);
        }
export function useGetUserIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserIdQuery, GetUserIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserIdQuery, GetUserIdQueryVariables>(GetUserIdDocument, options);
        }
export type GetUserIdQueryHookResult = ReturnType<typeof useGetUserIdQuery>;
export type GetUserIdLazyQueryHookResult = ReturnType<typeof useGetUserIdLazyQuery>;
export type GetUserIdSuspenseQueryHookResult = ReturnType<typeof useGetUserIdSuspenseQuery>;
export type GetUserIdQueryResult = Apollo.QueryResult<GetUserIdQuery, GetUserIdQueryVariables>;
export const GetUserStatsDocument = gql`
    query GetUserStats {
  getAllUsers {
    id
    role
    subscription {
      id
    }
  }
}
    `;

/**
 * __useGetUserStatsQuery__
 *
 * To run a query within a React component, call `useGetUserStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
      }
export function useGetUserStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
export function useGetUserStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserStatsQuery, GetUserStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(GetUserStatsDocument, options);
        }
export type GetUserStatsQueryHookResult = ReturnType<typeof useGetUserStatsQuery>;
export type GetUserStatsLazyQueryHookResult = ReturnType<typeof useGetUserStatsLazyQuery>;
export type GetUserStatsSuspenseQueryHookResult = ReturnType<typeof useGetUserStatsSuspenseQuery>;
export type GetUserStatsQueryResult = Apollo.QueryResult<GetUserStatsQuery, GetUserStatsQueryVariables>;