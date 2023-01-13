import { URL } from "../data/constant";

export const useBoostAPI = () => {
    const setBoost = async (account: string, nftContractAddress: string, tokenId: number, boost: number) => {
        const res = await fetch(`${URL}api/setNftStatus/`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account: account,
                nftContractAddress: nftContractAddress,
                tokenId: tokenId,
                boost: boost,
            }),
        });
        const data = await res.json();
        console.log("setBoost response:", data);
    };

    const resetBoostInDb = async (account: string, nftContractAddress: string, tokenId: number, status: boolean) => {
        const res = await fetch(`${URL}api/resetNftStatus/`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account: account,
                nftContractAddress: nftContractAddress,
                tokenId: tokenId,
                status: status,
            }),
        });
        const data = await res.json();
        console.log("resetBoostInDb response:", data);
    };

    return { setBoost, resetBoostInDb };
};
