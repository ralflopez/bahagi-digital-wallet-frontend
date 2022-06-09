import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { ApolloProvider } from "@apollo/client"
import { client } from "../graphql/client"
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>E-Wallet</title>
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
