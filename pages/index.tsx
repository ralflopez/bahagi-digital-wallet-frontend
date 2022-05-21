import { Flex } from "@chakra-ui/react"
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next"
import { createContext, useEffect, useState } from "react"
import { CashInModal, CashOutModal } from "../components/Modals"
import { MainActions } from "../components/MainActions"
import { Total } from "../components/Summary/Total"
import {
  Currency,
  MyUserQuery,
  TotalBalanceDocument,
  TotalBalanceQuery,
} from "../graphql/generated/graphql"
import { withUser } from "../helpers/hof/withUser"
import { useLazyQuery } from "@apollo/client"

interface Props {
  currency: Currency
  initTotal: number
}

interface IHomeContext {
  currency: Currency
  refresh: () => void
}

export const HomeContext = createContext<IHomeContext>({
  currency: { id: "", name: "", symbol: "" },
  refresh: () => {},
})

const Home: NextPage<Props> = ({ currency, initTotal }) => {
  const [getTotalBalance, { data: balanceData }] =
    useLazyQuery<TotalBalanceQuery>(TotalBalanceDocument, {
      fetchPolicy: "network-only",
    })
  const [cashInModal, setCashInModal] = useState(false)

  useEffect(() => {
    getTotalBalance()
  }, [getTotalBalance])

  const toggleCashInModal = () => {
    setCashInModal((s) => !s)
  }

  const refresh = () => {
    getTotalBalance()
  }

  return (
    <HomeContext.Provider
      value={{
        currency,
        refresh,
      }}
    >
      <CashInModal open={cashInModal} toggle={toggleCashInModal} />
      <Flex
        bg='gray.100'
        height='100vh'
        justifyContent='center'
        alignItems='center'
      >
        <Flex direction='column' alignItems='center'>
          <Total
            total={`${currency.symbol || ""}${
              balanceData?.totalBalance || "0.00"
            }`}
          />
          <MainActions toggleCashInModal={toggleCashInModal} />
        </Flex>
      </Flex>
    </HomeContext.Provider>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = withUser(
  async (
    _: GetServerSidePropsContext,
    myUser: MyUserQuery["myUser"] | null
  ) => {
    return {
      props: {
        currency: myUser?.country.currency,
      } as Props,
    }
  }
)
