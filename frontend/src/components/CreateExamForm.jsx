import {
  Button,
  Stack,
  Text,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Heading,
  SimpleGrid,
  Divider,
  Select,
  Flex,
  Textarea,
  RadioGroup,
  Checkbox,
  Radio,
  Card,
  CardBody,
  Tag,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
CreateExamForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
const AccessCode = Math.floor(100000 + Math.random() * 900000);

export default function CreateExamForm({ isOpen, onClose }) {
  const toast = useToast();
  const [QuestionSet, SetQuestionSet] = useState([]);
  const [ExamName, SetExamName] = useState("")
  const [Questions, SetQuestions] = useState([]);
  const [Subject, SetSubject] = useState(localStorage.getItem("usersubject") !== "none" ? localStorage.getItem("usersubject") : "Math")

  const data = {
    exam_name : ExamName,
    subject : Subject,
    access_code : AccessCode,
    questions: QuestionSet,
    created_by : localStorage.getItem("userfullname")
  }

  const handleCheckboxChange = (id) => {
    SetQuestionSet((prevItems) => {
      const isAlreadySelected = prevItems.some((item) => item.id === id);

      if (isAlreadySelected) {
        return prevItems.filter((item) => item.id !== id);
      } else {
        return [...prevItems, Questions.find((q) => q.id === id)];
      }
    });
  };

  const renderFormElement = (options, category) => {
    switch (category) {
      case "Identification": {
        return (
          <Input size="sm" value={JSON.parse(options)[0].option} readOnly />
        );
      }
      case "Enumeration": {
        const TextAreaValue = JSON.parse(options)
          .map((item) => item.option)
          .join("\n");

        return (
          <Textarea
            size="sm"
            value={TextAreaValue}
            placeholder="Enter answers"
            isReadOnly={true}
          />
        );
      }
      case "True/False": {
        return (
          <RadioGroup>
            <Stack spacing={4}>
              {JSON.parse(options).map((option) => (
                <Radio key={option.id} isChecked={option.is_correct}>
                  {option.option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      }

      case "Multiple":
        return (
          <RadioGroup>
            <Stack spacing={4}>
              {JSON.parse(options).map((option) => (
                <Flex
                  key={option.id}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Radio isChecked={option.is_correct} />
                  <Input size="sm" type="text" value={option.option} readOnly />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/ExamRoute.php?action=getAllQuestion&subject=${localStorage.getItem(
          "usersubject"
        )}`
      )
      .then((response) => {
        SetQuestions(response.data);
      });
  }, []);

  const UserSubject = () => {
    switch (localStorage.getItem("usertype")) {
      case "Instructor":
        return (
          <Input
            type="text"
            value={localStorage.getItem("usersubject")}
            isReadOnly
            mb={4}
          />
        );
      default:
        return (
          <Select mb={4} value={Subject} onChange={(e) => SetSubject(e.target.value)}>
            <option>Programming Language II</option>
            <option>Math</option>
            <option>Computer Programming</option>
          </Select>
        );
    }
  };

  const moveItem = (index, direction) => {
    SetQuestionSet((prevItems) => {
      const newItems = [...prevItems];

      const newIndex = index + direction;

      if (newIndex < 0 || newIndex >= newItems.length) return prevItems;

      [newItems[index], newItems[newIndex]] = [
        newItems[newIndex],
        newItems[index],
      ];

      return newItems;
    });
  };

  const HandleCreateExam = () => {
    axios.post('http://localhost:8080/api/ExamRoute.php?action=create', data)
      .then(response => {
        console.log(response.data)

        toast({
          title: "Exam Created!",
          description: response.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })

        onClose()
      })
  }

  return (
    <Modal  scrollBehavior="inside" onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight="bold">EXAM BUILDER</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid templateColumns="20% 1fr 40%" gap={4}>
            <Stack>
              <Heading size="md">Exam Info</Heading>
              <Divider />
              <Text fontWeight="semibold">Exam Name</Text>
              <Input type="text" mb={4} value={ExamName} onChange={(e) => SetExamName(e.currentTarget.value)} />
              <Text fontWeight="semibold">Subject</Text>
              {UserSubject()}
              <Text fontWeight="semibold">Access Code</Text>
              <Input type="text" mb={4} isReadOnly value={AccessCode} />
            </Stack>
            <Stack>
              <Stack backgroundColor="#e2e2e2" p={4}>
                {QuestionSet.map((item, index) => (
                  <Card key={item.id}>
                    <CardBody>
                      <Stack spacing={4}>
                        <Flex direction="row">
                          <Text fontWeight="semibold" mr="auto">
                            {index + 1}. {item.question}
                          </Text>
                          <Button
                            size="xs"
                            mr={4}
                            onClick={() => moveItem(index, -1)}
                            isDisabled={index === 0}
                          >
                            Move Up
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => moveItem(index, 1)}
                            isDisabled={index === QuestionSet.length - 1}
                          >
                            Move Down
                          </Button>
                        </Flex>
                        {renderFormElement(item.options, item.category)}
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </Stack>
            <Stack>
              <Flex direction="row" justifyContent="space-between">
                <Heading size="md" mb={4}>Question Bank</Heading>
                <Text>{Questions.length}</Text>
              </Flex>
              <Stack spacing={4} overflow="auto">
                {Questions.map((item) => (
                  <Flex direction="row" key={item.id}>
                    <Checkbox
                    key={item.id}
                    mr={4}
                    onChange={() => handleCheckboxChange(item.id)}
                    isChecked={QuestionSet.some((q) => q.id === item.id)} />
                    <Text fontWeight="semibold">{item.question}</Text>
                    <Tag ml="auto" size="sm">{item.category}</Tag>
                  </Flex>
                  
                ))}
              </Stack>
            </Stack>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={4}>
            Close
          </Button>
          <Button onClick={HandleCreateExam} colorScheme="green">
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
