import { useState, useEffect } from "react";

import useReadContract from "./useReadContract";
import { useUserData } from "../context/UserContextProvider";

export const useCurrentOwner = () => {
    const { address } = useUserData();
    const { getOwnerAddress } = useReadContract();

    const [currentOwner, setCurrentOwner] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchCurrentOwner = async () => {
            const owner = await getOwnerAddress();
            setCurrentOwner(owner);
            setIsOwner(address?.toLowerCase() === owner.toLowerCase());
        };

        fetchCurrentOwner();
    }, [address, getOwnerAddress]);

    return { currentOwner, isOwner };
};
