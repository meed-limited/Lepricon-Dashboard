import { NextPage } from "next";

import { Default } from "../components/layouts";
import Pool from "../components/templates/pool/Pool";

const PoolPage: NextPage = () => {
    return (
        <Default pageName="Factory">
            <Pool />
        </Default>
    );
};

export default PoolPage;
