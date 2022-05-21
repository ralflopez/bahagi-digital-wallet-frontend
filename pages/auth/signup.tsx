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

const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const Signup = () => {
  const router = useRouter()
  const [name, setName] = useState({ value: "", error: "" })
  const [email, setEmail] = useState({ value: "", error: "" })
  const [password, setPassword] = useState({ value: "", error: "" })
  const [country, setCountry] = useState({ value: "", error: "" })
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" })
  const [formError, setFormError] = useState("")

  const [signup, { loading, error, data }] = useMutation<
    SignUpMutation,
    SignUpMutationVariables
  >(SignUpDocument)

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length < 2) {
      setName({ value, error: "Name must be at least 2 characters" })
    } else {
      setName({ value, error: "" })
    }
  }

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

  const handleCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!value) {
      setCountry({ value, error: "Please select a country" })
    } else {
      setCountry({ value, error: "" })
    }
  }

  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length < 1 || value.length !== 10) {
      setPhoneNumber({ value: value, error: "Invalid phone number" })
    } else {
      setPhoneNumber({ value: value, error: "" })
    }
  }

  const handleSignup = () => {
    if (name.error || email.error || password.error || country.error) {
      setFormError("Please fill out all fields")
      return
    } else if (
      name.value.length < 1 ||
      email.value.length < 1 ||
      password.value.length < 1 ||
      country.value.length < 1
    ) {
      setFormError("Please fill out all fields")
      return
    }

    signup({
      variables: {
        signUpInput: {
          countryId: country.value,
          email: email.value,
          password: password.value,
          name: name.value,
          phoneNumber: phoneNumber.value,
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
        <FormControl isRequired mb='4' isInvalid={name.error !== ""}>
          <FormLabel htmlFor='name'>Name</FormLabel>
          <Input
            id='name'
            type='name'
            value={name.value}
            onChange={handleName}
            onBlur={handleName}
          />
          {name.error !== "" && (
            <FormErrorMessage>{name.error}</FormErrorMessage>
          )}
        </FormControl>
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
        <FormControl isRequired mb='4' isInvalid={country.error !== ""}>
          <FormLabel htmlFor='country'>Country</FormLabel>
          <Select
            id='country'
            placeholder='Select country'
            onChange={handleCountry}
            onBlur={handleCountry}
          >
            <option value='ph'>Philippines</option>
          </Select>
          {country.error !== "" && (
            <FormErrorMessage>{country.error}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired mb='4' isInvalid={password.error !== ""}>
          <FormLabel htmlFor='phone-number'>Phone Number</FormLabel>
          <Input
            id='phone-number'
            type='text'
            value={phoneNumber.value}
            onChange={handlePhoneNumber}
            onBlur={handlePhoneNumber}
          />
          {phoneNumber.error !== "" && (
            <FormErrorMessage>{phoneNumber.error}</FormErrorMessage>
          )}
        </FormControl>
        <Link href='/auth/login' color='green.500'>
          I already have an account
        </Link>
        <Button
          colorScheme='green'
          mt='4'
          display='block'
          onClick={handleSignup}
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
