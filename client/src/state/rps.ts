import { ethers } from "ethers";
import { atom } from "jotai";

import { AccountAtom, hasherContractAtom, rsplsContractAtom } from "./wallet";

export const LoadingCreateGameAtom = atom(false);
export const InitGameAtom = atom({
  move: 0,
  hash: 0,
});

async function createHash(hasherContract: any, move: number) {
  const salt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const hash = await hasherContract.hash(move, salt);
  return hash;
}

export const createGameAtom = atom(
  null,
  async (get, set, { move, address, amount }) => {
    const rsplsContract = get(rsplsContractAtom);
    const hasherContract = get(hasherContractAtom);
    const account = get(AccountAtom);
    if (account === null || rsplsContract === null || hasherContract === null)
      return;

    try {
      set(LoadingCreateGameAtom, true);
      const hash = await createHash(hasherContract, move);
      set(InitGameAtom, { hash, move });
      const createGame = await rsplsContract.new(hash, address, {
        from: account,
        gas: 3000,
        value: ethers.utils.formatUnits(amount, "gwei"),
      });
      console.log("Mining...", createGame.hash);
      await createGame.wait();
      console.log("Mined -- ", createGame.hash);
    } catch (error) {
      console.log(error);
    } finally {
      set(LoadingCreateGameAtom, false);
    }
  }
);

export const joinGameAtom = atom(null, async (get, set, { move, amount }) => {
  const rsplsContract = get(rsplsContractAtom);
  const hasherContract = get(hasherContractAtom);
  const account = get(AccountAtom);
  if (account === null || rsplsContract === null || hasherContract === null)
    return;

  try {
    set(LoadingCreateGameAtom, true);
    const playGame = await rsplsContract.play(move, {
      from: account,
      gas: 3000,
      value: ethers.utils.formatUnits(amount, "gwei"),
    });
    console.log("Mining...", playGame.hash);
    await playGame.wait();
    console.log("Mined -- ", playGame.hash);
  } catch (error) {
    console.log(error);
  } finally {
    set(LoadingCreateGameAtom, false);
  }
});

export const solveGameAtom = atom(null, async (get, set) => {
  const rsplsContract = get(rsplsContractAtom);
  const hasherContract = get(hasherContractAtom);
  const initGame = get(InitGameAtom);
  if (
    get(AccountAtom) === null ||
    rsplsContract === null ||
    hasherContract === null ||
    initGame.hash === 0
  )
    return;

  try {
    set(LoadingCreateGameAtom, true);
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

export const timeoutGameAtom = atom(null, async (get, set, move) => {
  const rsplsContract = get(rsplsContractAtom);
  if (get(AccountAtom) === null || rsplsContract === null) return;

  try {
    set(LoadingCreateGameAtom, true);
    const timeoutGame = await rsplsContract.j1Timeout();
    console.log("Mining...", timeoutGame.hash);
    await timeoutGame.wait();
    console.log("Mined -- ", timeoutGame.hash);
  } catch (error) {
    console.log(error);
  } finally {
    set(LoadingCreateGameAtom, false);
  }
});
