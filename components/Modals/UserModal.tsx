import { useMutation } from "@apollo/client"
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import Router, { useRouter } from "next/router"
import React, { useContext } from "react"
import { LogOutDocument, LogOutMutation } from "../../graphql/generated/graphql"
import { HomeContext } from "../../pages/wallet"

interface Props {
  open: boolean
  toggle: () => void
}

export const UserModal = ({ open, toggle }: Props) => {
  const router = useRouter()
  const { user } = useContext(HomeContext)

  const [logout] = useMutation<LogOutMutation>(LogOutDocument)

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Country: {user.country.name}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='gray' mr='3' onClick={handleLogout}>
            Log out
          </Button>
          <Button colorScheme='green' onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
