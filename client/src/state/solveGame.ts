import { ethers } from "ethers";
import { atom } from "jotai";

import { rps } from "../assets";
import { AccountAtom, hasherContractAtom, SignerAtom } from "./wallet";

export const SolveGameStateAtom = atom<{
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

export const solveGameAtom = atom(
  null,
  async (get, set, { move, address, salt }) => {
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || hasherContract === null) return;

    try {
      set(SolveGameStateAtom, {
        loading: true,
        error: false,
        finished: false,
      });
      const signer = get(SignerAtom);
      const rsplsContract = ContractGenerator(address, rps.abi, signer);
      const solveGame = await rsplsContract.solve(move, salt);
      console.log("Solving game...", solveGame.hash);
      await solveGame.wait();
      console.log("Solved game", solveGame.hash);
      set(SolveGameStateAtom, {
        loading: false,
        error: false,
        finished: true,
      });
    } catch (error) {
      console.log(error);
      set(SolveGameStateAtom, {
        loading: false,
        error: true,
        finished: false,
      });
    } finally {
      await delay(5000);
      set(SolveGameStateAtom, {
        loading: false,
        error: false,
        finished: false,
      });
    }
  }
);
