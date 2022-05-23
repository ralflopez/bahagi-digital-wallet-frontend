import { Box, Button, Container, Flex, Image, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"

const Home = () => {
  const router = useRouter()

  return (
    <Box py={{ base: "0", lg: "4" }} minH='100vh'>
      <Container
        p='8'
        py='12'
        rounded='xl'
        bg='white'
        maxW='container.lg'
        display='flex'
        flexDirection='column'
        alignItems='center'
        border='1px'
        borderColor='gray.100'
      >
        <Flex direction='column' alignItems='center' mb='12'>
          <Text
            textColor='gray.800'
            fontWeight='bold'
            fontSize={{
              base: "4xl",
              sm: "5xl",
              md: "6xl",
            }}
            textAlign='center'
            mb='4'
          >
            E wallet with{" "}
            <Text
              as='span'
              bg='green.400'
              display={{ base: "block", md: "inline" }}
              px='4'
              rounded='lg'
            >
              0 headaches
            </Text>
          </Text>
          <Text
            textColor='gray.700'
            fontSize={{
              base: "lg",
              md: "xl",
            }}
            mb='4'
            textAlign={{ base: "center", md: "left" }}
          >
            We make banking straight forward for everyone
          </Text>
          <Button
            colorScheme='green'
            onClick={() => {
              router.push("/wallet")
            }}
          >
            Visit your wallet {">"}
          </Button>
        </Flex>
        <Flex>
          <Image
            mr='4'
            w={{
              base: "44",
              md: "56",
            }}
            rounded='3xl'
            src='https://images.pexels.com/photos/6353664/pexels-photo-6353664.jpeg'
            alt='man holding phone and credit card'
          />
          <Image
            display={{ base: "none", sm: "block" }}
            w={{
              base: "44",
              md: "56",
            }}
            rounded='3xl'
            src='https://images.pexels.com/photos/6634181/pexels-photo-6634181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='man holding phone and credit card'
          />
        </Flex>
      </Container>
    </Box>
  )
}

export default Home
