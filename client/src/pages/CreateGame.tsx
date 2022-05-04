import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import SelectMove from "../components/SelectMove";
import { createGameAtom, CreateGameStateAtom } from "../state/createGame";

export default function CreateGame() {
  const [, createGame] = useAtom(createGameAtom);
  const [gameState] = useAtom(CreateGameStateAtom);

  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createGame({ move, address, amount });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="address">Second player Address</FormLabel>
          <Input
            id="address"
            placeholder="Second player Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>
        <SelectMove onChange={setMove} />
        <FormControl isRequired>
          <FormLabel htmlFor="amount">Stake in wei</FormLabel>
          <NumberInput
            id="amount"
            defaultValue={0}
            min={0}
            placeholder="Amount to bet"
            onChange={(val) => setAmount(val as any)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Button
          type="submit"
          variant="outline"
          width="full"
          mt={4}
          isLoading={gameState.loading}
          disabled={
            gameState.loading || !address || move === "" || amount === 0
          }
        >
          Create game
        </Button>
      </form>
      {gameState.finished && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>Success creating the contract</AlertTitle>
        </Alert>
      )}
      {gameState.error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error creating the contract</AlertTitle>
        </Alert>
      )}
      <div>Deploy Address: {gameState.address} </div>
      <div>Deploy salt: {gameState.salt} </div>
    </div>
  );
}
