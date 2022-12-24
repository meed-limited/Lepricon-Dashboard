import { Layout } from "antd";

import { FC } from "react";

const styles = {
    footer: {
        position: "fixed",
        textAlign: "center",
        width: "100%",
        bottom: "0",
        color: "white",
        backgroundColor: "transparent",
    },
} as const;

const links = {
    github: "https://github.com/Pedrojok01/CryptoCats/",
};

const { Footer } = Layout;

const FooterPage: FC = () => {
    return (
        <Footer style={styles.footer}>
            <div style={{ display: "block" }}>
                Please leave a ⭐️ on this{" "}
                <a href="https://github.com/Pedrojok01/Web3-Boilerplate" target="_blank" rel="noopener noreferrer">
                    boilerplate
                </a>
                , if you like it!
            </div>
        </Footer>
    );
};

export default FooterPage;
