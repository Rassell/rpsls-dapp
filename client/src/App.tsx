import { ChakraProvider, Spinner } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import { Home, CreateGame, JoinGame } from "./pages";
import {
  LoadingInitWeb3Atom,
  initWeb3Atom,
  AccountAtom,
  connectWalletAtom,
  MissingMetaMaskAtom,
} from "./state/wallet";

export default function App() {
  const [account] = useAtom(AccountAtom);
  const [loading] = useAtom(LoadingInitWeb3Atom);
  const [missingMetaMask] = useAtom(MissingMetaMaskAtom);
  const [, initWeb3] = useAtom(initWeb3Atom);
  const [, connectWallet] = useAtom(connectWalletAtom);

  useEffect(() => {
    async function init() {
      await initWeb3();
    }

    init();
  }, [initWeb3]);

  const renderContent = (childrenToRender: JSX.Element) => {
    if (missingMetaMask) {
      return <div>Please install metamask</div>;
    }

    if (loading) {
      return <Spinner />;
    }

    if (!account) {
      return (
        <>
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
          >
            Connect Wallet To Get Started
          </button>
        </>
      );
    } else {
      return childrenToRender;
    }
  };

  return (
    <ChakraProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="creategame" element={renderContent(<CreateGame />)} />
            <Route path="joingame" element={renderContent(<JoinGame />)} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}
