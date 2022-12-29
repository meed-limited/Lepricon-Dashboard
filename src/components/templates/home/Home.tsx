import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "antd";

import { useWindowWidthAndHeight } from "../../../hooks";
import { ConnectButton } from "../../elements";
import styles from "../../../styles/Home.module.css";

const Home = () => {
    const { isConnected } = useAccount();
    const { isMobile } = useWindowWidthAndHeight();
    return (
        <div className={styles.content}>
            <div className={styles.main}>
                <h1 className={styles.title}>
                    Lepricon Wallet
                    <br />
                    Check your tokens / NFTS; & Stake your Tokens!
                </h1>
                {isConnected ? (
                    <Link href="/wallet">
                        <Button>Check your inventory now</Button>
                    </Link>
                ) : (
                    <ConnectButton />
                )}
            </div>
        </div>
    );
};

export default Home;
