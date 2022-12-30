import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "antd";

import { ConnectButton } from "../../elements";
import styles from "../../../styles/Home.module.css";

import { useCallback } from "react";
// import Particles from "react-particles";
// import type { Container, Engine } from "tsparticles-engine";
// import { loadFull } from "tsparticles";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadTrianglesPreset } from "tsparticles-preset-triangles";
import particlesOptions from "./particles.json";
import Image from "next/image";

import LuckyLepricat from "public/nft/LuckyLepricat.png";

const Home = () => {
    const { isConnected } = useAccount();

    const particlesInit = useCallback(async (engine: Engine): Promise<void> => {
        console.log(engine);
        await loadTrianglesPreset(engine);
    }, []);

    return (
        <div className={styles.main}>
            <Particles options={particlesOptions} init={particlesInit} className={styles.particles} />
            <div className={styles.content}>
                <h1 className={styles.title}>
                    Lepricon Wallet
                    <br />
                    <h4 className={styles.subtitle}>
                        <ul>
                            <li>Check your tokens</li>
                            <li>Check, Transfer, or Sell your NFTs</li>
                            <li>Stake your tokens and add an NFT boost!</li>
                        </ul>
                    </h4>
                </h1>
                {isConnected ? (
                    <Link href="/wallet">
                        <Button>Check your inventory now</Button>
                    </Link>
                ) : (
                    <ConnectButton />
                )}
            </div>

            <div className={styles.imageContainer}>
                <Image src={LuckyLepricat} alt="Lucky Lepricat" className={styles.image} />
            </div>
        </div>
    );
};

export default Home;
