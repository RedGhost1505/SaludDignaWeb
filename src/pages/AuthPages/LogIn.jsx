import { useState } from "react";
import { useNavigate } from "react-router";

import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Alert
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { AlertIcon } from "@chakra-ui/alert";
import { FormControl } from "@chakra-ui/form-control";

const LogIn = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tokenData = {email: "test@gmail.com", roles_id: [1], acces_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
  const decodedToken = { 
    email: "test@gmail.com",
    nombre: "Iñigo",
    apellidos: "Quintana Delgadillo",
    roles_id: 1
  }

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulamos un login sencillo
    if (email === "test@gmail.com" && password === "123") {
      localStorage.setItem('decoded', JSON.stringify(decodedToken));
      localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      localStorage.setItem('tokenData', JSON.stringify(tokenData));
      navigate('/logout');
    } else {
      console.log("Correo o contraseña incorrectos");
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bgGradient="linear(to-b, gray.800, gray.900)"
    >
      <Box maxW="md" w="full" p={8}>
        <Heading
          as="h1"
          size="2xl"
          color="white"
          textAlign="center"
          mb={8}
          fontWeight="bold"
          letterSpacing="wider"
        >
          Log In
        </Heading>

        <VStack
          as="form"
          onSubmit={handleLogin}
          spacing={6}
          bg="whiteAlpha.100"
          backdropFilter="blur(4px)"
          p={8}
          borderRadius="xl"
          boxShadow="2xl"
        >
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FormControl>
            <VStack spacing={2} w="full">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="gray.100"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "none",
                  ring: "2px",
                  ringColor: "blue.500",
                }}
                required
              />
            </VStack>
          </FormControl>

          <FormControl>
            <VStack spacing={2} w="full">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.100"
                borderColor="gray.300"
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "none",
                  ring: "2px",
                  ringColor: "blue.500",
                }}
                required
              />
            </VStack>
          </FormControl>

          <Button
            type="submit"
            w="full"
            colorScheme="blue"
            size="lg"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            Iniciar sesión
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LogIn;