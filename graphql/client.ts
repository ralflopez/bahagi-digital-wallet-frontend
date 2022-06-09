import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import cookie from "cookie"
import nookies from "nookies"

export const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.GRAPHQL_URL || "http://localhost:4000/graphql",
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
      uri: "http://localhost:4000/graphql",
      credentials: "include",
      headers: {
        Cookie: cookie.serialize(KEY, sessionId),
      },
    }),
    cache: new InMemoryCache(),
    ssrMode: true,
  })
}
