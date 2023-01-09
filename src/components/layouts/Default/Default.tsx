import { FC, ReactNode } from "react";

import Head from "next/head";

import { Footer, HeaderPage } from "..";
import styles from "../../../styles/Default.module.css";
import { useCurrentUrl } from "../../../hooks/useCurrentUrl";

const Default: FC<{ children: ReactNode; pageName: string }> = ({ children, pageName }) => {
    const { isHome } = useCurrentUrl();

    return (
        <div className={styles.main}>
            <Head>
                <title>{`${pageName} | Lepricon App`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <HeaderPage />

            <div className={styles.content}>{children}</div>
            {isHome && <Footer />}
        </div>
    );
};

export default Default;
