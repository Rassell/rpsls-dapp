import { BigNumber, ethers } from "ethers";
import { atom } from "jotai";

import { rps } from "../assets";
import { AccountAtom, hasherContractAtom, SignerAtom } from "./wallet";

export const CreateGameStateAtom = atom<{
  loading: boolean;
  address: string | null;
  salt: number | null;
  error: boolean;
  finished: boolean;
}>({
  loading: false,
  address: null,
  salt: null,
  error: false,
  finished: false,
});

async function createHash(hasherContract: any, move: number) {
  const salt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const hash = await hasherContract.hash(move, salt);
  return { hash, salt };
}

function ContractFactory(abi: any, byteCode: any, signer: any) {
  return new ethers.ContractFactory(abi, byteCode, signer);
}

function delay(mili: number) {
  return new Promise((resolve) => setTimeout(resolve, mili));
}

export const createGameAtom = atom(
  null,
  async (get, set, { move, address, amount }) => {
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || hasherContract === null) return;

    try {
      set(CreateGameStateAtom, {
        loading: true,
        address: null,
        salt: null,
        error: false,
        finished: false,
      });
      console.log("Creating hash...");
      const { hash, salt } = await createHash(hasherContract, move);
      console.log(`Hash Generated... from salt: ${salt}`);
      console.log("Generating game...");
      const signer = get(SignerAtom);
      const createGame = await ContractFactory(
        rps.abi,
        rps.bytecode,
        signer
      ).deploy(hash, address, {
        value: BigNumber.from(amount),
      });
      console.log("Game Generated...");
      set(CreateGameStateAtom, {
        loading: false,
        address: createGame.address,
        salt,
        error: false,
        finished: true,
      });
    } catch (error) {
      console.log(error);
      set(CreateGameStateAtom, {
        loading: false,
        address: null,
        salt: null,
        error: true,
        finished: false,
      });
    } finally {
      await delay(5000);
      set(CreateGameStateAtom, {
        ...get(CreateGameStateAtom),
        error: false,
        finished: false,
      });
    }
  }
);
