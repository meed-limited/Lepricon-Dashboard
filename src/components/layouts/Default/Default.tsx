import { FC, ReactNode } from "react";

import Head from "next/head";

import { HeaderPage } from "..";
import styles from "../../../styles/Default.module.css";

const Default: FC<{ children: ReactNode; pageName: string }> = ({ children, pageName }) => (
    <div className={styles.main}>
        <Head>
            <title>{`${pageName} | Lepricon App`}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <HeaderPage />

        <div className={styles.content}>{children}</div>
    </div>
);

export default Default;
