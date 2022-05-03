import React from "react";
import { Alert, AlertIcon, AlertTitle, Button, Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { timeoutGameAtom, TimeoutGameStateAtom } from "../state/timeoutGame";

export default function Timeout({ address }: { address: string }) {
  const [, timeoutGame] = useAtom(timeoutGameAtom);
  const [timeoutGameState] = useAtom(TimeoutGameStateAtom);

  return (
    <>
      <Flex gap="2">
        <Button
          type="button"
          variant="outline"
          onClick={async () => await timeoutGame({ address, player: "1" })}
          width="full"
          mt={4}
          disabled={timeoutGameState.loading || !address}
          isLoading={timeoutGameState.loading}
        >
          j1Timeout
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => await timeoutGame({ address, player: "2" })}
          width="full"
          mt={4}
          disabled={timeoutGameState.loading || !address}
          isLoading={timeoutGameState.loading}
        >
          j2Timeout
        </Button>
      </Flex>
      {timeoutGameState.finished && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>Success timeout the game</AlertTitle>
        </Alert>
      )}
      {timeoutGameState.error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error timeout the game</AlertTitle>
        </Alert>
      )}
    </>
  );
}
