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
  LogInDocument,
  LogInMutation,
  LogInMutationVariables,
  MyUserQuery,
  SignUpDocument,
  SignUpMutation,
  SignUpMutationVariables,
} from "../../graphql/generated/graphql"
import { useRouter } from "next/router"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { withUser } from "../../helpers/hof/withUser"

const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState({ value: "demo@email.com", error: "" })
  const [password, setPassword] = useState({ value: "password", error: "" })
  const [formError, setFormError] = useState("")

  const [login, { loading, error, data }] = useMutation<
    LogInMutation,
    LogInMutationVariables
  >(LogInDocument)

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (validateEmail(value)) {
      setEmail({ value, error: "" })
    } else {
      setEmail({ value, error: "Email is invalid" })
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length < 8) {
      setPassword({ value, error: "Password must be at least 8 characters" })
    } else {
      setPassword({ value, error: "" })
    }
  }

  const handleLogin = () => {
    if (email.error || password.error) {
      setFormError("Please fill out all fields")
      return
    } else if (email.value.length < 1 || password.value.length < 1) {
      setFormError("Please fill out all fields")
      return
    }

    login({
      variables: {
        logIninput: {
          email: email.value,
          password: password.value,
        },
      },
    })
  }

  if (loading) return <div>Loading...</div>
  if (error) {
    setFormError(error.message)
  }
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
        {formError.length > 0 && (
          <Alert status='error' mb='4' rounded='lg'>
            <AlertIcon />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <Text fontSize='xx-large' fontWeight='bold' mb='4'>
          Sign Up
        </Text>
        <Divider mb='4' />
        <FormControl isRequired mb='4' isInvalid={email.error !== ""}>
          <FormLabel htmlFor='email'>Email address</FormLabel>
          <Input
            id='email'
            type='email'
            value={email.value}
            onChange={handleEmail}
            onBlur={handleEmail}
          />
          {email.error !== "" && (
            <FormErrorMessage>{email.error}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired mb='4' isInvalid={password.error !== ""}>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input
            id='password'
            type='password'
            value={password.value}
            onChange={handlePassword}
            onBlur={handlePassword}
          />
          {password.error !== "" && (
            <FormErrorMessage>{password.error}</FormErrorMessage>
          )}
        </FormControl>
        <Link href='/auth/signup' color='green.500'>
          Create an account
        </Link>
        <Button
          colorScheme='green'
          mt='4'
          display='block'
          onClick={handleLogin}
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
