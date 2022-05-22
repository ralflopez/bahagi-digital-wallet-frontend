import { useLazyQuery, useMutation } from "@apollo/client"
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
  SendMoneyDocument,
  SendMoneyMutation,
  SendMoneyMutationVariables,
  UserDocument,
  UserQuery,
  UserQueryVariables,
} from "../../graphql/generated/graphql"
import { HomeContext } from "../../pages"

interface Props {
  open: boolean
  toggle: () => void
}

export const SendMoneyModal = ({ open, toggle }: Props) => {
  const homeContext = useContext(HomeContext)
  const toast = useToast()

  const [queryUser] = useLazyQuery<UserQuery, UserQueryVariables>(UserDocument)
  const [sendMoney] = useMutation<
    SendMoneyMutation,
    SendMoneyMutationVariables
  >(SendMoneyDocument)

  const validate = async (values: any) => {
    const errors: any = {}

    if (
      values.receiverId === homeContext.user.id ||
      values.receiverId === homeContext.user.email
    ) {
      errors.receiverId = "You can't send money to yourself"
    }

    const { error } = await queryUser({
      variables: {
        userId: values.receiverId,
      },
    })

    if (error) {
      errors.receiverId = "User not found"
    }

    if (values.amount < 1) {
      errors.amount = "Must be greater than 0"
    } else if (values.amount < 100) {
      errors.amount = "Must be greater than or equal 100"
    } else if (values.amount > homeContext.totalBalance) {
      errors.amount = "Must be less than your total balance"
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      amount: 100,
      receiverId: "demo2@email.com",
    },
    validateOnMount: false,
    validate,
    onSubmit: async (values) => {
      const { data: userData, error: userError } = await queryUser({
        variables: {
          userId: values.receiverId,
        },
      })

      if (userError) {
        toast({
          title: "Send Money",
          description: userError?.message || "User not found",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      }

      if (userData) {
        const { data, errors } = await sendMoney({
          variables: {
            sendMoneyInput: {
              amount: values.amount,
              currencyId: homeContext.currency.id,
              receiverId: userData.user.id,
            },
          },
        })

        if (errors) {
          toast({
            title: "Send Money",
            description: errors[0].message,
            status: "error",
            duration: 4000,
            isClosable: true,
          })
        }

        if (data) {
          toast({
            title: "Send Money",
            description: "Money sent successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
          })
        }
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
              isInvalid={Boolean(formik.errors.receiverId)}
            >
              <FormLabel htmlFor='cc'>Receiver Email / Id</FormLabel>
              <Input
                id='receiver-id'
                type='text'
                name='receiverId'
                value={formik.values.receiverId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.receiverId && (
                <FormErrorMessage>{formik.errors.receiverId}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} type='submit'>
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  )
}
