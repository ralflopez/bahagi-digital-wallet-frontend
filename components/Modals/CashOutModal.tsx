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
import {
  CashOutDocument,
  CashOutMutation,
  CashOutMutationVariables,
} from "../../graphql/generated/graphql"
import { HomeContext } from "../../pages"

interface Props {
  open: boolean
  toggle: () => void
}

export const CashOutModal = ({ open, toggle }: Props) => {
  const homeContext = useContext(HomeContext)
  const toast = useToast()

  const [cashOut] = useMutation<CashOutMutation, CashOutMutationVariables>(
    CashOutDocument
  )

  const validate = (values: any) => {
    const errors: any = {}

    if (values.accountNumber.length !== 11) {
      errors.accountNumber = "Enter 11 digit number"
    }

    if (values.amount < 1) {
      errors.amount = "Must be greater than 0"
    } else if (values.amount < 100) {
      errors.amount = "Must be greater than 100"
    } else if (values.amount > homeContext.totalBalance) {
      errors.amount = "Must be less than your total balance"
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      accountNumber: "09271234567",
      amount: 100,
    },
    validateOnMount: false,
    validate,
    onSubmit: async (values) => {
      const { errors, data } = await cashOut({
        variables: {
          cashOutInput: {
            amount: values.amount,
            currencyId: homeContext.currency.id,
            paymentServiceId: "globe-gcash",
          },
        },
      })

      if (errors) {
        toast({
          title: "Cash Out",
          description: errors[0].message,
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      }

      if (data) {
        toast({
          title: "Cash Out",
          description: "Cash out order placed. It will be processed soon",
          status: "info",
          duration: 4000,
          isClosable: true,
        })
      }

      homeContext.refresh()
      toggle()
    },
  })

  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <form onSubmit={formik.handleSubmit}>
        <ModalContent>
          <ModalHeader>Cash Out</ModalHeader>
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
              isInvalid={Boolean(formik.errors.accountNumber)}
            >
              <FormLabel htmlFor='cc'>Gcash Account Number</FormLabel>
              <Input
                id='account-number'
                type='text'
                name='accountNumber'
                value={formik.values.accountNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.accountNumber && (
                <FormErrorMessage>
                  {formik.errors.accountNumber}
                </FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} type='submit'>
              Cash Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  )
}
