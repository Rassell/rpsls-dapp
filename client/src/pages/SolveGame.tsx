import React from "react";
import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useAtom } from "jotai";

import SelectMove from "../components/SelectMove";
import {
  LoadingJoinGameAtom,
  LoadingTimeoutGameAtom,
  solveGameAtom,
  timeoutGameAtom,
} from "../state/rps";

export default function JoinGame() {
  const [address, setAddress] = React.useState("");
  const [move, setMove] = React.useState("");
  const [salt, setSalt] = React.useState("");

  const [, solveGame] = useAtom(solveGameAtom);
  const [, timeoutGame] = useAtom(timeoutGameAtom);
  const [loading] = useAtom(LoadingJoinGameAtom);
  const [loadingTimeOut] = useAtom(LoadingTimeoutGameAtom);

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
          disabled={loading || !address || move === "0" || !salt}
          isLoading={loading}
        >
          Solve
        </Button>
      </form>
      <Flex gap="2">
        <Button
          type="button"
          variant="outline"
          width="full"
          onClick={() => timeoutGame({ address })}
          mt={4}
          disabled={loadingTimeOut || !address}
          isLoading={loadingTimeOut}
        >
          j1Timeout
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => timeoutGame({ address })}
          width="full"
          mt={4}
          disabled={loadingTimeOut || !address}
          isLoading={loadingTimeOut}
        >
          j2Timeout
        </Button>
      </Flex>
    </div>
  );
}
