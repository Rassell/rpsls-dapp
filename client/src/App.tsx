import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import { Home, CreateGame, JoinGame, SolveGame } from "./pages";
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
            {missingMetaMask ? (
              <Route
                index
                element={
                  <Center className="home">
                    <div>Please install metamask</div>
                  </Center>
                }
              />
            ) : (
              <>
                <Route index element={<Home />} />
                <Route
                  path="createGame"
                  element={renderContent(<CreateGame />)}
                />
                <Route path="joinGame" element={renderContent(<JoinGame />)} />
                <Route
                  path="solveGame"
                  element={renderContent(<SolveGame />)}
                />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                  }
                />
              </>
            )}
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}
