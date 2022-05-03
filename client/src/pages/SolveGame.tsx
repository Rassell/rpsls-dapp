import React, { useRef } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useAtom } from "jotai";

import SelectMove from "../components/SelectMove";
import { LoadingJoinGameAtom, solveGameAtom } from "../state/rps";

export default function JoinGame() {
  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [salt, setSalt] = React.useState("");
  const formRef = useRef();

  const [, solveGame] = useAtom(solveGameAtom);
  const [loading] = useAtom(LoadingJoinGameAtom);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await solveGame({ address, move, salt });

    setAddress("");
    setMove("");
    setSalt("");
    (event.target as any).reset();
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
          isLoading={loading}
        >
          Solve
        </Button>
        <Button
          type="submit"
          variant="outline"
          width="full"
          mt={4}
          isLoading={loading}
        >
          j1Timeout
        </Button>
        <Button
          type="submit"
          variant="outline"
          width="full"
          mt={4}
          isLoading={loading}
        >
          j2Timeout
        </Button>
      </form>
    </div>
  );
}
