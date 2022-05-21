import {
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Text,
  useQuery,
} from "@chakra-ui/react"
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons"
import { useState } from "react"
import { CashInModal } from "../components/Modals"
import { MainActions } from "../components/MainActions"
import { Total } from "../components/Summary/Total"
import {
  Currency,
  MyUserDocument,
  MyUserQuery,
  MyUserQueryResult,
  TotalBalanceDocument,
  TotalBalanceQuery,
} from "../graphql/generated/graphql"
import { withUser } from "../helpers/hof/withUser"
import { clientSSR } from "../graphql/client"

interface Props {
  currency: Currency
  initTotal: number
}

const Home: NextPage<Props> = ({ currency, initTotal }) => {
  const [total, setTotal] = useState(initTotal)
  const [cashInModal, setCashInModal] = useState(false)

  const toggleCashInModal = () => {
    setCashInModal((s) => !s)
  }

  return (
    <>
      <CashInModal open={cashInModal} toggle={toggleCashInModal} />
      <Flex
        bg='gray.100'
        height='100vh'
        justifyContent='center'
        alignItems='center'
      >
        <Flex direction='column' alignItems='center'>
          <Total total={`${currency.symbol || ""}${total}`} />
          <MainActions toggleCashInModal={toggleCashInModal} />
        </Flex>
      </Flex>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = withUser(
  async (
    context: GetServerSidePropsContext,
    myUser: MyUserQuery["myUser"] | null
  ) => {
    const client = clientSSR(context)
    const { data } = await client.query<TotalBalanceQuery>({
      query: TotalBalanceDocument,
    })
    return {
      props: {
        currency: myUser?.country.currency,
        initTotal: data.totalBalance || 0,
      } as Props,
    }
  }
)
