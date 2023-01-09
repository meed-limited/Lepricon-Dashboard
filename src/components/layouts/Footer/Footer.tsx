import { FC } from "react";

import styles from "../../../styles/Header.module.css";
import SocialLinks from "../../templates/home/SocialLinks";

const Footer: FC = () => {
    return (
        <div className={styles.footer}>
            <SocialLinks />
        </div>
    );
};

export default Footer;
