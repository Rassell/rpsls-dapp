import { BigNumber, ethers } from "ethers";
import { atom } from "jotai";

import { rps } from "../assets";
import { AccountAtom, hasherContractAtom, SignerAtom } from "./wallet";

export const JoinGameStateAtom = atom<{
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

export const joinGameAtom = atom(
  null,
  async (get, set, { move, address, amount }) => {
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || hasherContract === null) return;

    try {
      set(JoinGameStateAtom, {
        loading: true,
        error: false,
        finished: false,
      });
      const signer = get(SignerAtom);
      const rsplsContract = ContractGenerator(address, rps.abi, signer);
      const playGame = await rsplsContract.play(move, {
        value: BigNumber.from(amount),
      });
      console.log("Joining game...", playGame.hash);
      await playGame.wait();
      console.log("Joined game", playGame.hash);
      set(JoinGameStateAtom, {
        loading: false,
        error: false,
        finished: true,
      });
    } catch (error) {
      console.log(error);
      set(JoinGameStateAtom, {
        loading: false,
        error: true,
        finished: false,
      });
    } finally {
      await delay(5000);
      set(JoinGameStateAtom, {
        loading: false,
        error: false,
        finished: false,
      });
    }
  }
);
