import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";

import CreateQuestionForm from "../components/CreateQuestionForm";
import QuestionDataTable from "../components/QuestionDataTable";
import { BiPlus } from "react-icons/bi";

export default function QuestionPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Questions, SetQuestions] = useState([]);

  useEffect(() => {
    axios.post(`http://localhost:8080/api/QuestionRoute.php?action=viewAll`, {
      name: localStorage.getItem("userfullname"),
      type: localStorage.getItem("usertype")
    })
      .then(response => {
        SetQuestions(response.data);
      });
  }, []);

  return (
    <Stack>
      <CreateQuestionForm onClose={onClose} isOpen={isOpen} onOpen={onOpen}  />
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading size="md">QUESTION LIST</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>Create Question</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <QuestionDataTable data={Questions}/>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
