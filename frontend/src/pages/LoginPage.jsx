import {
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import LOGO from "../assets/logo.png";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";
import { Formik, Form, Field } from "formik";

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (localStorage.getItem("userid")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <Container maxW="400px">
      <Card mt={16}>
        <CardBody>
          <Stack p={4}>
            <Image w="50%" src={LOGO} mt={4} mb={8} alignSelf="center" />
            <Heading mb={4}>Exam Bank</Heading>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={(values, actions) => {
                axios.post("http://localhost:8080/api/UserRoute.php?action=login", values).then((response) => {
                  if (response.data.id !== undefined) {
                    localStorage.setItem("userid", response.data.id);
                    localStorage.setItem("userfullname", response.data.name);
                    localStorage.setItem("usertype", response.data.type);
                    localStorage.setItem("usersubject", response.data.assigned_subject);
                    localStorage.setItem("useravatar", response.data.avatar);
                    localStorage.setItem("userjson", JSON.stringify(response.data));
                    toast({
                      title: "Login Successfully",
                      description: "Welcome back " + response.data.name,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });

                    navigate("/dashboard");
                  } else {
                    toast({
                      title: "Login Failed",
                      description: response.data.message,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                });
                actions.setSubmitting(false);
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">USERNAME</FormLabel>
                    <Field
                      as={Input}
                      name="username"
                      type="text"
                      placeholder="juandelacruz"
                      required
                    />
                  </FormControl>
                  <FormControl isRequired mt={4}>
                    <FormLabel fontWeight="semibold">PASSWORD</FormLabel>
                    <Field
                      as={Input}
                      name="password"
                      type="password"
                      required
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    rightIcon={<TbLogin2 />}
                    w="100%"
                    mt={4}
                    colorScheme="blue"
                    size="lg"
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
}
