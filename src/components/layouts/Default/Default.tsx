import { FC, ReactNode, useState } from "react";

import Head from "next/head";

import { Footer, HeaderPage } from "..";
import { useCurrentUrl } from "../../../hooks";
import styles from "../../../styles/Default.module.css";
import { AdminPane } from "../../elements";

const Default: FC<{ children: ReactNode; pageName: string }> = ({ children, pageName }) => {
    const { isHome } = useCurrentUrl();

    const [isAdminPaneOpen, setIsAdminPaneOpen] = useState<boolean>(true);

    return (
        <div className={styles.main}>
            <Head>
                <title>{`${pageName} | Lepricon App`}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <HeaderPage setAdminPane={setIsAdminPaneOpen} />

            <div className={styles.content}>
                {isAdminPaneOpen ? <AdminPane setAdminPane={setIsAdminPaneOpen} /> : <>{children}</>}
            </div>

            {isHome && <Footer />}
        </div>
    );
};

export default Default;
