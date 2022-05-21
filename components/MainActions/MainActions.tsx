import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons"
import { Button, Stack } from "@chakra-ui/react"
import React from "react"

interface Props {
  toggleCashInModal: () => void
  toggleCashOutModal: () => void
}

export const MainActions = ({
  toggleCashInModal,
  toggleCashOutModal,
}: Props) => {
  return (
    <Stack
      direction={{
        base: "column",
        md: "row",
      }}
    >
      <Button colorScheme='green' onClick={toggleCashInModal}>
        <ArrowRightIcon mr='3' /> Cash In
      </Button>
      <Button colorScheme='green' onClick={toggleCashOutModal}>
        <ArrowLeftIcon mr='3' /> Cash Out
      </Button>
      <Button colorScheme='green'>
        <ChevronUpIcon mr='3' /> Send Money
      </Button>
      <Button colorScheme='green'>
        <ChevronDownIcon mr='3' /> Receive Money
      </Button>
    </Stack>
  )
}
