import { useMutation } from "@apollo/client"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import React, { useContext } from "react"
import { serializeError } from "serialize-error"
import {
  CashInDocument,
  CashInMutation,
  CashInMutationVariables,
  CreatePaymongoPaymentIntentDocument,
  CreatePaymongoPaymentIntentMutation,
  CreatePaymongoPaymentIntentMutationVariables,
  FundTransferStatus,
  UpdateCashInStatusDocument,
  UpdateCashInStatusMutation,
  UpdateCashInStatusMutationVariables,
} from "../../graphql/generated/graphql"
import { paymongo } from "../../lib/paymongo"
import { HomeContext } from "../../pages"

interface Props {
  open: boolean
  toggle: () => void
}

const validate = (values: any) => {
  const errors: any = {}

  if (!values.cc) {
    errors.cc = "Required"
  } else if (values.cc.length !== 16) {
    errors.cc = "Must be 16 digits"
  }

  if (!values.expMonth) {
    errors.expMonth = "Required"
  } else if (values.expMonth.length !== 2) {
    errors.expMonth = "Must be 2 digits"
  } else if (values.expMonth < 1 || values.expMonth > 12) {
    errors.expMonth = "Must be between 1 and 12"
  }

  if (!values.expYear) {
    errors.expYear = "Required"
  } else if (values.expYear.length !== 2) {
    errors.expYear = "Must be 2 digits"
  } else if (values.expYear < 22) {
    errors.expYear = "Must be after 2022"
  }

  if (!values.cvc) {
    errors.cvc = "Required"
  } else if (values.cvc.length !== 3) {
    errors.cvc = "Must be 3 digits"
  }

  if (values.amount < 1) {
    errors.amount = "Must be greater than 0"
  }

  return errors
}

export const CashInModal = ({ open, toggle }: Props) => {
  const homeContext = useContext(HomeContext)
  const toast = useToast()

  const [createPaymentIntent, { loading, error, data }] = useMutation<
    CreatePaymongoPaymentIntentMutation,
    CreatePaymongoPaymentIntentMutationVariables
  >(CreatePaymongoPaymentIntentDocument)
  const [udpateCashInStatus] = useMutation<
    UpdateCashInStatusMutation,
    UpdateCashInStatusMutationVariables
  >(UpdateCashInStatusDocument)
  const [cashIn] = useMutation<CashInMutation, CashInMutationVariables>(
    CashInDocument
  )

  const formik = useFormik({
    initialValues: {
      cc: "5455590000000009",
      expMonth: "05",
      expYear: "25",
      cvc: "123",
      amount: 0,
    },
    validateOnMount: false,
    validate,
    onSubmit: async ({ amount, cc, cvc, expMonth, expYear }) => {
      try {
        // create payment intent
        const { data } = await createPaymentIntent({
          variables: {
            paymentIntentInput: {
              amount: Number(amount),
            },
          },
        })
        if (!data) {
          toast({
            title: "Paymongo Error",
            description: "Failed to request payment",
            status: "error",
            duration: 4000,
            isClosable: true,
          })
          return
        }

        const clientKey = data.createPaymongoPaymentIntent.clientKey
        const paymentIntentId = clientKey.split("_client")[0]

        // make payment method
        const paymentMethodResult = await paymongo.paymentMethods.create({
          data: {
            attributes: {
              type: "card",
              details: {
                card_number: cc,
                exp_month: Number(expMonth),
                exp_year: Number(expYear),
                cvc: cvc,
              },
            },
          },
        })
        const paymentMethodId = paymentMethodResult.data.id

        const cashInResult = await cashIn({
          variables: {
            cashInInput: {
              amount: Number(amount),
              currencyId: "PHP",
              paymentIntentId: paymentIntentId,
              paymentServiceId: "paymongo-paymongo-debit-credit",
            },
          },
        })
        if (!cashInResult.data) {
          toast({
            title: "Service Error",
            description: "Failed to request payment",
            status: "error",
            duration: 4000,
            isClosable: true,
          })
          return
        }
        const cashInId = cashInResult.data.cashIn.id

        // attach payment intent
        const response = await paymongo.paymentIntents.attach(paymentIntentId, {
          data: {
            attributes: {
              client_key: clientKey,
              payment_method: paymentMethodId,
            },
          },
        })

        var paymentIntent = response.data
        var paymentIntentStatus = paymentIntent.attributes.status

        if (paymentIntentStatus === "awaiting_next_action") {
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
          toast({
            title: "Paymongo",
            description: "Awaiting next action",
            status: "loading",
            duration: 4000,
            isClosable: true,
          })
        } else if (paymentIntentStatus === "succeeded") {
          // You already received your customer's payment. You can show a success message from this condition.
          await udpateCashInStatus({
            variables: {
              updateExternalFundTransferStatusInput: {
                id: cashInId,
                status: FundTransferStatus.Success,
              },
            },
          })
          toast({
            title: "Cash In Success",
            description: "Successful cash in",
            status: "success",
            duration: 4000,
            isClosable: true,
          })
        } else if (paymentIntentStatus === "awaiting_payment_method") {
          // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
          toast({
            title: "Paymongo",
            description: "Awaiting payment method",
            status: "loading",
            duration: 4000,
            isClosable: true,
          })
        } else if (paymentIntentStatus === "processing") {
          // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
          toast({
            title: "Paymongo",
            description: "Processing",
            status: "loading",
            duration: 4000,
            isClosable: true,
          })
        }
      } catch (e: any) {
        toast({
          title: "Cash in failed",
          description: serializeError(e.message),
          status: "error",
          duration: 4000,
          isClosable: true,
        })
        console.error(e)
      }

      formik.resetForm()
      homeContext.refresh()
    },
  })

  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <form onSubmit={formik.handleSubmit}>
        <ModalContent>
          <ModalHeader>Cash In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isRequired
              mb='4'
              isInvalid={Boolean(formik.errors.amount)}
            >
              <FormLabel htmlFor='cc'>Amount</FormLabel>
              <Input
                id='amount'
                type='text'
                name='amount'
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.amount && (
                <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb='4'
              isInvalid={Boolean(formik.errors.cc)}
            >
              <FormLabel htmlFor='cc'>Credit Card Number</FormLabel>
              <Input
                id='cc'
                type='text'
                name='cc'
                value={formik.values.cc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.cc && (
                <FormErrorMessage>{formik.errors.cc}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb='4'
              isInvalid={Boolean(formik.errors.expMonth)}
            >
              <FormLabel htmlFor='cc'>Month Expiry</FormLabel>
              <Input
                id='month-exp'
                type='text'
                name='expMonth'
                value={formik.values.expMonth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.expMonth && (
                <FormErrorMessage>{formik.errors.expMonth}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb='4'
              isInvalid={Boolean(formik.errors.expYear)}
            >
              <FormLabel htmlFor='cc'>Year Expiry</FormLabel>
              <Input
                id='year-exp'
                type='text'
                name='expYear'
                value={formik.values.expYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.expYear && (
                <FormErrorMessage>{formik.errors.expYear}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              mb='4'
              isInvalid={Boolean(formik.errors.cvc)}
            >
              <FormLabel htmlFor='cc'>CVC</FormLabel>
              <Input
                id='cvc'
                type='text'
                name='cvc'
                value={formik.values.cvc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.cvc && (
                <FormErrorMessage>{formik.errors.cvc}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={toggle} type='submit'>
              Cash In
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  )
}
