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
import { SendMoneyModal } from "../components/Modals/SendMoneyModal"

interface Props {
  user: MyUserQuery["myUser"]
}

interface IHomeContext {
  user: MyUserQuery["myUser"]
  currency: Currency
  refresh: () => void
  totalBalance: number
}

export const HomeContext = createContext<IHomeContext>({
  user: {} as MyUserQuery["myUser"],
  currency: {} as Currency,
  refresh: () => {},
  totalBalance: 0,
})

const Home: NextPage<Props> = ({ user }) => {
  const currency = user.country.currency
  const [getTotalBalance, { data: balanceData }] =
    useLazyQuery<TotalBalanceQuery>(TotalBalanceDocument, {
      fetchPolicy: "network-only",
    })
  const [cashInModal, setCashInModal] = useState(false)
  const [cashOutModal, setCashOutModal] = useState(false)
  const [sendMoneyModal, setSendMoneyModal] = useState(false)

  useEffect(() => {
    getTotalBalance()
  }, [getTotalBalance])

  const toggleCashInModal = () => {
    setCashInModal((s) => !s)
  }

  const toggleCashOutModal = () => {
    setCashOutModal((s) => !s)
  }

  const toggleSendMoneyModal = () => {
    setSendMoneyModal((s) => !s)
  }

  const refresh = () => {
    getTotalBalance()
  }

  return (
    <HomeContext.Provider
      value={{
        user,
        currency,
        refresh,
        totalBalance: balanceData?.totalBalance || 0,
      }}
    >
      <CashInModal open={cashInModal} toggle={toggleCashInModal} />
      <CashOutModal open={cashOutModal} toggle={toggleCashOutModal} />
      <SendMoneyModal open={sendMoneyModal} toggle={toggleSendMoneyModal} />
      <Flex
        bg='green.300'
        height='100vh'
        justifyContent='center'
        alignItems='center'
      >
        <Flex direction='column' alignItems='center'>
          <Total
            total={`${currency.symbol || ""}${
              balanceData?.totalBalance
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0.00"
            }`}
          />
          <MainActions
            toggleCashInModal={toggleCashInModal}
            toggleCashOutModal={toggleCashOutModal}
            toggleSendMoneyModal={toggleSendMoneyModal}
          />
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
    return myUser
      ? {
          props: {
            user: myUser,
          } as Props,
        }
      : {
          props: {},
          redirect: {
            destination: "/auth/login",
          },
        }
  }
)
