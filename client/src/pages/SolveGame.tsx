import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import SelectMove from "../components/SelectMove";
import { joinGameAtom, LoadingJoinGameAtom } from "../state/rps";

export default function JoinGame() {
  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  const [, joinGame] = useAtom(joinGameAtom);
  const [loading] = useAtom(LoadingJoinGameAtom);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await joinGame({ address, move, amount });

    setAddress("");
    setMove("");
    setAmount(0);
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
          isLoading={loading}
        >
          Join Game
        </Button>
      </form>
    </div>
  );
}
