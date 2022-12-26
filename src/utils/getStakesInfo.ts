import { LepriconStaking } from "../../hardhat/typechain-types";

export const getDetailPerUser = (stakes: LepriconStaking.StakeStructOutput[]) => {
    let detailPerUser: DetailPerUser = {
        stakes_noLock: [],
        stakes_3months: [],
        stakes_6months: [],
        stakes_12months: [],
        reward: {
            noLock: 0,
            threeMonths: {
                claimable: 0,
                locked: 0,
            },
            sixMonths: {
                claimable: 0,
                locked: 0,
            },
            twelveMonths: {
                claimable: 0,
                locked: 0,
            },
            total: {
                claimable: 0,
                locked: 0,
            },
        },
    };

    const formattedStakes: FormattedStakeStruct[] = stakes.map((stake: StakeStructOutput) => {
        return {
            user: stake[0],
            amount: stake[1],
            since: stake[2],
            timeLock: stake[3],
            unlockTime: stake[4],
            claimable: stake[5],
        };
    });

    for (let i = 0; i < formattedStakes.length; i++) {
        var timelock = Number(formattedStakes[i].timeLock);
        // No-lock pool
        if (timelock === 0) {
            if (Number(formattedStakes[i].amount) !== 0) {
                detailPerUser.stakes_noLock.push(sortStake(formattedStakes[i], i));
                detailPerUser.reward.noLock += Number(formattedStakes[i].claimable) / 10 ** 18;
            }

            // 3 months lock pool
        } else if (timelock === 7862400) {
            if (Number(formattedStakes[i].amount) !== 0) {
                detailPerUser.stakes_3months.push(sortStake(stakes[i], i));

                if (formattedStakes[i].unlockTime <= formattedStakes[i].since + formattedStakes[i].timeLock) {
                    detailPerUser.reward.threeMonths.claimable += Number(formattedStakes[i].claimable) / 10 ** 18;
                } else {
                    detailPerUser.reward.threeMonths.locked += Number(formattedStakes[i].claimable) / 10 ** 18;
                }
            }

            //6 months lock pool
        } else if (timelock === 15724800) {
            if (Number(formattedStakes[i].amount) !== 0) {
                detailPerUser.stakes_6months.push(sortStake(stakes[i], i));

                if (formattedStakes[i].unlockTime <= formattedStakes[i].since + formattedStakes[i].timeLock) {
                    detailPerUser.reward.sixMonths.claimable += Number(formattedStakes[i].claimable) / 10 ** 18;
                } else {
                    detailPerUser.reward.sixMonths.locked += Number(formattedStakes[i].claimable) / 10 ** 18;
                }
            }

            // 12 months lock pool
        } else if (timelock === 31449600) {
            if (Number(formattedStakes[i].amount) !== 0) {
                detailPerUser.stakes_12months.push(sortStake(formattedStakes[i], i));

                if (formattedStakes[i].unlockTime <= formattedStakes[i].since + formattedStakes[i].timeLock) {
                    detailPerUser.reward.twelveMonths.claimable += Number(formattedStakes[i].claimable) / 10 ** 18;
                } else {
                    detailPerUser.reward.twelveMonths.locked += Number(formattedStakes[i].claimable) / 10 ** 18;
                }
            }
        }
    }

    detailPerUser.reward.total.claimable =
        detailPerUser.reward.noLock +
        detailPerUser.reward.threeMonths.claimable +
        detailPerUser.reward.sixMonths.claimable +
        detailPerUser.reward.twelveMonths.claimable;

    detailPerUser.reward.total.locked =
        detailPerUser.reward.threeMonths.locked +
        detailPerUser.reward.sixMonths.locked +
        detailPerUser.reward.twelveMonths.locked;

    return detailPerUser;
};

const sortStake = (stake: FormattedStakeStruct, i: number): ParsedStakeStruct => {
    let temp = {
        user: stake.user,
        index: i,
        amount: Number(stake.amount / 10 ** 18),
        since: stake.since.toString(),
        timeLock: Number(stake.timeLock),
        dayLock: Math.floor(Number(stake.timeLock) / (3600 * 24)),
        unlockTime: Number(stake.unlockTime),
        cumulatedReward: Number(stake.claimable / 10 ** 18),
    };
    return temp;
};

export const validStakePerPool = (stake: DetailPerUser, lock: number) => {
    let temp = stakePerPool(stake, lock);
    let stakes: ParsedStakeStruct[] = [];
    let validStake = {
        stakes: stakes,
        total: 0,
    };
    for (let i = 0; i < temp.length; i++) {
        if (Number(temp[i].amount) !== 0) {
            validStake.stakes.push(temp[i]);
            validStake.total = validStake.total + temp[i].amount;
        }
    }
    return validStake;
};

export const stakePerPool = (stake: DetailPerUser, lock: number): ParsedStakeStruct[] => {
    switch (lock) {
        case 0:
            return stake.stakes_noLock;
        case 3:
            return stake.stakes_3months;
        case 6:
            return stake.stakes_6months;
        case 12:
            return stake.stakes_12months;
        default:
            return stake.stakes_noLock;
    }
};

export const rewardPerUser = (stake: DetailPerUser, lock: number): PoolReward => {
    switch (lock) {
        case 0:
            return stake.reward.noLock;
        case 3:
            return stake.reward.threeMonths;
        case 6:
            return stake.reward.sixMonths;
        case 12:
            return stake.reward.twelveMonths;
        default:
            return stake.reward.noLock;
    }
};
