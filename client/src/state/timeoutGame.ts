import { ethers } from "ethers";
import { atom } from "jotai";

import { rps } from "../assets";
import { AccountAtom, hasherContractAtom, SignerAtom } from "./wallet";

export const TimeoutGameStateAtom = atom<{
  loading: boolean;
  error: boolean;
  finished: boolean;
}>({
  loading: false,
  error: false,
  finished: false,
});

const ContractGenerator = (address: string, abi: any, signer: any) =>
  new ethers.Contract(address, abi, signer);

function delay(mili: number) {
  return new Promise((resolve) => setTimeout(resolve, mili));
}

export const timeoutGameAtom = atom(
  null,
  async (
    get,
    set,
    { address, player }: { address: string; player: "j1" | "j2" }
  ) => {
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || hasherContract === null) return;

    try {
      set(TimeoutGameStateAtom, {
        loading: true,
        error: false,
        finished: false,
      });
      const signer = get(SignerAtom);
      const rsplsContract = ContractGenerator(address, rps.abi, signer);
      const timeoutGame = await rsplsContract[
        player === "j1" ? "j1Timeout" : "j2Timeout"
      ]({
        gasLimit: 30000,
      });
      console.log("Timeouting game...", timeoutGame.hash);
      await timeoutGame.wait();
      console.log("Timeout game", timeoutGame.hash);
      set(TimeoutGameStateAtom, {
        loading: false,
        error: false,
        finished: true,
      });
    } catch (error) {
      console.log(error);
      set(TimeoutGameStateAtom, {
        loading: false,
        error: true,
        finished: false,
      });
    } finally {
      await delay(5000);
      set(TimeoutGameStateAtom, {
        loading: false,
        error: false,
        finished: false,
      });
    }
  }
);
