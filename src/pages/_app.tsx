import * as React from "react";

import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { WagmiConfig } from "wagmi";

import { UserDataProvider } from "../context/UserContextProvider";
import { client } from "../wagmi";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <WagmiConfig client={client}>
            <UserDataProvider>
                <NextHead>
                    <title>Lepricon App</title>
                </NextHead>
                <div className={inter.className} style={{ fontFamily: "Sora, sans-serif" }}>
                    {mounted && <Component {...pageProps} />}
                </div>
            </UserDataProvider>
        </WagmiConfig>
    );
}

export default App;
