import React from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useAtom } from "jotai";

import SelectMove from "../components/SelectMove";
import { solveGameAtom, SolveGameStateAtom } from "../state/solveGame";
import Timeout from "../containers/Timeout";

export default function JoinGame() {
  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [salt, setSalt] = React.useState("");

  const [, solveGame] = useAtom(solveGameAtom);
  const [solveGameState] = useAtom(SolveGameStateAtom);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await solveGame({ address, move, salt });
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
          <FormLabel htmlFor="amount">Salt</FormLabel>
          <Input
            id="salt"
            placeholder="salt"
            onChange={(e) => setSalt(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          variant="outline"
          width="full"
          mt={4}
          isLoading={solveGameState.loading}
          disabled={solveGameState.loading || !address || move === "" || !salt}
        >
          Solve
        </Button>
      </form>
      <Timeout address={address} />
    </div>
  );
}
