import { GetServerSidePropsContext } from "next"
import { MyUserDocument, MyUserQuery } from "../../graphql/generated/graphql"
import { clientSSR } from "../../graphql/client"

export const withUser = (callback: Function) => {
  return async (context: GetServerSidePropsContext) => {
    try {
      const client = clientSSR(context)
      const { data } = await client.query<MyUserQuery>({
        query: MyUserDocument,
      })
      return callback(data.myUser)
    } catch (e) {
      return callback(null)
    }
  }
}
