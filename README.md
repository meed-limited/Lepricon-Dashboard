# Welcome to the NEW LEPRICON WALLET !!!

[![Stargazers](https://img.shields.io/github/stars/superultra-io/Lepricon-wallet)](https://github.com/superultra-io/Lepricon-wallet/stargazers)
[![Issues](https://img.shields.io/github/issues/superultra-io/Lepricon-wallet)](https://github.com/superultra-io/Lepricon-wallet/issues)
[![MIT License](https://img.shields.io/github/license/superultra-io/Lepricon-wallet)](https://github.com/superultra-io/Lepricon-wallet/blob/main/License)

-   Access all info in one place: NFT, tokens, Balances and more!
-   Stake your tokens in different pools, with different yields.
-   Select an NFT from a compatible collection to gain some extra staking yield!

## Description

Brain new All-in-One wallet for your favorite Lepricon ecosystem! Accessible on the Binance Smart-Chain, your Lepricon NFT on Ethereum are also compatible, thanks to our cross-chain wallet.

-   Website: coming soon...
-   Dapp: coming soon...
    <br></br>

![Preview](./preview.png)

## Installation

💿 Clone the repo and install all dependencies:

```sh
git clone https://github.com/superultra-io/Lepricon-wallet.git
cd Lepricon-wallet
yarn install
```

✏ Create a `.env` file in the main folder and provide your `appId` and `serverUrl` from Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server))
Example:

```jsx
REACT_APP_MORALIS_APPLICATION_ID = xxxxxxxxxxxx
REACT_APP_MORALIS_SERVER_URL = https://xxxxxx.grandmoralis.com:2053/server
```

🔎 Locate the file constant.js in `src/constant/constant.js` and paste your smart-contracts addresses and ABI;

```jsx
const ASSEMBLY_NFT = "your Contract Address here";
const ABI = "your Contract ABI here";
```

🚴‍♂️ Run your App:

```sh
yarn start
```
