import { SetStateAction, useEffect, useState } from "react";

import { MenuOutlined } from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";

import { useWindowWidthAndHeight } from "../../../hooks";
import styles from "../../../styles/Header.module.css";
import { ChainVerification, ConnectButton } from "../../elements";

import LepriconLogo_Black from "/public/images/LepriconLogo_Black.png";

import useMenuItems from "./useMenuItems";

const { Header } = Layout;

const HeaderPage = () => {
    const { isMobile } = useWindowWidthAndHeight();
    const { menuItems, items } = useMenuItems();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [current, setCurrent] = useState("wallet");

    const onClick = (e: { key: SetStateAction<string> }) => {
        setCurrent(e.key);
    };

    const openMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        if (window.location.href.indexOf("wallet") > -1 && current !== "wallet") setCurrent("wallet");
        else if (window.location.href.indexOf("staking") > -1 && current !== "staking") setCurrent("staking");
        else if (window.location.href.indexOf("pool") > -1 && current !== "pool") setCurrent("pool");
        return;
    }, [current]);

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
                        <Menu
                            onClick={onClick}
                            items={menuItems}
                            mode="horizontal"
                            selectedKeys={[current]}
                            className={styles.menuItems}
                        />
                    </>
                )}
                <ConnectButton />
            </Header>
        </>
    );
};

export const Logo = () => {
    return (
        <div className={styles.logo}>
            <Image src={LepriconLogo_Black.src} alt="LepriconLogo_Black" width="140" height="40" />
        </div>
    );
};

export default HeaderPage;
