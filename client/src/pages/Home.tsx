import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Button colorScheme="blue" onClick={() => navigate("createGame")}>
        Create Game
      </Button>
      <Button colorScheme="teal" onClick={() => navigate("joinGame")}>
        Join Game
      </Button>
    </div>
  );
}
