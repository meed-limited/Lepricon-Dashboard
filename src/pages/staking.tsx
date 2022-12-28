import { NextPage } from "next";

import { Default } from "../components/layouts";
import Staking from "../components/templates/staking/Staking";

const StakingPage: NextPage = () => {
    return (
        <Default pageName="Staking">
            <Staking />
        </Default>
    );
};

export default StakingPage;
