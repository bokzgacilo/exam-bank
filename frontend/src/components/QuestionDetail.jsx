import {
  Stack,
  Radio,
  RadioGroup,
  Select,
  Flex,
  Text,
  Textarea,
  Input,
  Heading,
  Divider,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { useEffect } from "react";

import PropTypes from "prop-types";
QuestionDetail.propTypes = {
  QuestionData: PropTypes.any.isRequired,
};

export default function QuestionDetail({ QuestionData }) {
  const SelectedOption = QuestionData.category;
  const Options = JSON.parse(QuestionData.options);
  const CorrectAnswer = QuestionData.answer;

  const renderFormElement = () => {
    switch (SelectedOption) {
      case "Identification": {
        const correct_answer = JSON.parse(CorrectAnswer);
        return <Input size="sm" value={correct_answer.option} readOnly />;
      }
      case "Enumeration": {
        const TextAreaValue = Options.map((item) => item.option).join("\n");

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
              {Options.map((option) => (
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
              {Options.map((option) => (
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

  return (
    <Stack spacing={4}>
      <Heading size="lg">Question</Heading>
      <Text>NOTE: Question details cannot be edited.</Text>
      <Divider />
      <Text fontWeight="semibold">SUBJECT</Text>
      <Input value={QuestionData.subject} readOnly />
      <Text fontWeight="semibold">QUESTION</Text>
      <Input value={QuestionData.question} readOnly type="text" />
      <Text fontWeight="semibold">TYPE</Text>
      <Input value={SelectedOption} readOnly type="text" />
      <Text fontWeight="semibold">OPTIONS / CORRECT ANSWER</Text>
      {renderFormElement()}
      <Divider />
      <Stack>
        <SimpleGrid alignItems="center" templateColumns="40% 60%">
          <Heading size="sm">Created By</Heading>
          <Text>{QuestionData.created_by}</Text>
        </SimpleGrid>
        <SimpleGrid alignItems="center" templateColumns="40% 60%">
          <Heading size="sm">Date Created</Heading>
          <Text>{QuestionData.date_created}</Text>
        </SimpleGrid>
        <SimpleGrid alignItems="center" templateColumns="40% 60%">
          <Heading size="sm">Question ID</Heading>
          <Text>{QuestionData.id}</Text>
        </SimpleGrid>
      </Stack>
      <Divider />
      <Flex direction="row" justifyContent="flex-end">
        <Button colorScheme="red">Remove</Button>
      </Flex>
    </Stack>
  );
}
