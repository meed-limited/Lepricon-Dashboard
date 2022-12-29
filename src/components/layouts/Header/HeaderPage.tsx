import { Layout, Menu } from "antd";
import Link from "next/link";

import { useWindowWidthAndHeight } from "../../../hooks";
import { ChainVerification, ConnectButton } from "../../elements";
import styles from "../../../styles/Header.module.css";
import Image from "next/image";
import LepriconLogo_Black from "/public/images/LepriconLogo_Black.png";

const { Header } = Layout;

const HeaderPage = () => {
    const { isMobile } = useWindowWidthAndHeight();

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
        type?: "group"
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
            type,
        } as MenuItem;
    }

    const menuItems = [
        getItem(<Link href="/wallet">Wallet</Link>, "wallet"),
        getItem(<Link href="/staking">Staking</Link>, "staking"),
        getItem(<Link href="/pool">Pool</Link>, "pool"),
        getItem(
            <Link href="https://lepricon.io/" target="_blank" rel="noreferrer">
                Support
            </Link>,
            "support"
        ),
    ];

    return (
        <>
            <ChainVerification />
            <Header className={styles.main}>
                <Link href="/">
                    <Logo />
                </Link>
                <Menu items={menuItems} mode="horizontal" className={styles.menuItems} />
                <ConnectButton />
            </Header>
        </>
    );
};

export const Logo = () => {
    return <Image src={LepriconLogo_Black.src} alt="LepriconLogo_Black" width="140" height="40" />;
};

export default HeaderPage;
