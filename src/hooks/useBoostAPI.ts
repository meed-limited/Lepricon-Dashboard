import { URL } from "../data/constant";

export const useBoostAPI = () => {
    const setBoost = async (account: string, nftContractAddress: string, tokenId: number, boost: number) => {
        const body = JSON.stringify({
            account: account,
            nftContractAddress: nftContractAddress,
            tokenId: tokenId,
            boost: boost,
        });
        const res: Response = await fetch(`${URL}/api/setNftStatus/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });
        console.log(res);
    };

    const resetBoostInDb = async (account: string, nftContractAddress: string, tokenId: number, status: boolean) => {
        const body = JSON.stringify({
            account: account,
            nftContractAddress: nftContractAddress,
            tokenId: tokenId,
            status: status,
        });

        const res: Response = await fetch(`${URL}/api/resetNftStatus/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });
        console.log(res);
    };

    return { setBoost, resetBoostInDb };
};
