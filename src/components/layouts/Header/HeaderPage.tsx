import { Dropdown, Layout, Menu } from "antd";
import Link from "next/link";

import { useWindowWidthAndHeight } from "../../../hooks";
import { ChainVerification, ConnectButton } from "../../elements";
import styles from "../../../styles/Header.module.css";
import Image from "next/image";
import LepriconLogo_Black from "/public/images/LepriconLogo_Black.png";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import useMenuItems from "./useMenuItems";

const { Header } = Layout;

const HeaderPage = () => {
    const { isMobile } = useWindowWidthAndHeight();
    const { menuItems, items } = useMenuItems();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const openMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <>
            <ChainVerification />
            <Header className={styles.main}>
                {isMobile ? (
                    <Dropdown open={isMenuOpen} menu={{ items }}>
                        <MenuOutlined style={{ fontSize: "30px", color: "#11631f" }} onClick={openMenu} />
                    </Dropdown>
                ) : (
                    <>
                        <Link href="/">
                            <Logo />
                        </Link>
                        <Menu items={menuItems} mode="horizontal" className={styles.menuItems} />
                    </>
                )}
                <ConnectButton />
            </Header>
        </>
    );
};

export const Logo = () => {
    return <Image src={LepriconLogo_Black.src} alt="LepriconLogo_Black" width="140" height="40" />;
};

export default HeaderPage;
