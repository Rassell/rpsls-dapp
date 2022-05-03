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
import { JoinGameStateAtom, joinGameAtom } from "../state/joinGame";

export default function JoinGame() {
  const [, joinGame] = useAtom(joinGameAtom);
  const [joinGameState] = useAtom(JoinGameStateAtom);

  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await joinGame({ address, move, amount });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="address">Contract Address</FormLabel>
          <Input
            id="address"
            placeholder="Contract Address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>
        <SelectMove onChange={setMove} />
        <FormControl isRequired>
          <FormLabel htmlFor="amount">Stake</FormLabel>
          <NumberInput
            id="amount"
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
          isLoading={joinGameState.loading}
          disabled={
            joinGameState.loading || !address || move === "" || amount === 0
          }
        >
          Join Game
        </Button>
      </form>
      {joinGameState.finished && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>Success joining the game</AlertTitle>
        </Alert>
      )}
      {joinGameState.error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error joining the game</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
