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
  Text,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import React from "react"

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
  const formik = useFormik({
    initialValues: {
      cc: "",
      expMonth: "",
      expYear: "",
      cvc: "",
      amount: 0,
    },
    validateOnMount: false,
    validate,
    onSubmit: (values) => {
      console.log(values)
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
