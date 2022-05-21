import { Box, Button, Container, Flex, Stack, Text } from "@chakra-ui/react"
import type { NextPage } from "next"
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

const Home: NextPage = () => {
  const [total, setTotal] = useState("P20.00")
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
          <Total total={total} />
        </Flex>
      </Flex>
    </>
  )
}

export default Home
