import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  FormErrorMessage,
  Link,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { useMutation } from "@apollo/client"
import {
  MyUserQuery,
  SignUpDocument,
  SignUpMutation,
  SignUpMutationVariables,
} from "../../graphql/generated/graphql"
import { useRouter } from "next/router"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { withUser } from "../../helpers/hof/withUser"
import { useFormik } from "formik"

const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const validate = (values: any) => {
  const errors: any = {}

  if (!values.name) {
    errors.name = "Required"
  } else if (values.name.length < 2) {
    errors.name = "Must be at least 2 characters"
  }

  if (!values.email) {
    errors.email = "Required"
  } else if (!validateEmail(values.email)) {
    errors.email = "Invalid email"
  }

  if (!values.password) {
    errors.password = "Required"
  } else if (values.password.length < 8) {
    errors.password = "Must be at least 8 characters"
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = "Required"
  } else if (values.phoneNumber.length != 11) {
    errors.phoneNumber = "Must be 11 digits"
  }

  if (!values.country) {
    errors.country = "Required"
  }

  return errors
}

const Signup = () => {
  const router = useRouter()

  const [signup, { loading, error, data }] = useMutation<
    SignUpMutation,
    SignUpMutationVariables
  >(SignUpDocument)

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      country: "",
      phoneNumber: "",
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      signup({
        variables: {
          signUpInput: {
            countryId: values.country,
            email: values.country,
            password: values.password,
            name: values.name,
            phoneNumber: values.phoneNumber,
          },
        },
      })
    },
  })

  if (loading) return <div>Loading...</div>
  if (data) {
    router.replace("/")
    return
  }

  return (
    <Container>
      <Box
        as='form'
        m='4'
        p='8'
        border='1px'
        rounded='lg'
        borderColor='gray.300'
      >
        {error && (
          <Alert status='error' mb='4' rounded='lg'>
            <AlertIcon />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <Text fontSize='xx-large' fontWeight='bold' mb='4'>
          Sign Up
        </Text>
        <Divider mb='4' />
        <FormControl isRequired mb='4' isInvalid={Boolean(formik.errors.name)}>
          <FormLabel htmlFor='name'>Name</FormLabel>
          <Input
            id='name'
            type='text'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && (
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired mb='4' isInvalid={Boolean(formik.errors.email)}>
          <FormLabel htmlFor='name'>Email</FormLabel>
          <Input
            id='email'
            type='email'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && (
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isRequired
          mb='4'
          isInvalid={Boolean(formik.errors.password)}
        >
          <FormLabel htmlFor='name'>Password</FormLabel>
          <Input
            id='password'
            type='password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && (
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isRequired
          mb='4'
          isInvalid={Boolean(formik.errors.phoneNumber)}
        >
          <FormLabel htmlFor='name'>Phone Number</FormLabel>
          <Input
            id='phone-number'
            type='text'
            name='phoneNumber'
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.phoneNumber && (
            <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isRequired
          mb='4'
          isInvalid={Boolean(formik.errors.country)}
        >
          <FormLabel htmlFor='country'>Country</FormLabel>
          <Select
            id='country'
            placeholder='Select country'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value='ph'>Philippines</option>
          </Select>
          {formik.errors.country && (
            <FormErrorMessage>{formik.errors.country}</FormErrorMessage>
          )}
        </FormControl>
        <Link href='/auth/login' color='green.500'>
          I already have an account
        </Link>
        <Button
          colorScheme='green'
          mt='4'
          display='block'
          onClick={formik.handleSubmit as any}
        >
          Sign Up
        </Button>
      </Box>
    </Container>
  )
}

export default Signup

export const getServerSideProps: GetServerSideProps = withUser(
  async (
    _: GetServerSidePropsContext,
    myUser: MyUserQuery["myUser"] | null
  ) => {
    return myUser
      ? { props: {}, redirect: { destination: "/" } }
      : { props: { user: myUser } }
  }
)
