import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type CashInInput = {
  amount: Scalars['Float'];
  currencyId: Scalars['String'];
  paymentIntentId: Scalars['String'];
  paymentServiceId: Scalars['String'];
};

export type CashOutInput = {
  amount: Scalars['Float'];
  currencyId: Scalars['String'];
  paymentServiceId: Scalars['String'];
};

export type Country = {
  __typename?: 'Country';
  currency: Currency;
  id: Scalars['ID'];
  mobileCode: Scalars['String'];
  name: Scalars['String'];
};

export type CreateCountryInput = {
  /** ID from currency schema */
  currencyId: Scalars['String'];
  id: Scalars['String'];
  /** Countrys area code (e.g. +63 for Philippines) */
  mobileCode: Scalars['String'];
  name: Scalars['String'];
};

export type CreateCurrencyInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type CreateInternalFundTransfer = {
  amount: Scalars['Float'];
  currencyId: Scalars['String'];
  receiverId: Scalars['String'];
  senderId: Scalars['String'];
};

export type CreatePaymentServiceInput = {
  base_fee?: InputMaybe<Scalars['Float']>;
  company: Scalars['String'];
  method: PaymentServiceMethod;
  minimum_fee: Scalars['Float'];
  name: Scalars['String'];
  percent_fee: Scalars['Float'];
  type: PaymentServiceType;
};

export type Currency = {
  __typename?: 'Currency';
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type ExternalFundTransfer = {
  __typename?: 'ExternalFundTransfer';
  details: FundTransfer;
  id: Scalars['ID'];
  method: ExternalFundTransferMethod;
  user: User;
};

export enum ExternalFundTransferMethod {
  CashIn = 'CASH_IN',
  CashOut = 'CASH_OUT'
}

export type FundTransfer = {
  __typename?: 'FundTransfer';
  amount: Scalars['Float'];
  currency: Currency;
  fee: Scalars['Float'];
  id: Scalars['ID'];
  status: FundTransferStatus;
};

export enum FundTransferStatus {
  Failed = 'FAILED',
  Processing = 'PROCESSING',
  Success = 'SUCCESS'
}

export type InternalFundTransfer = {
  __typename?: 'InternalFundTransfer';
  details: FundTransfer;
  id: Scalars['ID'];
  receiver: User;
  sender: User;
};

/** Required arguments to log in the user */
export type LogInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Creates a record for incoming user funds from external source (e.g credit card).
   *
   * * Status will be set to PROCESSING.
   */
  cashIn: ExternalFundTransfer;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Creates a record for outgoing user funds.
   *
   * * Status will be set to PROCESSING.
   */
  cashOut: ExternalFundTransfer;
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Creates a new country.
   */
  createCountry: Country;
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Creates a new currency.
   */
  createCurrency: Currency;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Creates a record for a fund transfer between two users.
   */
  createInternalFundTransfer: InternalFundTransfer;
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Creates a new payment service.
   */
  createPaymentService: PaymentService;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Calls paymongo api to create a payment intent (tells paymongo that you are expecting a payment).
   */
  createPaymongoPaymentIntent: PaymentIntentResult;
  /**
   * #### Description
   *
   * Logs in the user using session authentication.
   *
   * #### Example
   *
   * ```
   *     {
   *       email: "demo@email.com",
   *       password: "password"
   *     }
   */
  logIn: User;
  /**
   * #### Description
   *
   * Clears out Session for logged in user.
   */
  logOut: Scalars['String'];
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Deletes a country.
   */
  removeCountry: Scalars['Int'];
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Deletes a country.
   */
  removeCurrency: Scalars['Int'];
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Deletes a cash in / cash out record.
   */
  removeExternalFundTransfer: Scalars['Int'];
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Deletes a payment service.
   */
  removePaymentService: Scalars['Int'];
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Deltes a user.
   */
  removeUser: Scalars['String'];
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Sends money from the logged in user to another user
   */
  sendMoney: InternalFundTransfer;
  /**
   * #### Description
   *
   * Creates and logs in the user using session authentication.
   *
   * #### Example
   *
   * ```
   *     {
   *       email: "newUser@email.com",
   *       name: "name"
   *       password: "password",
   *       phoneNumber: "+639271234567",
   *       countryId: "ph'
   *     }
   */
  signUp: User;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Updates the cashIn status.
   */
  updateCashInStatus: ExternalFundTransfer;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Updaates the cashOut status.
   */
  updateCashOutStatus: ExternalFundTransfer;
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Updates user information.
   */
  updateUser: User;
};


export type MutationCashInArgs = {
  cashInInput: CashInInput;
};


export type MutationCashOutArgs = {
  cashOutInput: CashOutInput;
};


export type MutationCreateCountryArgs = {
  createCountryInput: CreateCountryInput;
};


export type MutationCreateCurrencyArgs = {
  createCurrencyInput: CreateCurrencyInput;
};


export type MutationCreateInternalFundTransferArgs = {
  createInternalFundTransferInput: CreateInternalFundTransfer;
};


export type MutationCreatePaymentServiceArgs = {
  createPaymentGatewayInput: CreatePaymentServiceInput;
};


export type MutationCreatePaymongoPaymentIntentArgs = {
  paymentIntentInput: PaymentIntentInput;
};


export type MutationLogInArgs = {
  logIninput: LogInInput;
};


export type MutationRemoveCountryArgs = {
  id: Scalars['String'];
};


export type MutationRemoveCurrencyArgs = {
  id: Scalars['String'];
};


export type MutationRemoveExternalFundTransferArgs = {
  id: Scalars['String'];
};


export type MutationRemovePaymentServiceArgs = {
  id: Scalars['String'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String'];
};


export type MutationSendMoneyArgs = {
  sendMoneyInput: SendMoneyInput;
};


export type MutationSignUpArgs = {
  signUpInput: SignUpInput;
};


export type MutationUpdateCashInStatusArgs = {
  updateExternalFundTransferStatusInput: UpdateExternalFundTransferStatusInput;
};


export type MutationUpdateCashOutStatusArgs = {
  updateExternalFundTransferStatusInput: UpdateExternalFundTransferStatusInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type PaymentIntentInput = {
  /** Amount should be in full currencies (e.g Pesos instead of cents) */
  amount: Scalars['Float'];
};

export type PaymentIntentResult = {
  __typename?: 'PaymentIntentResult';
  clientKey: Scalars['String'];
};

export type PaymentService = {
  __typename?: 'PaymentService';
  base_fee: Scalars['Float'];
  company: Scalars['String'];
  id: Scalars['ID'];
  method: PaymentServiceMethod;
  minimum_fee: Scalars['Float'];
  name: Scalars['String'];
  percent_fee: Scalars['Float'];
  type: PaymentServiceType;
};

export enum PaymentServiceMethod {
  Any = 'ANY',
  CashIn = 'CASH_IN',
  CashOut = 'CASH_OUT'
}

export enum PaymentServiceType {
  Bank = 'BANK',
  Otc = 'OTC',
  Service = 'SERVICE'
}

export type Query = {
  __typename?: 'Query';
  /**
   * #### Description
   *
   * Returns a list of available countries.
   */
  countries: Array<Country>;
  /**
   * #### Description
   *
   * Returns a country given its ID.
   */
  country: Country;
  /**
   * #### Description
   *
   * Returns a list of available currencies.
   */
  currencies: Array<Currency>;
  /**
   * #### Description
   *     Returns a currency given its ID
   */
  currency: Currency;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Returns a cash in / cash out record given an ID.
   */
  externalFundTransfer: ExternalFundTransfer;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Returns a list of all the cash in and cash out transactions.
   */
  externalFundTransfers: Array<ExternalFundTransfer>;
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Returns all the internal fund transfer records
   */
  internalFundTransfers: Array<InternalFundTransfer>;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Returns the current logged in user.
   */
  myUser: User;
  /**
   * #### Description
   *
   * Retuns a payment service given an ID.
   */
  paymentService: PaymentService;
  /**
   * #### Description
   *
   * Returns all available payment services.
   */
  paymentServices: Array<PaymentService>;
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Returns the total balance of the logged in user.
   */
  totalBalance: Scalars['Float'];
  /**
   * #### Description
   *
   * * _Requires authentication_
   *
   * * Returns a user given an ID / email.
   */
  user: User;
  /**
   * #### Description
   *
   * * _Requires admin privileges_
   *
   * * Returns all user.
   */
  users: Array<User>;
};


export type QueryCountryArgs = {
  id: Scalars['String'];
};


export type QueryCurrencyArgs = {
  id: Scalars['String'];
};


export type QueryExternalFundTransferArgs = {
  id: Scalars['String'];
};


export type QueryPaymentServiceArgs = {
  id: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SendMoneyInput = {
  amount: Scalars['Float'];
  currencyId: Scalars['String'];
  receiverId: Scalars['String'];
};

/** Required arguments to create a new user */
export type SignUpInput = {
  /** ID from the country schema */
  countryId: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type UpdateExternalFundTransferStatusInput = {
  id: Scalars['String'];
  status: FundTransferStatus;
};

export type UpdateUserInput = {
  /** ID from the country schema */
  countryId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  country: Country;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  role: Role;
};

export type CashInMutationVariables = Exact<{
  cashInInput: CashInInput;
}>;


export type CashInMutation = { __typename?: 'Mutation', cashIn: { __typename?: 'ExternalFundTransfer', id: string } };

export type CashOutMutationVariables = Exact<{
  cashOutInput: CashOutInput;
}>;


export type CashOutMutation = { __typename?: 'Mutation', cashOut: { __typename?: 'ExternalFundTransfer', id: string, details: { __typename?: 'FundTransfer', amount: number } } };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', countries: Array<{ __typename?: 'Country', id: string, name: string, mobileCode: string, currency: { __typename?: 'Currency', id: string, name: string, symbol: string } }> };

export type CreatePaymongoPaymentIntentMutationVariables = Exact<{
  paymentIntentInput: PaymentIntentInput;
}>;


export type CreatePaymongoPaymentIntentMutation = { __typename?: 'Mutation', createPaymongoPaymentIntent: { __typename?: 'PaymentIntentResult', clientKey: string } };

export type LogInMutationVariables = Exact<{
  logIninput: LogInInput;
}>;


export type LogInMutation = { __typename?: 'Mutation', logIn: { __typename?: 'User', id: string, email: string, name: string, role: Role } };

export type LogOutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogOutMutation = { __typename?: 'Mutation', logOut: string };

export type MyUserQueryVariables = Exact<{ [key: string]: never; }>;


export type MyUserQuery = { __typename?: 'Query', myUser: { __typename?: 'User', id: string, name: string, email: string, role: Role, country: { __typename?: 'Country', id: string, name: string, currency: { __typename?: 'Currency', id: string, name: string, symbol: string } } } };

export type SendMoneyMutationVariables = Exact<{
  sendMoneyInput: SendMoneyInput;
}>;


export type SendMoneyMutation = { __typename?: 'Mutation', sendMoney: { __typename?: 'InternalFundTransfer', id: string, details: { __typename?: 'FundTransfer', amount: number, currency: { __typename?: 'Currency', id: string, name: string, symbol: string } }, receiver: { __typename?: 'User', id: string, email: string }, sender: { __typename?: 'User', id: string, email: string } } };

export type SignUpMutationVariables = Exact<{
  signUpInput: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'User', id: string, name: string, email: string, role: Role } };

export type TotalBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type TotalBalanceQuery = { __typename?: 'Query', totalBalance: number };

export type UpdateCashInStatusMutationVariables = Exact<{
  updateExternalFundTransferStatusInput: UpdateExternalFundTransferStatusInput;
}>;


export type UpdateCashInStatusMutation = { __typename?: 'Mutation', updateCashInStatus: { __typename?: 'ExternalFundTransfer', id: string, details: { __typename?: 'FundTransfer', status: FundTransferStatus } } };

export type UserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, name: string } };


export const CashInDocument = gql`
    mutation CashIn($cashInInput: CashInInput!) {
  cashIn(cashInInput: $cashInInput) {
    id
  }
}
    `;
export type CashInMutationFn = Apollo.MutationFunction<CashInMutation, CashInMutationVariables>;

/**
 * __useCashInMutation__
 *
 * To run a mutation, you first call `useCashInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCashInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cashInMutation, { data, loading, error }] = useCashInMutation({
 *   variables: {
 *      cashInInput: // value for 'cashInInput'
 *   },
 * });
 */
export function useCashInMutation(baseOptions?: Apollo.MutationHookOptions<CashInMutation, CashInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CashInMutation, CashInMutationVariables>(CashInDocument, options);
      }
export type CashInMutationHookResult = ReturnType<typeof useCashInMutation>;
export type CashInMutationResult = Apollo.MutationResult<CashInMutation>;
export type CashInMutationOptions = Apollo.BaseMutationOptions<CashInMutation, CashInMutationVariables>;
export const CashOutDocument = gql`
    mutation CashOut($cashOutInput: CashOutInput!) {
  cashOut(cashOutInput: $cashOutInput) {
    id
    details {
      amount
    }
  }
}
    `;
export type CashOutMutationFn = Apollo.MutationFunction<CashOutMutation, CashOutMutationVariables>;

/**
 * __useCashOutMutation__
 *
 * To run a mutation, you first call `useCashOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCashOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cashOutMutation, { data, loading, error }] = useCashOutMutation({
 *   variables: {
 *      cashOutInput: // value for 'cashOutInput'
 *   },
 * });
 */
export function useCashOutMutation(baseOptions?: Apollo.MutationHookOptions<CashOutMutation, CashOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CashOutMutation, CashOutMutationVariables>(CashOutDocument, options);
      }
export type CashOutMutationHookResult = ReturnType<typeof useCashOutMutation>;
export type CashOutMutationResult = Apollo.MutationResult<CashOutMutation>;
export type CashOutMutationOptions = Apollo.BaseMutationOptions<CashOutMutation, CashOutMutationVariables>;
export const CountriesDocument = gql`
    query Countries {
  countries {
    id
    name
    mobileCode
    currency {
      id
      name
      symbol
    }
  }
}
    `;

/**
 * __useCountriesQuery__
 *
 * To run a query within a React component, call `useCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCountriesQuery(baseOptions?: Apollo.QueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, options);
      }
export function useCountriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CountriesQuery, CountriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, options);
        }
export type CountriesQueryHookResult = ReturnType<typeof useCountriesQuery>;
export type CountriesLazyQueryHookResult = ReturnType<typeof useCountriesLazyQuery>;
export type CountriesQueryResult = Apollo.QueryResult<CountriesQuery, CountriesQueryVariables>;
export const CreatePaymongoPaymentIntentDocument = gql`
    mutation CreatePaymongoPaymentIntent($paymentIntentInput: PaymentIntentInput!) {
  createPaymongoPaymentIntent(paymentIntentInput: $paymentIntentInput) {
    clientKey
  }
}
    `;
export type CreatePaymongoPaymentIntentMutationFn = Apollo.MutationFunction<CreatePaymongoPaymentIntentMutation, CreatePaymongoPaymentIntentMutationVariables>;

/**
 * __useCreatePaymongoPaymentIntentMutation__
 *
 * To run a mutation, you first call `useCreatePaymongoPaymentIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymongoPaymentIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymongoPaymentIntentMutation, { data, loading, error }] = useCreatePaymongoPaymentIntentMutation({
 *   variables: {
 *      paymentIntentInput: // value for 'paymentIntentInput'
 *   },
 * });
 */
export function useCreatePaymongoPaymentIntentMutation(baseOptions?: Apollo.MutationHookOptions<CreatePaymongoPaymentIntentMutation, CreatePaymongoPaymentIntentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePaymongoPaymentIntentMutation, CreatePaymongoPaymentIntentMutationVariables>(CreatePaymongoPaymentIntentDocument, options);
      }
export type CreatePaymongoPaymentIntentMutationHookResult = ReturnType<typeof useCreatePaymongoPaymentIntentMutation>;
export type CreatePaymongoPaymentIntentMutationResult = Apollo.MutationResult<CreatePaymongoPaymentIntentMutation>;
export type CreatePaymongoPaymentIntentMutationOptions = Apollo.BaseMutationOptions<CreatePaymongoPaymentIntentMutation, CreatePaymongoPaymentIntentMutationVariables>;
export const LogInDocument = gql`
    mutation LogIn($logIninput: LogInInput!) {
  logIn(logIninput: $logIninput) {
    id
    email
    name
    role
  }
}
    `;
export type LogInMutationFn = Apollo.MutationFunction<LogInMutation, LogInMutationVariables>;

/**
 * __useLogInMutation__
 *
 * To run a mutation, you first call `useLogInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInMutation, { data, loading, error }] = useLogInMutation({
 *   variables: {
 *      logIninput: // value for 'logIninput'
 *   },
 * });
 */
export function useLogInMutation(baseOptions?: Apollo.MutationHookOptions<LogInMutation, LogInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogInMutation, LogInMutationVariables>(LogInDocument, options);
      }
export type LogInMutationHookResult = ReturnType<typeof useLogInMutation>;
export type LogInMutationResult = Apollo.MutationResult<LogInMutation>;
export type LogInMutationOptions = Apollo.BaseMutationOptions<LogInMutation, LogInMutationVariables>;
export const LogOutDocument = gql`
    mutation LogOut {
  logOut
}
    `;
export type LogOutMutationFn = Apollo.MutationFunction<LogOutMutation, LogOutMutationVariables>;

/**
 * __useLogOutMutation__
 *
 * To run a mutation, you first call `useLogOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logOutMutation, { data, loading, error }] = useLogOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogOutMutation(baseOptions?: Apollo.MutationHookOptions<LogOutMutation, LogOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogOutMutation, LogOutMutationVariables>(LogOutDocument, options);
      }
export type LogOutMutationHookResult = ReturnType<typeof useLogOutMutation>;
export type LogOutMutationResult = Apollo.MutationResult<LogOutMutation>;
export type LogOutMutationOptions = Apollo.BaseMutationOptions<LogOutMutation, LogOutMutationVariables>;
export const MyUserDocument = gql`
    query MyUser {
  myUser {
    id
    name
    email
    role
    country {
      id
      name
      currency {
        id
        name
        symbol
      }
    }
  }
}
    `;

/**
 * __useMyUserQuery__
 *
 * To run a query within a React component, call `useMyUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyUserQuery(baseOptions?: Apollo.QueryHookOptions<MyUserQuery, MyUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyUserQuery, MyUserQueryVariables>(MyUserDocument, options);
      }
export function useMyUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyUserQuery, MyUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyUserQuery, MyUserQueryVariables>(MyUserDocument, options);
        }
export type MyUserQueryHookResult = ReturnType<typeof useMyUserQuery>;
export type MyUserLazyQueryHookResult = ReturnType<typeof useMyUserLazyQuery>;
export type MyUserQueryResult = Apollo.QueryResult<MyUserQuery, MyUserQueryVariables>;
export const SendMoneyDocument = gql`
    mutation SendMoney($sendMoneyInput: SendMoneyInput!) {
  sendMoney(sendMoneyInput: $sendMoneyInput) {
    id
    details {
      amount
      currency {
        id
        name
        symbol
      }
    }
    receiver {
      id
      email
    }
    sender {
      id
      email
    }
  }
}
    `;
export type SendMoneyMutationFn = Apollo.MutationFunction<SendMoneyMutation, SendMoneyMutationVariables>;

/**
 * __useSendMoneyMutation__
 *
 * To run a mutation, you first call `useSendMoneyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMoneyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMoneyMutation, { data, loading, error }] = useSendMoneyMutation({
 *   variables: {
 *      sendMoneyInput: // value for 'sendMoneyInput'
 *   },
 * });
 */
export function useSendMoneyMutation(baseOptions?: Apollo.MutationHookOptions<SendMoneyMutation, SendMoneyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMoneyMutation, SendMoneyMutationVariables>(SendMoneyDocument, options);
      }
export type SendMoneyMutationHookResult = ReturnType<typeof useSendMoneyMutation>;
export type SendMoneyMutationResult = Apollo.MutationResult<SendMoneyMutation>;
export type SendMoneyMutationOptions = Apollo.BaseMutationOptions<SendMoneyMutation, SendMoneyMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($signUpInput: SignUpInput!) {
  signUp(signUpInput: $signUpInput) {
    id
    name
    email
    role
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      signUpInput: // value for 'signUpInput'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const TotalBalanceDocument = gql`
    query TotalBalance {
  totalBalance
}
    `;

/**
 * __useTotalBalanceQuery__
 *
 * To run a query within a React component, call `useTotalBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTotalBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTotalBalanceQuery({
 *   variables: {
 *   },
 * });
 */
export function useTotalBalanceQuery(baseOptions?: Apollo.QueryHookOptions<TotalBalanceQuery, TotalBalanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TotalBalanceQuery, TotalBalanceQueryVariables>(TotalBalanceDocument, options);
      }
export function useTotalBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TotalBalanceQuery, TotalBalanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TotalBalanceQuery, TotalBalanceQueryVariables>(TotalBalanceDocument, options);
        }
export type TotalBalanceQueryHookResult = ReturnType<typeof useTotalBalanceQuery>;
export type TotalBalanceLazyQueryHookResult = ReturnType<typeof useTotalBalanceLazyQuery>;
export type TotalBalanceQueryResult = Apollo.QueryResult<TotalBalanceQuery, TotalBalanceQueryVariables>;
export const UpdateCashInStatusDocument = gql`
    mutation UpdateCashInStatus($updateExternalFundTransferStatusInput: UpdateExternalFundTransferStatusInput!) {
  updateCashInStatus(
    updateExternalFundTransferStatusInput: $updateExternalFundTransferStatusInput
  ) {
    details {
      status
    }
    id
  }
}
    `;
export type UpdateCashInStatusMutationFn = Apollo.MutationFunction<UpdateCashInStatusMutation, UpdateCashInStatusMutationVariables>;

/**
 * __useUpdateCashInStatusMutation__
 *
 * To run a mutation, you first call `useUpdateCashInStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCashInStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCashInStatusMutation, { data, loading, error }] = useUpdateCashInStatusMutation({
 *   variables: {
 *      updateExternalFundTransferStatusInput: // value for 'updateExternalFundTransferStatusInput'
 *   },
 * });
 */
export function useUpdateCashInStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCashInStatusMutation, UpdateCashInStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCashInStatusMutation, UpdateCashInStatusMutationVariables>(UpdateCashInStatusDocument, options);
      }
export type UpdateCashInStatusMutationHookResult = ReturnType<typeof useUpdateCashInStatusMutation>;
export type UpdateCashInStatusMutationResult = Apollo.MutationResult<UpdateCashInStatusMutation>;
export type UpdateCashInStatusMutationOptions = Apollo.BaseMutationOptions<UpdateCashInStatusMutation, UpdateCashInStatusMutationVariables>;
export const UserDocument = gql`
    query User($userId: String!) {
  user(id: $userId) {
    id
    email
    name
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;