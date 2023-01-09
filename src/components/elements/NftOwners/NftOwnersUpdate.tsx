import { URL } from "../../../data/constant";

const NftOwnersUpdate = () => {
    const initializeOwners = async () => {
        const owners = await getOwners();
        if (!owners || owners.length === 0 || owners === undefined) {
            await fetch(`${URL}/api/initializeNftOwners`);
        }
    };

    const getOwners = async () => {
        const res: Response = await fetch(`${URL}/api/getNftOwners`);
        const data: NftOwnersResponse = await res.json();
        return data.data;
    };

    initializeOwners();

    return null;
};

export default NftOwnersUpdate;
