import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import cookie from "cookie"
import nookies from "nookies"

export const client = new ApolloClient({
  link: createHttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      "http://localhost:4000/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
})

export const clientSSR = (context: any) => {
  const KEY = "connect.sid"
  const cookies = nookies.get(context)
  const sessionId = cookies[KEY]

  return new ApolloClient({
    link: createHttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      credentials: "include",
      headers: {
        Cookie: cookie.serialize(KEY, sessionId),
      },
    }),
    cache: new InMemoryCache(),
    ssrMode: true,
  })
}
