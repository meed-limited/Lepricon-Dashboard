import { FC } from "react";

import { FacebookOutlined, LinkedinOutlined, TwitterOutlined, GithubOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Image from "next/image";
import discord from "public/images/discord.png";
import telegram from "public/images/telegram.png";

import styles from "../../../styles/Home.module.css";

const SocialLinks: FC = () => {
    return (
        <Text className={styles.socialContainer}>
            <a href="https://twitter.com/lepriconio" target="_blank" rel="noopener noreferrer">
                <div style={{ padding: "0 10px 0 15px" }}>
                    <TwitterOutlined className={styles.antdIcon} />
                </div>
            </a>
            <a href="http://discord.gg/lepricon" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialIcons}>
                    <Image src={discord} alt="discord" height={25} />
                </div>
            </a>
            <a href="https://t.me/lepriconio" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialIcons}>
                    <Image src={telegram} alt="telegram" height={25} />
                </div>
            </a>
            <a href="https://www.facebook.com/lepriconio" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialIcons}>
                    <FacebookOutlined className={styles.antdIcon} />
                </div>
            </a>
            <a href="https://sc.linkedin.com/company/lepricon-io" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialIcons}>
                    <LinkedinOutlined className={styles.antdIcon} />
                </div>
            </a>
            <a href="https://github.com/superultra-io/MoveMyWallet-app" target="_blank" rel="noopener noreferrer">
                <div className={styles.socialIcons}>
                    <GithubOutlined className={styles.antdIcon} />
                </div>
            </a>
        </Text>
    );
};

export default SocialLinks;
