import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { timeoutGameAtom, TimeoutGameStateAtom } from "../state/timeoutGame";

export default function Timeout({ address }: { address: string }) {
  const [, timeoutGame] = useAtom(timeoutGameAtom);
  const [timeoutGameState] = useAtom(TimeoutGameStateAtom);

  return (
    <Flex gap="2">
      <Button
        type="button"
        variant="outline"
        width="full"
        onClick={async () => await timeoutGame({ address, player: "j1" })}
        mt={4}
        disabled={timeoutGameState.loading || !address}
        isLoading={timeoutGameState.loading}
      >
        j1Timeout
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={async () => await timeoutGame({ address, player: "j2" })}
        width="full"
        mt={4}
        disabled={timeoutGameState.loading || !address}
        isLoading={timeoutGameState.loading}
      >
        j2Timeout
      </Button>
    </Flex>
  );
}
