import { ethers } from "ethers";
import { atom } from "jotai";

import { hasher } from "../assets";
const hasherContractAddress = "0x0795997D6647098f0a69fE719908b3582dAd0bc5";

export const LoadingInitWeb3Atom = atom(false);
export const MissingMetaMaskAtom = atom(false);
export const AccountAtom = atom<string | null>(null);
export const SignerAtom = atom<ethers.providers.JsonRpcSigner | null>(null);
export const rsplsContractAtom = atom<ethers.Contract | null>(null);
export const hasherContractAtom = atom<ethers.Contract | null>(null);

export const initWeb3Atom = atom(null, async (get, set) => {
  if (get(AccountAtom) !== null) return;
  try {
    set(LoadingInitWeb3Atom, true);
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      set(MissingMetaMaskAtom, true);
      return;
    }

    console.log("We have the ethereum object", ethereum);

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      set(AccountAtom, account);
    } else {
      console.log("No authorized account found");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const hasherContract = new ethers.Contract(
      hasherContractAddress,
      hasher.abi,
      signer
    );

    set(SignerAtom, signer);
    set(hasherContractAtom, hasherContract);
  } catch (error) {
    console.log(error);
  } finally {
    set(LoadingInitWeb3Atom, false);
  }
});

export const connectWalletAtom = atom(null, async (_, set) => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);
    set(AccountAtom, accounts[0]);
  } catch (error) {
    console.log(error);
  }
});
