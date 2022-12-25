type MenuItem = Required<MenuProps>["items"][number];

interface AddressProps {
    style: CSSProperties | undefined;
    avatar: string;
    size: number | undefined;
    copyable: boolean;
    account: string;
}

type ConnectModalProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};

interface Web3Data {
    userBalances: React.SetStateAction<UserBalances> | undefined;
    userNFTs: React.SetStateAction<Nfts | undefined>;
    stakes: StakingSummaryStructWithStatus | undefined;
    syncWeb3: () => void;
}
