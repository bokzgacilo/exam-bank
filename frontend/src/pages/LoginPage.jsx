import { Button, Card, CardBody, Container, Image, Input, Stack, Text} from "@chakra-ui/react";
import LOGO from "../assets/logo.png"
import { useEffect, useState } from "react";
import axios from 'axios';
import { POST_LOGIN_URL } from "../helper/endpoints";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [Username, SetUsername] = useState("")
  const [Password, SetPassword] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("userid")){
      navigate("/dashboard")
    }
  }, [])

  const data = {
    username: Username,
    password: Password
  }

  const HandleLogin = () => {
    axios.post(POST_LOGIN_URL, data)
      .then(response => {
        if(response.data.id !== undefined){
          localStorage.setItem("userid", response.data.id)
          localStorage.setItem("userfullname", response.data.name)
          localStorage.setItem("usertype", response.data.type)
          localStorage.setItem("usersubject", response.data.assigned_subject)
          localStorage.setItem("useravatar", response.data.avatar)
          localStorage.setItem("userjson", JSON.stringify(response.data))
          alert("logged in")
          navigate("/dashboard")
        }else {
          alert(0)
        }
      })
  }

  return(
    <Container maxW='400px'>
      <Card mt={16}>
        <CardBody>
          <Stack p={4}>
            <Image width="80%" src={LOGO} mt={8} mb={8} alignSelf="center" />
            <Text fontWeight="semibold">USERNAME</Text>
            <Input value={Username} onChange={(e) => SetUsername(e.currentTarget.value)} type="text" placeholder="prof-001" />
            <Text fontWeight="semibold">PASSWORD</Text>
            <Input value={Password} onChange={(e) => SetPassword(e.currentTarget.value)} type="password" />
            <Button onClick={HandleLogin} w="100%" mt={8} colorScheme="blue">Login</Button>
          </Stack>
        </CardBody>
      </Card>
      
    </Container>
  )
}