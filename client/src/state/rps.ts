import { BigNumber, ethers } from "ethers";
import { atom } from "jotai";

import { rps } from "../assets";
import { AccountAtom, hasherContractAtom, SignerAtom } from "./wallet";

export const LoadingCreateGameAtom = atom(false);
export const LoadingJoinGameAtom = atom(false);
export const LoadingTimeoutGameAtom = atom(false);
export const AddressGameAtom = atom("");
export const SaltGameAtom = atom<number | null>(null);

async function createHash(hasherContract: any, move: number) {
  const salt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const hash = await hasherContract.hash(move, salt);
  return { hash, salt };
}

const ContractGenerator = (address: string, abi: any, signer: any) =>
  new ethers.Contract(address, abi, signer);
const ContractFactory = (abi: any, byteCode: any, signer: any) =>
  new ethers.ContractFactory(abi, byteCode, signer);

export const createGameAtom = atom(
  null,
  async (get, set, { move, address, amount }) => {
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || hasherContract === null) return;

    try {
      set(SaltGameAtom, null);
      set(AddressGameAtom, "");
      set(LoadingCreateGameAtom, true);
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
      set(AddressGameAtom, createGame.address);
      set(SaltGameAtom, salt);
    } catch (error) {
      console.log(error);
    } finally {
      set(LoadingCreateGameAtom, false);
    }
  }
);

export const joinGameAtom = atom(
  null,
  async (get, set, { address, move, amount }) => {
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || hasherContract === null) return;

    try {
      set(LoadingJoinGameAtom, true);
      const signer = get(SignerAtom);
      const rsplsContract = ContractGenerator(address, rps.abi, signer);
      const playGame = await rsplsContract.play(move, {
        value: BigNumber.from(amount),
      });
      console.log("Mining...", playGame.hash);
      await playGame.wait();
      console.log("Mined -- ", playGame.hash);
    } catch (error) {
      console.log(error);
    } finally {
      set(LoadingJoinGameAtom, false);
    }
  }
);

export const solveGameAtom = atom(
  null,
  async (get, set, { address, move, salt }) => {
    const hasherContract = get(hasherContractAtom);
    const saltGame = get(SaltGameAtom);
    if (get(AccountAtom) === null || hasherContract === null || saltGame === 0)
      return;

    try {
      set(LoadingCreateGameAtom, true);
      const signer = get(SignerAtom);
      const rsplsContract = ContractGenerator(address, rps.abi, signer);
      const solveGame = await rsplsContract.solve(move, salt);
      console.log("Mining...", solveGame.hash);
      await solveGame.wait();
      console.log("Mined -- ", solveGame.hash);
    } catch (error) {
      console.log(error);
    } finally {
      set(LoadingCreateGameAtom, false);
      set(SaltGameAtom, null);
    }
  }
);

export const timeoutGameAtom = atom(null, async (get, set, { address }) => {
  if (get(AccountAtom) === null) return;

  try {
    set(LoadingTimeoutGameAtom, true);
    const signer = get(SignerAtom);
    const rsplsContract = ContractGenerator(address, rps.abi, signer);
    const timeoutGame = await rsplsContract.j1Timeout();
    console.log("Mining...", timeoutGame.hash);
    await timeoutGame.wait();
    console.log("Mined -- ", timeoutGame.hash);
  } catch (error) {
    console.log(error);
  } finally {
    set(LoadingTimeoutGameAtom, false);
  }
});
