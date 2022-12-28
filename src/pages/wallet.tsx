import { NextPage } from "next";

import { Default } from "../components/layouts";
import Wallet from "../components/templates/wallet/Wallet";

const WalletPage: NextPage = () => {
    return (
        <Default pageName="Wallet">
            <Wallet />
        </Default>
    );
};

export default WalletPage;
