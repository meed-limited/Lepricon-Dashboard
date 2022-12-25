import * as React from "react";

import type { AppProps } from "next/app";
import NextHead from "next/head";
import { WagmiConfig } from "wagmi";

import { client } from "../wagmi";
import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <WagmiConfig client={client}>
            <NextHead>
                <title>Lepricon App</title>
            </NextHead>
            {mounted && <Component {...pageProps} />}
        </WagmiConfig>
    );
}

export default App;
