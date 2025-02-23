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
  Select,
  Flex,
  Textarea,
  RadioGroup,
  Checkbox,
  Radio,
  Card,
  CardBody,
  Tag,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";
CreateExamForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
const AccessCode = Math.floor(100000 + Math.random() * 900000);

export default function CreateExamForm({ isOpen, onClose }) {
  const toast = useToast();
  const [QuestionSet, SetQuestionSet] = useState([]);
  const [ExamName, SetExamName] = useState("");
  const [Questions, SetQuestions] = useState([]);
  const {fullname, user_assigned_subject} = useUserStore(state => state.user)
  const [Subject, SetSubject] = useState(
    user_assigned_subject !== "none"
      ? user_assigned_subject
      : "Math"
  );

  const data = {
    exam_name: ExamName,
    subject: Subject,
    access_code: AccessCode,
    questions: QuestionSet,
    created_by: fullname,
  };

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
      .get(`http://localhost:8080/api/ExamRoute.php?action=getAllQuestion&subject=${user_assigned_subject}`)
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
          <Select
            mb={4}
            value={Subject}
            onChange={(e) => SetSubject(e.target.value)}
          >
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
    axios
      .post("http://localhost:8080/api/ExamRoute.php?action=create", data)
      .then((response) => {
        console.log(response.data);

        toast({
          title: "Exam Created!",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        onClose();
      });
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(Questions.map((q) => q.category))];

  const filteredQuestions =
    selectedCategory === "All"
      ? Questions
      : Questions.filter((q) => q.category === selectedCategory);

  return (
    <Modal
      scrollBehavior="inside"
      onClose={onClose}
      size="6xl"
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>EXAM BUILDER {AccessCode}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid templateColumns="1fr 1fr" gap={4}>
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
                          mr={1}
                          onClick={() => moveItem(index, -1)}
                          isDisabled={index === 0}
                        >
                          <Icon as={TbArrowUp} />
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => moveItem(index, 1)}
                          isDisabled={index === QuestionSet.length - 1}
                        >
                          <Icon as={TbArrowDown} />
                        </Button>
                      </Flex>
                      {renderFormElement(item.options, item.category)}
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
            <Stack>
              <Heading size="md">Exam Info</Heading>
                <Text fontWeight="semibold">EXAM NAME</Text>
                <Input
                  type="text"
                  mb={4}
                  value={ExamName}
                  onChange={(e) => SetExamName(e.currentTarget.value)}
                />
                <Text fontWeight="semibold">SUBJECT</Text>
                {UserSubject()}
              <Flex direction="row" justifyContent="space-between">
                <Heading size="md" mb={4}>
                  Question Bank
                </Heading>
                <Text>{Questions.length}</Text>
              </Flex>
              <Stack spacing={4} overflow="auto">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  mb={4}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>

                <Stack spacing={4} overflow="auto">
                  {filteredQuestions.map((item) => (
                    <Flex direction="row" key={item.id}>
                      <Checkbox
                        key={item.id}
                        mr={4}
                        onChange={() => handleCheckboxChange(item.id)}
                        isChecked={QuestionSet.some((q) => q.id === item.id)}
                      />
                      <Text fontWeight="semibold">{item.question}</Text>
                      <Tag ml="auto" size="sm">
                        {item.category}
                      </Tag>
                    </Flex>
                  ))}
                </Stack>
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
