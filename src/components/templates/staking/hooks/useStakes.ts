import { useEffect, useState } from "react";
import { useUserData } from "../../../../context/UserContextProvider";
import {
    getDetailPerUser,
    init_detailPerUser,
    Init_stakesPerPool,
    rewardPerUser,
    validStakePerPool,
} from "../../../../utils/getStakesInfo";

export const useStakes = () => {
    const { stakeSummary } = useUserData();
    const [userStakes, setUserStakes] = useState<DetailPerUser>(init_detailPerUser);
    const [stakesPerPool, setStakesPerPool] = useState<SortedStakes>(Init_stakesPerPool);
    const [totalReward, setTotalReward] = useState<number>(0);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (!stakeSummary) {
            setInitialLoading(true);
        } else {
            setUserStakes(getDetailPerUser(stakeSummary.stakes));
            setInitialLoading(false);
        }
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeSummary]);

    const perPool = (details: DetailPerUser, lock: number): StakesPerPool => {
        return { stakes: validStakePerPool(details, lock), reward: rewardPerUser(details, lock) };
    };

    useEffect(() => {
        const stakesPerPool = {
            no_lock: perPool(userStakes, 0),
            three: perPool(userStakes, 3),
            six: perPool(userStakes, 6),
            twelve: perPool(userStakes, 12),
        };
        const allRewards = Number((userStakes.reward.total.claimable + userStakes.reward.total.locked).toFixed(4));

        setTotalReward(allRewards ? allRewards : 0);
        setStakesPerPool(stakesPerPool);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userStakes]);

    return { stakesPerPool, totalReward, initialLoading };
};
