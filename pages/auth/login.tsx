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
  Text,
  FormErrorMessage,
  Link,
} from "@chakra-ui/react"
import React from "react"
import { useMutation } from "@apollo/client"
import {
  LogInDocument,
  LogInMutation,
  LogInMutationVariables,
  MyUserQuery,
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

const Login = () => {
  const router = useRouter()

  const [login, { loading, error, data }] = useMutation<
    LogInMutation,
    LogInMutationVariables
  >(LogInDocument)

  const formik = useFormik({
    initialValues: {
      email: "demo@email.com",
      password: "password",
    },
    validate: (values) => {
      const errors: any = {}
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
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      login({
        variables: {
          logIninput: {
            email: values.email,
            password: values.password,
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
          Log in
        </Text>
        <Divider mb='4' />
        <FormControl isRequired mb='4' isInvalid={Boolean(formik.errors.email)}>
          <FormLabel htmlFor='email'>Email address</FormLabel>
          <Input
            id='email'
            type='email'
            name='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email !== "" && (
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isRequired
          mb='4'
          isInvalid={Boolean(formik.errors.password)}
        >
          <FormLabel htmlFor='email'>Password</FormLabel>
          <Input
            id='password'
            type='password'
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password !== "" && (
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          )}
        </FormControl>
        <Link href='/auth/signup' color='green.500'>
          Create an account
        </Link>
        <Button
          colorScheme='green'
          mt='4'
          display='block'
          onClick={formik.handleSubmit as any}
        >
          Log in
        </Button>
      </Box>
    </Container>
  )
}

export default Login

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
