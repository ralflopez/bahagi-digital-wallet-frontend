import { Text } from "@chakra-ui/react"
import React from "react"

interface Props {
  total: string
}

export const Total = ({ total }: Props) => {
  return (
    <Text fontSize='xxx-large' mb='8' fontWeight='bold' color='whiteAlpha.300s'>
      {total}
    </Text>
  )
}
