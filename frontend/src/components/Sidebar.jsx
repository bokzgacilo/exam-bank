import {
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  Card,
  CardBody,
  Avatar,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  useDisclosure,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BiLogOut, BiNotepad } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SidebarComponent() {
  const location = useLocation();
  const Usertype = localStorage.getItem("usertype");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();

  const navigationItems = [
    {
      to: "questions",
      label: "Question Bank",
      pathname: "/dashboard/questions",
    },
    { to: "exams", label: "Exam Bank", pathname: "/dashboard/exams" },
    { to: "users", label: "User Management", pathname: "/dashboard/users" }
  ];

  const HandleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Flex
      direction="column"
      gap={4}
      p={4}
      backgroundColor="#2b2b2b"
      color="#fff"
    >
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Logout</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} mr={4}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={HandleLogout}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Heading size="lg" mb={8}>
        Exam Bank
      </Heading>
      <Card backgroundColor="#b0b0b021">
        <CardBody>
          <Flex direction="row" alignItems="center" color="#fff" gap={4}>
            <Avatar src={localStorage.getItem("useravatar")} />
            <Flex direction="column">
              <Heading size="md">
                {localStorage.getItem("userfullname")}
              </Heading>
              <Text>{localStorage.getItem("usertype")}</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
      <Heading size="md" mb={8}>
        Menu
      </Heading>
      {navigationItems.map((item) => {
        if (Usertype !== "admin" && item.to === "users" && item.to === "subjects") {
          return null;
        }

        return (
          <Flex
            direction="row"
            fontSize="18px"
            gap={4}
            alignItems="center"
            key={item.to}
            as={Link}
            to={item.to}
            padding={4}
            borderRadius={2}
            color={
              location.pathname === item.pathname ? "#eff024" : "lightgray"
            }
            backgroundColor={
              location.pathname === item.pathname ? "#b0b0b021" : ""
            }
          >
            <Icon as={BiNotepad} />
            <Text>{item.label}</Text>
          </Flex>
        );
      })}
      <Flex
        p={4}
        cursor="pointer"
        color="lightgray"
        fontSize="16px"
        alignItems="center"
        gap={2}
        mt="auto"
        direction="row"
        justifyContent="center"
        onClick={onOpen}
      >
        <Icon as={BiLogOut} />
        <Text>Log Out</Text>
      </Flex>
    </Flex>
  );
}
