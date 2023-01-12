import { URL } from "../data/constant";

export const useBoostAPI = () => {
    const setBoost = async (account: string, nftContractAddress: string, tokenId: number, boost: number) => {
        const res = await fetch(`${URL}api/setNftStatus/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                account: account,
                nftContractAddress: nftContractAddress,
                tokenId: tokenId,
                boost: boost,
            }),
        });
        console.log("res", res);
    };

    const resetBoostInDb = async (account: string, nftContractAddress: string, tokenId: number, status: boolean) => {
        const res = await fetch(`${URL}api/resetNftStatus/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                account: account,
                nftContractAddress: nftContractAddress,
                tokenId: tokenId,
                status: status,
            }),
        });
        console.log("res", res);
    };

    return { setBoost, resetBoostInDb };
};
