import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import CreateExamForm from "../components/CreateExamForm";
import ExamDataTable from "../components/ExamDataTable";

export default function ExamPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Exams, SetExams] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/ExamRoute.php?action=viewAll&subject=${localStorage.getItem("usersubject")}`)
      .then(response => {
        SetExams(response.data)
      });
  }, []);

  return (
    <Stack>
      <CreateExamForm onClose={onClose} isOpen={isOpen} onOpen={onOpen}  />
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading size="md">EXAM LIST</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>Create Exam</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <ExamDataTable data={Exams}/>
          </CardBody>
        </Card>
        
      </Stack>
    </Stack>
  );
}
