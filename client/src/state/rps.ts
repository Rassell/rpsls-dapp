import { BigNumber, ethers } from "ethers";
import { atom } from "jotai";

import { rps } from "../assets";
import { AccountAtom, hasherContractAtom, SignerAtom } from "./wallet";

export const LoadingCreateGameAtom = atom(false);
export const LoadingJoinGameAtom = atom(false);
export const ResultGameAtom = atom("");
export const InitGameAtom = atom({
  move: 0,
  hash: 0,
});

async function createHash(hasherContract: any, move: number) {
  const salt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const hash = await hasherContract.hash(move, salt);
  return hash;
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
      set(LoadingCreateGameAtom, true);
      console.log("Creating hash...");
      const hash = await createHash(hasherContract, move);
      console.log("Hash Generated...");
      set(InitGameAtom, { hash, move });
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
      set(ResultGameAtom, createGame.address);
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

export const solveGameAtom = atom(null, async (get, set, { address, move, salt }) => {
  const hasherContract = get(hasherContractAtom);
  const initGame = get(InitGameAtom);
  if (
    get(AccountAtom) === null ||
    hasherContract === null ||
    initGame.hash === 0
  )
    return;

  try {
    set(LoadingCreateGameAtom, true);
    const signer = get(SignerAtom);
    const rsplsContract = ContractGenerator(address, rps.abi, signer);
    const solveGame = await rsplsContract.solve();
    console.log("Mining...", solveGame.hash);
    await solveGame.wait();
    console.log("Mined -- ", solveGame.hash);
  } catch (error) {
    console.log(error);
  } finally {
    set(LoadingCreateGameAtom, false);
    set(InitGameAtom, { move: 0, hash: 0 });
  }
});

export const timeoutGameAtom = atom(
  null,
  async (get, set, { address, move }) => {
    if (get(AccountAtom) === null) return;

    try {
      set(LoadingCreateGameAtom, true);
      const signer = get(SignerAtom);
      const rsplsContract = ContractGenerator(address, rps.abi, signer);
      const timeoutGame = await rsplsContract.j1Timeout();
      console.log("Mining...", timeoutGame.hash);
      await timeoutGame.wait();
      console.log("Mined -- ", timeoutGame.hash);
    } catch (error) {
      console.log(error);
    } finally {
      set(LoadingCreateGameAtom, false);
    }
  }
);
