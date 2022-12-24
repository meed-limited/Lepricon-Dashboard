import { BigNumber, utils } from "ethers";

export const formatNumber = (num: number): BigNumber => {
    return utils.parseUnits(num.toString(), 18);
};

export const parseNumber = (num: BigNumber): number => {
    return Number(num) / 10 ** 18;
};
