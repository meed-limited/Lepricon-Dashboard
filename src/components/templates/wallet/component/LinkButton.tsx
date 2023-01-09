import { FC } from "react";

import { Button } from "antd";
import Link from "next/link";

import styles from "../../../../styles/Wallet.module.css";

const LinkButton: FC<LinkButtonProps> = ({ title, link }) => {
    return (
        <>
            {link !== null && (
                <div className={styles.LinkButtonMain}>
                    <>
                        {title === "Available" ? (
                            <Link href={link} target="_blank" rel="noopener noreferrer">
                                <Button type="primary" className={styles.goButtonOutline}>
                                    Go
                                </Button>
                            </Link>
                        ) : (
                            <Link href={link}>
                                <Button type="primary" className={styles.goButtonOutline}>
                                    Go
                                </Button>
                            </Link>
                        )}
                    </>
                </div>
            )}
        </>
    );
};

export default LinkButton;
