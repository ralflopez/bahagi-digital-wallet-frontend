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
import React from "react"

interface Props {
  open: boolean
  toggle: () => void
}

export const CashInModal = ({ open, toggle }: Props) => {
  return (
    <Modal isOpen={open} onClose={toggle}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Hello</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={toggle}>
            Close
          </Button>
          <Button variant='ghost'>Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
