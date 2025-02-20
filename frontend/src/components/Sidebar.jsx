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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Stack,
  Input,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { TbChartDots, TbFileDescription, TbList, TbLogout2, TbQuestionMark, TbUsers } from "react-icons/tb";

export default function SidebarComponent() {
  const location = useLocation();
  const Usertype = localStorage.getItem("usertype");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenProfileModal, onOpen : onOpenProfileModal, onClose : onCloseProfileModal } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();

  const UserJSON = JSON.parse(localStorage.getItem("userjson"))

  const navigationItems = (() => {
    switch (localStorage.getItem("usertype")) {
      case "Instructor":
        return [
          {
            to: "questions",
            label: "Question Bank",
            pathname: "/dashboard/questions",
            icon: TbQuestionMark
          },
          { to: "exams", label: "Exam Bank", pathname: "/dashboard/exams", icon: TbFileDescription },
        ];
      case "Admin":
        return [
          {
            to: "questions",
            label: "Question Bank",
            pathname: "/dashboard/questions",
            icon: TbQuestionMark
          },
          { to: "exams", label: "Exam Bank", pathname: "/dashboard/exams", icon: TbFileDescription },
          {
            to: "users",
            label: "User Management",
            pathname: "/dashboard/users",
            icon: TbUsers
          },
          {
            to: "subjects",
            label: "Subjects",
            pathname: "/dashboard/subjects",
            icon: TbList
          },
          {
            to: "statistics",
            label: "Statistics",
            pathname: "/dashboard/subjects",
            icon: TbChartDots
          },
        ];
      case "Coordinator":
        return [
          {
            to: "questions",
            label: "Question Bank",
            pathname: "/dashboard/questions",
            icon: TbQuestionMark
          },
          { to: "exams", label: "Exam Bank", pathname: "/dashboard/exams", icon: TbFileDescription },
        ];
      default:
        return [];
    }
  })();

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
      <Modal isOpen={isOpenProfileModal} onClose={onCloseProfileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{localStorage.getItem("userfullname")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          </ModalBody>
            <Stack p={4}>
              <Flex direction="row" gap={8} mb={4}>
                <Avatar size="2xl" src={UserJSON.avatar} />
                <Stack>
                  <Input type="file" />
                  <Text>Only upload supported file types.</Text>
                </Stack>
              </Flex>
              <Heading size="md">Username</Heading>
              <Input value={UserJSON.username} isReadOnly />
              <Heading size="md" mt={4}>Password</Heading>
              <Input value={UserJSON.password} />
            </Stack>
          <ModalFooter>
            <Button colorScheme="green" mr={4}>
              Save Changes
            </Button>
            <Button onClick={onCloseProfileModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
      <Image alignSelf="center" mt={4} w={"30%"} src={LOGO} />
      <Heading textAlign="center" mb={4}>
        Exam Bank
      </Heading>
      <Card backgroundColor="#b0b0b021" onClick={onOpenProfileModal} cursor="pointer">
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
      <Heading size="lg" mt={4}>
        Menu
      </Heading>
      {navigationItems.map((item) => {
        if (
          Usertype !== "admin" &&
          item.to === "users" &&
          item.to === "subjects"
        ) {
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
            <Icon as={item.icon} />
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
        <Icon as={TbLogout2} />
        <Text>Log Out</Text>
      </Flex>
    </Flex>
  );
}
