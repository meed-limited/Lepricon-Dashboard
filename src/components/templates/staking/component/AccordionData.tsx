import { FC } from "react";

import styles from "../../../../styles/Staking.module.css";

type AccordionDataProps = {
    title: string;
    data: string | number;
};

const AccordionData: FC<AccordionDataProps> = ({ title, data }) => {
    return (
        <div>
            <div className={styles.accordeonItemsTop}>{data}</div>
            <div className={styles.accordeonItemsSub}>{title}</div>
        </div>
    );
};

export default AccordionData;
