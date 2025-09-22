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
  message: Scalars['String']['input'];
  type: LogType;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateReportInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  reason: Reason;
  resourceId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
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
  cancelSubscription: Scalars['Boolean']['output'];
  clearSystemLogs: Scalars['String']['output'];
  confirmEmail: Scalars['String']['output'];
  confirmPayment: Scalars['Boolean']['output'];
  createPaymentIntent: Scalars['String']['output'];
  createReport: Report;
  createReportByIds: Report;
  createResource: Resource;
  createStripeSubscription: Scalars['String']['output'];
  createSubscription: Subscription;
  createSystemLog: SystemLog;
  createUser: User;
  createUserAccess: Scalars['String']['output'];
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
  resetPassword: Scalars['String']['output'];
  resetPasswordSendCode: Scalars['String']['output'];
  sendContactRequest: Contact;
  updateProfilePicture: User;
  updateResourceDescription: Resource;
  updateUserRole: Scalars['String']['output'];
};


export type MutationAcceptContactRequestArgs = {
  contactId: Scalars['ID']['input'];
};


export type MutationCancelSubscriptionArgs = {
  subscriptionId: Scalars['String']['input'];
};


export type MutationConfirmEmailArgs = {
  codeByUser: Scalars['String']['input'];
};


export type MutationConfirmPaymentArgs = {
  clientSecret: Scalars['String']['input'];
  paymentMethodId: Scalars['String']['input'];
};


export type MutationCreatePaymentIntentArgs = {
  amount: Scalars['Float']['input'];
  currency?: Scalars['String']['input'];
  description?: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateReportArgs = {
  newReport: ReportInput;
};


export type MutationCreateReportByIdsArgs = {
  input: CreateReportInput;
};


export type MutationCreateResourceArgs = {
  data: ResourceInput;
};


export type MutationCreateStripeSubscriptionArgs = {
  priceId: Scalars['String']['input'];
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


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationResetPasswordSendCodeArgs = {
  email: Scalars['String']['input'];
  lang: Scalars['String']['input'];
};


export type MutationSendContactRequestArgs = {
  contactToCreate: ContactInput;
};


export type MutationUpdateProfilePictureArgs = {
  data: UpdateProfilePictureInput;
};


export type MutationUpdateResourceDescriptionArgs = {
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserRoleArgs = {
  id: Scalars['ID']['input'];
  role: UserRole;
};

export type Query = {
  __typename?: 'Query';
  checkUserExists: Scalars['Boolean']['output'];
  getAllReports: Array<Report>;
  getAllResources: Array<Resource>;
  getAllUsers: Array<User>;
  getMyContacts: ContactsResponse;
  getPaymentIntent: Scalars['String']['output'];
  getReportsByResource: Array<Report>;
  getReportsByUser: Array<Report>;
  getResourceById?: Maybe<Resource>;
  getResourcesByUserId: Array<Resource>;
  getSystemLogById?: Maybe<SystemLog>;
  getSystemLogs: Array<SystemLog>;
  getUserInfo: UserInfo;
  getUserSharedResources: Array<Resource>;
  getUserStripeCustomerId?: Maybe<Scalars['String']['output']>;
  getUserSubscription?: Maybe<Subscription>;
  getUserTotalFileSize: Scalars['Float']['output'];
  getUsersWithAccess: Array<User>;
};


export type QueryCheckUserExistsArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetPaymentIntentArgs = {
  paymentIntentId: Scalars['String']['input'];
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


export type QueryGetUserTotalFileSizeArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUsersWithAccessArgs = {
  resourceId: Scalars['ID']['input'];
};

/** The reasons for reporting a resource */
export enum Reason {
  Corrupted = 'CORRUPTED',
  Display = 'DISPLAY',
  Harassment = 'HARASSMENT',
  Innapropriate = 'INNAPROPRIATE',
  None = 'NONE',
  Other = 'OTHER',
  Spam = 'SPAM'
}

export type Report = {
  __typename?: 'Report';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  reason: Reason;
  resource: Resource;
  user: User;
};

export type ReportInput = {
  content: Scalars['String']['input'];
  reason: Reason;
  resource: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};

export type Resource = {
  __typename?: 'Resource';
  description: Scalars['String']['output'];
  formattedSize: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  reports: Array<Report>;
  size: Scalars['Float']['output'];
  url: Scalars['String']['output'];
  user: User;
  usersWithAccess: Array<User>;
};

export type ResourceInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  path: Scalars['String']['input'];
  size: Scalars['Float']['input'];
  url: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  endAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  paidAt: Scalars['DateTimeISO']['output'];
  status: Scalars['String']['output'];
  stripePriceId?: Maybe<Scalars['String']['output']>;
  stripeSubscriptionId?: Maybe<Scalars['String']['output']>;
};

export type SystemLog = {
  __typename?: 'SystemLog';
  createdAt: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  type: LogType;
  userId?: Maybe<Scalars['String']['output']>;
};

export type UpdateProfilePictureInput = {
  profilePictureUrl: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  subscription?: Maybe<Subscription>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isLoggedIn: Scalars['Boolean']['output'];
  isSubscribed?: Maybe<Scalars['Boolean']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRole>;
  storage?: Maybe<UserStorage>;
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

export type UserStorage = {
  __typename?: 'UserStorage';
  bytesUsed: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

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

export type CreatePaymentIntentMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreatePaymentIntentMutation = { __typename?: 'Mutation', createPaymentIntent: string };

export type ConfirmPaymentMutationVariables = Exact<{
  clientSecret: Scalars['String']['input'];
  paymentMethodId: Scalars['String']['input'];
}>;


export type ConfirmPaymentMutation = { __typename?: 'Mutation', confirmPayment: boolean };

export type CreateStripeSubscriptionMutationVariables = Exact<{
  priceId: Scalars['String']['input'];
}>;


export type CreateStripeSubscriptionMutation = { __typename?: 'Mutation', createStripeSubscription: string };

export type CancelSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input'];
}>;


export type CancelSubscriptionMutation = { __typename?: 'Mutation', cancelSubscription: boolean };

export type GetPaymentIntentQueryVariables = Exact<{
  paymentIntentId: Scalars['String']['input'];
}>;


export type GetPaymentIntentQuery = { __typename?: 'Query', getPaymentIntent: string };

export type GetUserStripeCustomerIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStripeCustomerIdQuery = { __typename?: 'Query', getUserStripeCustomerId?: string | null };

export type CreateReportByIdsMutationVariables = Exact<{
  input: CreateReportInput;
}>;


export type CreateReportByIdsMutation = { __typename?: 'Mutation', createReportByIds: { __typename?: 'Report', id: string, reason: Reason, content: string, createdAt: any, user: { __typename?: 'User', id: string, email: string }, resource: { __typename?: 'Resource', id: number, name: string, user: { __typename?: 'User', id: string, email: string } } } };

export type DeleteReportMutationVariables = Exact<{
  reportToDelete: ReportInput;
}>;


export type DeleteReportMutation = { __typename?: 'Mutation', deleteReport: string };

export type GetAllReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReportsQuery = { __typename?: 'Query', getAllReports: Array<{ __typename?: 'Report', id: string, reason: Reason, content: string, createdAt: any, user: { __typename?: 'User', id: string, email: string }, resource: { __typename?: 'Resource', id: number, name: string, url: string, user: { __typename?: 'User', id: string, email: string } } }> };

export type GetReportsByUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReportsByUserQuery = { __typename?: 'Query', getReportsByUser: Array<{ __typename?: 'Report', id: string, reason: Reason, content: string, createdAt: any, user: { __typename?: 'User', id: string, email: string }, resource: { __typename?: 'Resource', id: number, name: string, url: string, user: { __typename?: 'User', id: string, email: string } } }> };

export type GetReportsByResourceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReportsByResourceQuery = { __typename?: 'Query', getReportsByResource: Array<{ __typename?: 'Report', id: string, reason: Reason, content: string, createdAt: any, user: { __typename?: 'User', id: string, email: string }, resource: { __typename?: 'Resource', id: number, name: string, url: string, user: { __typename?: 'User', id: string, email: string } } }> };

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

export type UpdateResourceDescriptionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  description: Scalars['String']['input'];
}>;


export type UpdateResourceDescriptionMutation = { __typename?: 'Mutation', updateResourceDescription: { __typename?: 'Resource', id: number, name: string, description: string, url: string, path: string } };

export type GetAllResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllResourcesQuery = { __typename?: 'Query', getAllResources: Array<{ __typename?: 'Resource', id: number, name: string, description: string, path: string, url: string, size: number, formattedSize: string, user: { __typename?: 'User', id: string, email: string } }> };

export type GetResourcesByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetResourcesByUserIdQuery = { __typename?: 'Query', getResourcesByUserId: Array<{ __typename?: 'Resource', description: string, id: number, name: string, path: string, url: string, size: number, formattedSize: string }> };

export type GetUserSharedResourcesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserSharedResourcesQuery = { __typename?: 'Query', getUserSharedResources: Array<{ __typename?: 'Resource', id: number, name: string, description: string, path: string, url: string, size: number, formattedSize: string, user: { __typename?: 'User', id: string, email: string, createdAt: any, profilePicture?: string | null } }> };

export type GetResourceStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetResourceStatsQuery = { __typename?: 'Query', getAllResources: Array<{ __typename?: 'Resource', id: number }> };

export type GetUserTotalFileSizeQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserTotalFileSizeQuery = { __typename?: 'Query', getUserTotalFileSize: number };

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


export type CreateSystemLogMutation = { __typename?: 'Mutation', createSystemLog: { __typename?: 'SystemLog', id: string, type: LogType, message: string, details?: string | null, userId?: string | null, createdAt: string } };

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


export type GetSystemLogsQuery = { __typename?: 'Query', getSystemLogs: Array<{ __typename?: 'SystemLog', id: string, type: LogType, message: string, details?: string | null, userId?: string | null, createdAt: string }> };

export type GetSystemLogByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSystemLogByIdQuery = { __typename?: 'Query', getSystemLogById?: { __typename?: 'SystemLog', id: string, type: LogType, message: string, details?: string | null, userId?: string | null, createdAt: string } | null };

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

export type UpdateProfilePictureMutationVariables = Exact<{
  data: UpdateProfilePictureInput;
}>;


export type UpdateProfilePictureMutation = { __typename?: 'Mutation', updateProfilePicture: { __typename?: 'User', id: string, email: string, profilePicture?: string | null } };

export type ResetPasswordSendCodeMutationVariables = Exact<{
  email: Scalars['String']['input'];
  lang: Scalars['String']['input'];
}>;


export type ResetPasswordSendCodeMutation = { __typename?: 'Mutation', resetPasswordSendCode: string };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: string };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, subscription?: { __typename?: 'Subscription', id: string } | null }> };

export type GetUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', email?: string | null, isLoggedIn: boolean, id?: string | null, isSubscribed?: boolean | null, role?: UserRole | null, profilePicture?: string | null, storage?: { __typename?: 'UserStorage', bytesUsed: string, percentage: number } | null } };

export type GetUserIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserIdQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfo', id?: string | null, email?: string | null } };

export type GetUserStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserStatsQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: string, role: UserRole, subscription?: { __typename?: 'Subscription', id: string } | null }> };

export type CheckUserExistsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type CheckUserExistsQuery = { __typename?: 'Query', checkUserExists: boolean };


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
export const CreatePaymentIntentDocument = gql`
    mutation CreatePaymentIntent($amount: Float!, $currency: String, $description: String, $metadata: String) {
  createPaymentIntent(
    amount: $amount
    currency: $currency
    description: $description
    metadata: $metadata
  )
}
    `;
export type CreatePaymentIntentMutationFn = Apollo.MutationFunction<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>;

/**
 * __useCreatePaymentIntentMutation__
 *
 * To run a mutation, you first call `useCreatePaymentIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymentIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymentIntentMutation, { data, loading, error }] = useCreatePaymentIntentMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      currency: // value for 'currency'
 *      description: // value for 'description'
 *      metadata: // value for 'metadata'
 *   },
 * });
 */
export function useCreatePaymentIntentMutation(baseOptions?: Apollo.MutationHookOptions<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>(CreatePaymentIntentDocument, options);
      }
export type CreatePaymentIntentMutationHookResult = ReturnType<typeof useCreatePaymentIntentMutation>;
export type CreatePaymentIntentMutationResult = Apollo.MutationResult<CreatePaymentIntentMutation>;
export type CreatePaymentIntentMutationOptions = Apollo.BaseMutationOptions<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>;
export const ConfirmPaymentDocument = gql`
    mutation ConfirmPayment($clientSecret: String!, $paymentMethodId: String!) {
  confirmPayment(clientSecret: $clientSecret, paymentMethodId: $paymentMethodId)
}
    `;
export type ConfirmPaymentMutationFn = Apollo.MutationFunction<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>;

/**
 * __useConfirmPaymentMutation__
 *
 * To run a mutation, you first call `useConfirmPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmPaymentMutation, { data, loading, error }] = useConfirmPaymentMutation({
 *   variables: {
 *      clientSecret: // value for 'clientSecret'
 *      paymentMethodId: // value for 'paymentMethodId'
 *   },
 * });
 */
export function useConfirmPaymentMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>(ConfirmPaymentDocument, options);
      }
export type ConfirmPaymentMutationHookResult = ReturnType<typeof useConfirmPaymentMutation>;
export type ConfirmPaymentMutationResult = Apollo.MutationResult<ConfirmPaymentMutation>;
export type ConfirmPaymentMutationOptions = Apollo.BaseMutationOptions<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>;
export const CreateStripeSubscriptionDocument = gql`
    mutation CreateStripeSubscription($priceId: String!) {
  createStripeSubscription(priceId: $priceId)
}
    `;
export type CreateStripeSubscriptionMutationFn = Apollo.MutationFunction<CreateStripeSubscriptionMutation, CreateStripeSubscriptionMutationVariables>;

/**
 * __useCreateStripeSubscriptionMutation__
 *
 * To run a mutation, you first call `useCreateStripeSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStripeSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStripeSubscriptionMutation, { data, loading, error }] = useCreateStripeSubscriptionMutation({
 *   variables: {
 *      priceId: // value for 'priceId'
 *   },
 * });
 */
export function useCreateStripeSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<CreateStripeSubscriptionMutation, CreateStripeSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStripeSubscriptionMutation, CreateStripeSubscriptionMutationVariables>(CreateStripeSubscriptionDocument, options);
      }
export type CreateStripeSubscriptionMutationHookResult = ReturnType<typeof useCreateStripeSubscriptionMutation>;
export type CreateStripeSubscriptionMutationResult = Apollo.MutationResult<CreateStripeSubscriptionMutation>;
export type CreateStripeSubscriptionMutationOptions = Apollo.BaseMutationOptions<CreateStripeSubscriptionMutation, CreateStripeSubscriptionMutationVariables>;
export const CancelSubscriptionDocument = gql`
    mutation CancelSubscription($subscriptionId: String!) {
  cancelSubscription(subscriptionId: $subscriptionId)
}
    `;
export type CancelSubscriptionMutationFn = Apollo.MutationFunction<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>;

/**
 * __useCancelSubscriptionMutation__
 *
 * To run a mutation, you first call `useCancelSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelSubscriptionMutation, { data, loading, error }] = useCancelSubscriptionMutation({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function useCancelSubscriptionMutation(baseOptions?: Apollo.MutationHookOptions<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>(CancelSubscriptionDocument, options);
      }
export type CancelSubscriptionMutationHookResult = ReturnType<typeof useCancelSubscriptionMutation>;
export type CancelSubscriptionMutationResult = Apollo.MutationResult<CancelSubscriptionMutation>;
export type CancelSubscriptionMutationOptions = Apollo.BaseMutationOptions<CancelSubscriptionMutation, CancelSubscriptionMutationVariables>;
export const GetPaymentIntentDocument = gql`
    query GetPaymentIntent($paymentIntentId: String!) {
  getPaymentIntent(paymentIntentId: $paymentIntentId)
}
    `;

/**
 * __useGetPaymentIntentQuery__
 *
 * To run a query within a React component, call `useGetPaymentIntentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentIntentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentIntentQuery({
 *   variables: {
 *      paymentIntentId: // value for 'paymentIntentId'
 *   },
 * });
 */
export function useGetPaymentIntentQuery(baseOptions: Apollo.QueryHookOptions<GetPaymentIntentQuery, GetPaymentIntentQueryVariables> & ({ variables: GetPaymentIntentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentIntentQuery, GetPaymentIntentQueryVariables>(GetPaymentIntentDocument, options);
      }
export function useGetPaymentIntentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentIntentQuery, GetPaymentIntentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentIntentQuery, GetPaymentIntentQueryVariables>(GetPaymentIntentDocument, options);
        }
export function useGetPaymentIntentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaymentIntentQuery, GetPaymentIntentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaymentIntentQuery, GetPaymentIntentQueryVariables>(GetPaymentIntentDocument, options);
        }
export type GetPaymentIntentQueryHookResult = ReturnType<typeof useGetPaymentIntentQuery>;
export type GetPaymentIntentLazyQueryHookResult = ReturnType<typeof useGetPaymentIntentLazyQuery>;
export type GetPaymentIntentSuspenseQueryHookResult = ReturnType<typeof useGetPaymentIntentSuspenseQuery>;
export type GetPaymentIntentQueryResult = Apollo.QueryResult<GetPaymentIntentQuery, GetPaymentIntentQueryVariables>;
export const GetUserStripeCustomerIdDocument = gql`
    query GetUserStripeCustomerId {
  getUserStripeCustomerId
}
    `;

/**
 * __useGetUserStripeCustomerIdQuery__
 *
 * To run a query within a React component, call `useGetUserStripeCustomerIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserStripeCustomerIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserStripeCustomerIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserStripeCustomerIdQuery(baseOptions?: Apollo.QueryHookOptions<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>(GetUserStripeCustomerIdDocument, options);
      }
export function useGetUserStripeCustomerIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>(GetUserStripeCustomerIdDocument, options);
        }
export function useGetUserStripeCustomerIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>(GetUserStripeCustomerIdDocument, options);
        }
export type GetUserStripeCustomerIdQueryHookResult = ReturnType<typeof useGetUserStripeCustomerIdQuery>;
export type GetUserStripeCustomerIdLazyQueryHookResult = ReturnType<typeof useGetUserStripeCustomerIdLazyQuery>;
export type GetUserStripeCustomerIdSuspenseQueryHookResult = ReturnType<typeof useGetUserStripeCustomerIdSuspenseQuery>;
export type GetUserStripeCustomerIdQueryResult = Apollo.QueryResult<GetUserStripeCustomerIdQuery, GetUserStripeCustomerIdQueryVariables>;
export const CreateReportByIdsDocument = gql`
    mutation CreateReportByIds($input: CreateReportInput!) {
  createReportByIds(input: $input) {
    id
    reason
    content
    createdAt
    user {
      id
      email
    }
    resource {
      id
      name
      user {
        id
        email
      }
    }
  }
}
    `;
export type CreateReportByIdsMutationFn = Apollo.MutationFunction<CreateReportByIdsMutation, CreateReportByIdsMutationVariables>;

/**
 * __useCreateReportByIdsMutation__
 *
 * To run a mutation, you first call `useCreateReportByIdsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReportByIdsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReportByIdsMutation, { data, loading, error }] = useCreateReportByIdsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReportByIdsMutation(baseOptions?: Apollo.MutationHookOptions<CreateReportByIdsMutation, CreateReportByIdsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReportByIdsMutation, CreateReportByIdsMutationVariables>(CreateReportByIdsDocument, options);
      }
export type CreateReportByIdsMutationHookResult = ReturnType<typeof useCreateReportByIdsMutation>;
export type CreateReportByIdsMutationResult = Apollo.MutationResult<CreateReportByIdsMutation>;
export type CreateReportByIdsMutationOptions = Apollo.BaseMutationOptions<CreateReportByIdsMutation, CreateReportByIdsMutationVariables>;
export const DeleteReportDocument = gql`
    mutation DeleteReport($reportToDelete: ReportInput!) {
  deleteReport(reportToDelete: $reportToDelete)
}
    `;
export type DeleteReportMutationFn = Apollo.MutationFunction<DeleteReportMutation, DeleteReportMutationVariables>;

/**
 * __useDeleteReportMutation__
 *
 * To run a mutation, you first call `useDeleteReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReportMutation, { data, loading, error }] = useDeleteReportMutation({
 *   variables: {
 *      reportToDelete: // value for 'reportToDelete'
 *   },
 * });
 */
export function useDeleteReportMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReportMutation, DeleteReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReportMutation, DeleteReportMutationVariables>(DeleteReportDocument, options);
      }
export type DeleteReportMutationHookResult = ReturnType<typeof useDeleteReportMutation>;
export type DeleteReportMutationResult = Apollo.MutationResult<DeleteReportMutation>;
export type DeleteReportMutationOptions = Apollo.BaseMutationOptions<DeleteReportMutation, DeleteReportMutationVariables>;
export const GetAllReportsDocument = gql`
    query GetAllReports {
  getAllReports {
    id
    reason
    content
    createdAt
    user {
      id
      email
    }
    resource {
      id
      name
      url
      user {
        id
        email
      }
    }
  }
}
    `;

/**
 * __useGetAllReportsQuery__
 *
 * To run a query within a React component, call `useGetAllReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllReportsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllReportsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllReportsQuery, GetAllReportsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllReportsQuery, GetAllReportsQueryVariables>(GetAllReportsDocument, options);
      }
export function useGetAllReportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllReportsQuery, GetAllReportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllReportsQuery, GetAllReportsQueryVariables>(GetAllReportsDocument, options);
        }
export function useGetAllReportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllReportsQuery, GetAllReportsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllReportsQuery, GetAllReportsQueryVariables>(GetAllReportsDocument, options);
        }
export type GetAllReportsQueryHookResult = ReturnType<typeof useGetAllReportsQuery>;
export type GetAllReportsLazyQueryHookResult = ReturnType<typeof useGetAllReportsLazyQuery>;
export type GetAllReportsSuspenseQueryHookResult = ReturnType<typeof useGetAllReportsSuspenseQuery>;
export type GetAllReportsQueryResult = Apollo.QueryResult<GetAllReportsQuery, GetAllReportsQueryVariables>;
export const GetReportsByUserDocument = gql`
    query GetReportsByUser($id: ID!) {
  getReportsByUser(id: $id) {
    id
    reason
    content
    createdAt
    user {
      id
      email
    }
    resource {
      id
      name
      url
      user {
        id
        email
      }
    }
  }
}
    `;

/**
 * __useGetReportsByUserQuery__
 *
 * To run a query within a React component, call `useGetReportsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportsByUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReportsByUserQuery(baseOptions: Apollo.QueryHookOptions<GetReportsByUserQuery, GetReportsByUserQueryVariables> & ({ variables: GetReportsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportsByUserQuery, GetReportsByUserQueryVariables>(GetReportsByUserDocument, options);
      }
export function useGetReportsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportsByUserQuery, GetReportsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportsByUserQuery, GetReportsByUserQueryVariables>(GetReportsByUserDocument, options);
        }
export function useGetReportsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportsByUserQuery, GetReportsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReportsByUserQuery, GetReportsByUserQueryVariables>(GetReportsByUserDocument, options);
        }
export type GetReportsByUserQueryHookResult = ReturnType<typeof useGetReportsByUserQuery>;
export type GetReportsByUserLazyQueryHookResult = ReturnType<typeof useGetReportsByUserLazyQuery>;
export type GetReportsByUserSuspenseQueryHookResult = ReturnType<typeof useGetReportsByUserSuspenseQuery>;
export type GetReportsByUserQueryResult = Apollo.QueryResult<GetReportsByUserQuery, GetReportsByUserQueryVariables>;
export const GetReportsByResourceDocument = gql`
    query GetReportsByResource($id: ID!) {
  getReportsByResource(id: $id) {
    id
    reason
    content
    createdAt
    user {
      id
      email
    }
    resource {
      id
      name
      url
      user {
        id
        email
      }
    }
  }
}
    `;

/**
 * __useGetReportsByResourceQuery__
 *
 * To run a query within a React component, call `useGetReportsByResourceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportsByResourceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportsByResourceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReportsByResourceQuery(baseOptions: Apollo.QueryHookOptions<GetReportsByResourceQuery, GetReportsByResourceQueryVariables> & ({ variables: GetReportsByResourceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportsByResourceQuery, GetReportsByResourceQueryVariables>(GetReportsByResourceDocument, options);
      }
export function useGetReportsByResourceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportsByResourceQuery, GetReportsByResourceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportsByResourceQuery, GetReportsByResourceQueryVariables>(GetReportsByResourceDocument, options);
        }
export function useGetReportsByResourceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportsByResourceQuery, GetReportsByResourceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReportsByResourceQuery, GetReportsByResourceQueryVariables>(GetReportsByResourceDocument, options);
        }
export type GetReportsByResourceQueryHookResult = ReturnType<typeof useGetReportsByResourceQuery>;
export type GetReportsByResourceLazyQueryHookResult = ReturnType<typeof useGetReportsByResourceLazyQuery>;
export type GetReportsByResourceSuspenseQueryHookResult = ReturnType<typeof useGetReportsByResourceSuspenseQuery>;
export type GetReportsByResourceQueryResult = Apollo.QueryResult<GetReportsByResourceQuery, GetReportsByResourceQueryVariables>;
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
export const UpdateResourceDescriptionDocument = gql`
    mutation UpdateResourceDescription($id: ID!, $description: String!) {
  updateResourceDescription(id: $id, description: $description) {
    id
    name
    description
    url
    path
  }
}
    `;
export type UpdateResourceDescriptionMutationFn = Apollo.MutationFunction<UpdateResourceDescriptionMutation, UpdateResourceDescriptionMutationVariables>;

/**
 * __useUpdateResourceDescriptionMutation__
 *
 * To run a mutation, you first call `useUpdateResourceDescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateResourceDescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateResourceDescriptionMutation, { data, loading, error }] = useUpdateResourceDescriptionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateResourceDescriptionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateResourceDescriptionMutation, UpdateResourceDescriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateResourceDescriptionMutation, UpdateResourceDescriptionMutationVariables>(UpdateResourceDescriptionDocument, options);
      }
export type UpdateResourceDescriptionMutationHookResult = ReturnType<typeof useUpdateResourceDescriptionMutation>;
export type UpdateResourceDescriptionMutationResult = Apollo.MutationResult<UpdateResourceDescriptionMutation>;
export type UpdateResourceDescriptionMutationOptions = Apollo.BaseMutationOptions<UpdateResourceDescriptionMutation, UpdateResourceDescriptionMutationVariables>;
export const GetAllResourcesDocument = gql`
    query GetAllResources {
  getAllResources {
    id
    name
    description
    path
    url
    size
    formattedSize
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
    size
    formattedSize
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
    size
    formattedSize
    user {
      id
      email
      createdAt
      profilePicture
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
export const GetUserTotalFileSizeDocument = gql`
    query GetUserTotalFileSize($userId: ID!) {
  getUserTotalFileSize(userId: $userId)
}
    `;

/**
 * __useGetUserTotalFileSizeQuery__
 *
 * To run a query within a React component, call `useGetUserTotalFileSizeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserTotalFileSizeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserTotalFileSizeQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserTotalFileSizeQuery(baseOptions: Apollo.QueryHookOptions<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables> & ({ variables: GetUserTotalFileSizeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables>(GetUserTotalFileSizeDocument, options);
      }
export function useGetUserTotalFileSizeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables>(GetUserTotalFileSizeDocument, options);
        }
export function useGetUserTotalFileSizeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables>(GetUserTotalFileSizeDocument, options);
        }
export type GetUserTotalFileSizeQueryHookResult = ReturnType<typeof useGetUserTotalFileSizeQuery>;
export type GetUserTotalFileSizeLazyQueryHookResult = ReturnType<typeof useGetUserTotalFileSizeLazyQuery>;
export type GetUserTotalFileSizeSuspenseQueryHookResult = ReturnType<typeof useGetUserTotalFileSizeSuspenseQuery>;
export type GetUserTotalFileSizeQueryResult = Apollo.QueryResult<GetUserTotalFileSizeQuery, GetUserTotalFileSizeQueryVariables>;
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
export const UpdateProfilePictureDocument = gql`
    mutation UpdateProfilePicture($data: UpdateProfilePictureInput!) {
  updateProfilePicture(data: $data) {
    id
    email
    profilePicture
  }
}
    `;
export type UpdateProfilePictureMutationFn = Apollo.MutationFunction<UpdateProfilePictureMutation, UpdateProfilePictureMutationVariables>;

/**
 * __useUpdateProfilePictureMutation__
 *
 * To run a mutation, you first call `useUpdateProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfilePictureMutation, { data, loading, error }] = useUpdateProfilePictureMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfilePictureMutation, UpdateProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfilePictureMutation, UpdateProfilePictureMutationVariables>(UpdateProfilePictureDocument, options);
      }
export type UpdateProfilePictureMutationHookResult = ReturnType<typeof useUpdateProfilePictureMutation>;
export type UpdateProfilePictureMutationResult = Apollo.MutationResult<UpdateProfilePictureMutation>;
export type UpdateProfilePictureMutationOptions = Apollo.BaseMutationOptions<UpdateProfilePictureMutation, UpdateProfilePictureMutationVariables>;
export const ResetPasswordSendCodeDocument = gql`
    mutation ResetPasswordSendCode($email: String!, $lang: String!) {
  resetPasswordSendCode(email: $email, lang: $lang)
}
    `;
export type ResetPasswordSendCodeMutationFn = Apollo.MutationFunction<ResetPasswordSendCodeMutation, ResetPasswordSendCodeMutationVariables>;

/**
 * __useResetPasswordSendCodeMutation__
 *
 * To run a mutation, you first call `useResetPasswordSendCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordSendCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordSendCodeMutation, { data, loading, error }] = useResetPasswordSendCodeMutation({
 *   variables: {
 *      email: // value for 'email'
 *      lang: // value for 'lang'
 *   },
 * });
 */
export function useResetPasswordSendCodeMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordSendCodeMutation, ResetPasswordSendCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordSendCodeMutation, ResetPasswordSendCodeMutationVariables>(ResetPasswordSendCodeDocument, options);
      }
export type ResetPasswordSendCodeMutationHookResult = ReturnType<typeof useResetPasswordSendCodeMutation>;
export type ResetPasswordSendCodeMutationResult = Apollo.MutationResult<ResetPasswordSendCodeMutation>;
export type ResetPasswordSendCodeMutationOptions = Apollo.BaseMutationOptions<ResetPasswordSendCodeMutation, ResetPasswordSendCodeMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
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
    profilePicture
    storage {
      bytesUsed
      percentage
    }
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
export const CheckUserExistsDocument = gql`
    query CheckUserExists($email: String!) {
  checkUserExists(email: $email)
}
    `;

/**
 * __useCheckUserExistsQuery__
 *
 * To run a query within a React component, call `useCheckUserExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUserExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUserExistsQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCheckUserExistsQuery(baseOptions: Apollo.QueryHookOptions<CheckUserExistsQuery, CheckUserExistsQueryVariables> & ({ variables: CheckUserExistsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckUserExistsQuery, CheckUserExistsQueryVariables>(CheckUserExistsDocument, options);
      }
export function useCheckUserExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckUserExistsQuery, CheckUserExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckUserExistsQuery, CheckUserExistsQueryVariables>(CheckUserExistsDocument, options);
        }
export function useCheckUserExistsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckUserExistsQuery, CheckUserExistsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckUserExistsQuery, CheckUserExistsQueryVariables>(CheckUserExistsDocument, options);
        }
export type CheckUserExistsQueryHookResult = ReturnType<typeof useCheckUserExistsQuery>;
export type CheckUserExistsLazyQueryHookResult = ReturnType<typeof useCheckUserExistsLazyQuery>;
export type CheckUserExistsSuspenseQueryHookResult = ReturnType<typeof useCheckUserExistsSuspenseQuery>;
export type CheckUserExistsQueryResult = Apollo.QueryResult<CheckUserExistsQuery, CheckUserExistsQueryVariables>;