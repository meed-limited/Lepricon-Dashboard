import React from "react";

import {
    AreaChartOutlined,
    CaretRightOutlined,
    CustomerServiceOutlined,
    HomeOutlined,
    PieChartOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";

const useMenuItems = () => {
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

    const items: MenuProps["items"] = [
        {
            label: (
                <Link href="/" className="dropdown-menu-items">
                    <>
                        <HomeOutlined />
                        <span>Home</span>
                        <CaretRightOutlined />
                    </>
                </Link>
            ),
            key: "0",
        },
        {
            label: (
                <Link href="/wallet" className="dropdown-menu-items">
                    <>
                        <WalletOutlined />
                        <span>Wallet</span>
                        <CaretRightOutlined color="#75e287" />
                    </>
                </Link>
            ),
            key: "1",
        },
        {
            label: (
                <Link href="/staking" className="dropdown-menu-items">
                    <AreaChartOutlined />
                    <span>Staking</span>
                    <CaretRightOutlined />
                </Link>
            ),
            key: "2",
        },
        {
            label: (
                <Link href="/pool/" className="dropdown-menu-items">
                    {" "}
                    <>
                        <PieChartOutlined />
                        <span>Pool</span>
                        <CaretRightOutlined />
                    </>
                </Link>
            ),
            key: "3",
        },
        {
            label: (
                <Link
                    href="https://lepricon.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-menu-items"
                >
                    <>
                        <CustomerServiceOutlined />
                        <span>Support</span>
                        <CaretRightOutlined />
                    </>
                </Link>
            ),
            key: "4",
        },
    ];

    return { menuItems, items };
};

export default useMenuItems;
