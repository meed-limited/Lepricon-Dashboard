import { Dispatch, SetStateAction, useState } from "react";

import { useUserData } from "../../../../context/UserContextProvider";
import { useWriteContract } from "../../../../hooks";
import { useBoostAPI } from "../../../../hooks/useBoostAPI";
import { getBoostAttributes } from "../../../../utils/getNftAttributes";
import { openNotification } from "../../../../utils/notifications";

export const useBoostAction = () => {
    const { address, boostStatus, syncWeb3 } = useUserData();
    const { setBoost, resetBoostInDb } = useBoostAPI();
    const { resetBoost } = useWriteContract();
    const [loading, setLoading] = useState<boolean>(false);

    const applyNFTboost = async (nft: Nft) => {
        setLoading(true);
        if (address && nft) {
            const boost = parseInt(getBoostAttributes(nft).toString());
            await setBoost(address, nft.token_address, Number(nft.token_id), boost).then(() => {
                syncWeb3();
                setLoading(false);
                const title = "Boost status set!";
                const msg = `Your boost status has been successfully set.`;
                openNotification("success", title, msg);
            });
        } else setLoading(false);
    };

    const removeNftBoost = async (setSelectedNFT: Dispatch<SetStateAction<Nft | undefined>>) => {
        setLoading(true);
        if (boostStatus) {
            const id = boostStatus?.tokenId;
            const nftAddress = boostStatus?.NftContractAddress;
            await resetBoost()
                .then(() => {
                    resetBoostInDb(address as string, nftAddress, id, false);
                    setSelectedNFT(undefined);
                    syncWeb3();
                    setLoading(false);
                })
                .catch((err: any) => {
                    setLoading(false);
                    console.log(err);
                });
        }
    };

    return { applyNFTboost, removeNftBoost, loading };
};
