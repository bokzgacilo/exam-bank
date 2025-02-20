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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
CreateQuestionForm.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired
};

export default function CreateQuestionForm({isOpen, onClose}) {
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

  const HandleCreate = () => {
    axios.post("http://localhost:8080/api/QuestionRoute.php?action=create", data)
      .then(response => {
        if(response.data){
          toast({
            title: "Question Created!",
            description: `Question: ${Question} successfully created`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          })

          onClose()
        }else {
          console.log(response.data)
        }
      })
  }

  useEffect(() => {
    updateMultipleChoices("Identification");
  },[])

  const updateMultipleChoices = (type) => {
    switch (type) {
      case "Identification":
        SetMultipleChoices([{ id: 1, option: "", is_correct: true }]);
        break;
      case "True/False":
        SetMultipleChoices([
          { id: 1, option: "True", is_correct: false },
          { id: 2, option: "False", is_correct: false }
        ]);
        break;
      case "Enumeration":
        SetMultipleChoices([]);
        break;
      case "Multiple":
        SetMultipleChoices([
          { id: 1, option: "Option 1", is_correct: false },
          { id: 2, option: "Option 2", is_correct: false },
          { id: 3, option: "Option 3", is_correct: false },
          { id: 4, option: "Option 4", is_correct: false }
        ]);
        break;
      default:
        SetMultipleChoices([]);
    }
  };

  const handleChangeOption = (e) => {
    const type = e.target.value;
    SetSelectedOption(type);
    updateMultipleChoices(type);
  };

  const handleRadioChange = (selectedId) => {
    SetMultipleChoices(MultipleChoices.map(option => ({
      ...option,
      is_correct: option.id === selectedId
    })));
  };

  const handleInputChange = (id, newValue) => {
    SetMultipleChoices(MultipleChoices.map(option => ({
      ...option,
      option: option.id === id ? newValue : option.option
    })));
  };

  const handleEnumerationChange = (e) => {
    const values = e.target.value.split('\n').filter(val => val.trim() !== "");
    SetEnumerationText(e.target.value);
    SetMultipleChoices(values.map((val, index) => ({ id: index + 1, option: val, is_correct: true })));
  };

  const renderFormElement = () => {
    switch (SelectedOption) {
      case 'Identification':
        return <Input type="text" placeholder="Enter answer" onChange={(e) => handleInputChange(1, e.target.value)} />;
      case 'Enumeration':
        return (
          <>
            <Text>Separate answers by new line</Text>
            <Textarea value={EnumerationText} onChange={handleEnumerationChange} placeholder="Enter answers" />
          </>
        );
      case 'True/False':
        return (
          <RadioGroup onChange={(val) => handleRadioChange(val === "true" ? 1 : 2)}>
            <Stack spacing={2}>
              {MultipleChoices.map(option => (
                <Radio key={option.id} value={option.option.toLowerCase()} isChecked={option.is_correct}>
                  {option.option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case 'Multiple':
        return (
          <RadioGroup>
            <Stack spacing={2}>
              {MultipleChoices.map(option => (
                <Flex key={option.id} direction="row" alignItems="center" gap={4}>
                  <Radio isChecked={option.is_correct} onChange={() => handleRadioChange(option.id)} />
                  <Input type="text" value={option.option} onChange={(e) => handleInputChange(option.id, e.target.value)} />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <AlertDialog isOpen={isOpen} motionPreset="slideInBottom" onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Create New Question
          </AlertDialogHeader>
          <AlertDialogBody>
            <Stack spacing={2}>
              <Text fontWeight="semibold">Subject</Text>
              <Input value={localStorage.getItem("usersubject")} readOnly mb={4} />
              <Text fontWeight="semibold">Question</Text>
              <Input type="text" mb={4} value={Question} onChange={(e) => SetQuestion(e.currentTarget.value)} />
              <Text fontWeight="semibold">Category</Text>
              <Select value={SelectedOption} onChange={handleChangeOption}>
                <option value="Identification">Identification</option>
                <option value="Enumeration">Enumeration</option>
                <option value="True/False">True/False</option>
                <option value="Multiple">Multiple Choice</option>
              </Select>
              <Text fontWeight="semibold" mt={4}>
                Choices
              </Text>
              {renderFormElement()}
            </Stack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="green"
              onClick={HandleCreate}
            >
              Create
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
