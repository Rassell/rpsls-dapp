import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Center } from "@chakra-ui/react";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Center className="home">
      <Button colorScheme="blue" onClick={() => navigate("createGame")}>
        Create Game
      </Button>
      <Button colorScheme="teal" onClick={() => navigate("joinGame")}>
        Join Game
      </Button>
      <Button colorScheme="red" onClick={() => navigate("solveGame")}>
        Solve Game
      </Button>
    </Center>
  );
}
