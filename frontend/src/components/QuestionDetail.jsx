import {
  Stack,
  Radio,
  RadioGroup,
  Flex,
  Text,
  Textarea,
  Input,
  SimpleGrid,
  Button,
  ModalBody,
  ModalFooter,
  AlertDialog,
  useDisclosure,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  Checkbox
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { TbPencil, TbX, TbCheck } from "react-icons/tb";

QuestionDetail.propTypes = {
  QuestionData: PropTypes.any.isRequired,
};

export default function QuestionDetail({ QuestionData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...QuestionData });
  const [SelectedOption, SetSelectedOption] = useState(QuestionData.category);
  const [MultipleChoices, SetMultipleChoices] = useState(() => {
    try {
      return QuestionData.options ? JSON.parse(QuestionData.options) : [];
    } catch (error) {
      console.error("Error parsing options:", error);
      return [];
    }
  });
  
  const [EnumerationText, SetEnumerationText] = useState("");

  useEffect(() => {
    console.log(MultipleChoices)
  }, [])

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const HandleDisableQuestion = () => {
    console.log("Disable Question");
  };

  const HandleSaveChanges = () => {
    console.log("Updated Data:", editedData);
    setIsEditing(false);
  };

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
          return <Input readOnly={!isEditing} type="text" value={MultipleChoices[0].option} placeholder="Enter answer" onChange={(e) => handleInputChange(1, e.target.value)} />;
        case 'Enumeration':
          return (
            <>
              <Text>Separate answers by new line</Text>
              <Textarea readOnly={!isEditing} value={EnumerationText} onChange={handleEnumerationChange} placeholder="Enter answers" />
            </>
          );
        case 'True/False':
          return (
            <RadioGroup onChange={(val) => handleRadioChange(val === "true" ? 1 : 2)}>
              <Stack spacing={2}>
                {MultipleChoices.map(option => (
                  <Radio disabled={!isEditing} key={option.id} isChecked={option.is_correct}>
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
                    <Checkbox isChecked={option.is_correct} onChange={() => handleRadioChange(option.id)} />
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
    <>
      {/* Disable Confirmation Modal */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Disable Question?</AlertDialogHeader>
            <AlertDialogBody>You can enable the question anytime</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} mr={2}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={HandleDisableQuestion}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Question Details */}
      <ModalBody>
        <Text fontWeight="semibold">SUBJECT</Text>
        <Input value={editedData.subject} disabled={!isEditing} name="subject" onChange={handleChange} mb={4} />

        <Text fontWeight="semibold">QUESTION</Text>
        <Input value={editedData.question} disabled={!isEditing} name="question" onChange={handleChange} mb={4} />

        <Text fontWeight="semibold">CATEGORY</Text>
        <Select
          value={SelectedOption} // Default value dynamically set
          onChange={handleChangeOption} 
          isDisabled={!isEditing} // Only editable when in edit mode
          mb={4}
        >
          <option value="Identification">Identification</option>
          <option value="Enumeration">Enumeration</option>
          <option value="True/False">True/False</option>
          <option value="Multiple">Multiple Choice</option>
        </Select>

        <Text fontWeight="semibold">OPTIONS / CORRECT ANSWER</Text>
        {renderFormElement()}

        <Stack mb={4} mt={8} spacing={2}>
          <SimpleGrid alignItems="center" templateColumns="40% 60%">
            <Text>Created By</Text>
            <Text>{editedData.created_by}</Text>
          </SimpleGrid>
          <SimpleGrid alignItems="center" templateColumns="40% 60%">
            <Text>Date Created</Text>
            <Text>{editedData.date_created}</Text>
          </SimpleGrid>
        </Stack>
      </ModalBody>

      {/* Action Buttons */}
      <ModalFooter>
        {isEditing ? (
          <>
            <Button leftIcon={<TbCheck />} colorScheme="green" onClick={HandleSaveChanges} mr={2}>
              Save
            </Button>
            <Button colorScheme="red" onClick={toggleEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button leftIcon={<TbPencil />} colorScheme="blue" onClick={toggleEdit} mr={2}>
              Edit
            </Button>
            <Button leftIcon={<TbX />} colorScheme="red" onClick={onOpen}>
              Disable
            </Button>
          </>
        )}
      </ModalFooter>
    </>
  );
}
