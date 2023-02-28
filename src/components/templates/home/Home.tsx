import { lazy, Suspense } from "react";

import Image from "next/image";
import Link from "next/link";
import LuckyLepricat from "public/nft/LuckyLepricat.png";
import { useAccount } from "wagmi";

import styles from "../../../styles/Home.module.css";
import { ButtonAction, ConnectButton } from "../../elements";

const ParticleBackground = lazy(() => import("./ParticlesBackground"));

const Home = () => {
    const { isConnected } = useAccount();

    return (
        <div className={styles.main}>
            <Suspense>
                <ParticleBackground />
            </Suspense>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    Lepricon Wallet
                    <br />
                    <ul className={styles.subtitle}>
                        <li>All-In-One Dashboard</li>
                        <li>Transfer, or Sell your NFTs</li>
                        <li>Stake your tokens and boost your yield!</li>
                    </ul>
                </h1>
                {isConnected ? (
                    <div style={{ width: "60%", margin: "auto" }}>
                        <Link href="/wallet">
                            {/* eslint-disable-next-line */}
                            <ButtonAction title="Go To Dashboard" action={() => {}} />
                        </Link>
                    </div>
                ) : (
                    <ConnectButton />
                )}
            </div>

            <div className={styles.imageContainer}>
                <Image src={LuckyLepricat} alt="Lucky Lepricat" className={styles.image} priority={true} />
            </div>
        </div>
    );
};

export default Home;
