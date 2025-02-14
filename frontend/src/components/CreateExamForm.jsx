import {
  Button,
  Stack,
  Radio,
  RadioGroup,
  Select,
  Flex,
  Text,
  Textarea,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { POST_QUESTION_URL } from "../helper/endpoints";

import PropTypes from "prop-types";
CreateExamForm.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired
};

export default function CreateExamForm({isOpen, onClose}) {
  const [SelectedOption, SetSelectedOption] = useState("Identification");
  const [MultipleChoices, SetMultipleChoices] = useState([]);
  const [EnumerationText, SetEnumerationText] = useState("");
  const [Question, SetQuestion] = useState("")
  const toast = useToast();

  const data = {
    question: Question,
    options: MultipleChoices,
    answer: MultipleChoices.find(item => item.is_correct === true),
    category: SelectedOption,
    created_by: localStorage.getItem("userfullname"),
    subject: localStorage.getItem("usersubject")
  }

  return (
    <Modal onClose={onClose} size="6xl" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Exam</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={4}>Close</Button>
            <Button onClick={onClose} colorScheme="green">Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}
