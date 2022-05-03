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
import {
  createGameAtom,
  LoadingCreateGameAtom,
  ResultGameAtom,
} from "../state/rps";

export default function CreateGame() {
  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  const [, createGame] = useAtom(createGameAtom);
  const [loadingCreateGame] = useAtom(LoadingCreateGameAtom);
  const [resultGame] = useAtom(ResultGameAtom);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createGame({ move, address, amount });

    setAddress("");
    setMove("");
    setAmount(0);
    (event.target as any).reset();
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
          isLoading={loadingCreateGame}
        >
          Create game
        </Button>
        <div>Deploy Address: {resultGame}</div>
      </form>
    </div>
  );
}
