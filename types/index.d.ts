interface UserContext {
    address?: `0x${string}` | undefined;
    chainId?: number | undefined;
    isConnected: boolean;
    tokenName: string;
    price: number;
    balances?: React.SetStateAction<UserBalances> | undefined;
    userNFTs?: React.SetStateAction<Nfts | undefined>;
    stakeSummary: LepriconStaking.StakingSummaryStructOutput;
    boostStatus?: BoostStatus | undefined;
    syncWeb3?: () => void;
}

interface Web3Data {
    tokenName: string;
    balances: React.SetStateAction<UserBalances> | undefined;
    userNFTs: React.SetStateAction<Nfts | undefined>;
    stakeSummary: LepriconStaking.StakingSummaryStructOutput;
    boostStatus: BoostStatus | undefined;
    syncWeb3: () => void;
}

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

interface UserBalances {
    native: string;
    token: string;
}

interface Nfts {
    result:
        | {
              amount?: string | undefined;
              block_number: string;
              block_number_minted: string;
              contract_type: string;
              last_metadata_sync: string;
              last_token_uri_sync: string;
              metadata?: any;
              minter_address?: string | undefined;
              name: string | null;
              owner_of: string;
              symbol?: string | null;
              token_address: string;
              token_hash: string;
              token_id: string;
              token_uri?: string | undefined;
              image?: string;
          }[]
        | undefined;
    total: number | undefined;
}

interface Nft {
    amount?: string;
    block_number: string;
    block_number_minted: string;
    contract_type: string;
    last_metadata_sync: string;
    last_token_uri_sync: string;
    metadata: NftMetadata;
    name: string;
    owner_of: string;
    symbol?: string | null;
    token_address: string;
    token_hash: string;
    token_id: string;
    token_uri: string;
    image?: string;
}

interface NftMetadata {
    attributes: any;
    description: string;
    image: string;
    name: string;
}

interface NftAttributes {
    display_type?: string;
    trait_type?: string;
    value?: string;
}

/**********************************************************
                        STAKING CONTRACT
***********************************************************/

type StakingSummaryStruct = {
    total_amount: PromiseOrValue<BigNumberish>;
    stakes: LepriconStaking.StakeStruct[];
};

type StakingSummaryStructOutput = [BigNumber, LepriconStaking.StakeStructOutput[]] & {
    total_amount: BigNumber;
    stakes: StakeStructOutput[];
};

type VaultStructOutput = [number, number, BigNumber, BigNumber] & {
    apr: number;
    timelock: BigNumber;
    totalAmountLock: BigNumber;
};

type VaultsSummaryOutput = [
    VaultStructOutput,
    VaultStructOutput,
    VaultStructOutput,
    VaultStructOutput,
    VaultStructOutput
];

type BoostStatus = [boolean, number, string, BigNumber, BigNumber] & {
    isBoost: boolean;
    boostValue: number;
    NftContractAddress: string;
    tokenId: BigNumber;
    since: BigNumber;
};

type DetailPerUser = {
    stakes_noLock: ParsedStakeStruct[];
    stakes_3months: ParsedStakeStruct[];
    stakes_6months: ParsedStakeStruct[];
    stakes_12months: ParsedStakeStruct[];
    reward: Reward;
};

type Reward = {
    noLock: number;
    threeMonths: {
        claimable: number;
        locked: number;
    };
    sixMonths: {
        claimable: number;
        locked: number;
    };
    twelveMonths: {
        claimable: number;
        locked: number;
    };
    total: {
        claimable: number;
        locked: number;
    };
};

type LockedReward = {
    claimable: number;
    locked: number;
};

type PoolReward = number | LockedReward;

type StakingSummaryStructOutput = [BigNumber, LepriconStaking.StakeStructOutput[]] & {
    total_amount: BigNumber;
    stakes: LepriconStaking.StakeStructOutput[];
};

type StakeStructOutput = [string, number, BigNumber, BigNumber, BigNumber, BigNumber] & {
    user: string;
    timeLock: number;
    amount: BigNumber;
    since: BigNumber;
    unlockTime: BigNumber;
    claimable: BigNumber;
};

type FormattedStakeStruct = {
    user: string;
    timeLock: number;
    amount: BigNumber;
    since: BigNumber;
    unlockTime: BigNumber;
    claimable: BigNumber;
};

type ParsedStakeStruct = {
    user: string;
    index: number;
    amount: number;
    since: any;
    timeLock: number;
    dayLock: number;
    unlockTime: number;
    cumulatedReward: number;
};

type StakesPerPool = {
    stakes: {
        stakes: ParsedStakeStruct[];
        total: number;
    };
    reward: PoolReward;
};

type SortedStakes = {
    no_lock: StakesPerPool;
    three: StakesPerPool;
    six: StakesPerPool;
    twelve: StakesPerPool;
};

type Stake = {
    since: any;
    amount: any;
    numberOfDays: any;
    cumulatedReward: number;
    dayLock?: any;
};

/**********************************************************
                        CMC API
***********************************************************/

interface TokenDataCMC {
    circulating_supply: number;
    cmc_rank: number;
    date_added: string;
    id: number;
    is_active: number;
    is_fiat: number;
    last_updated: string;
    max_supply: number;
    name: string;
    num_market_pairs: number;
    platform: { id: number; name: string; symbol: string; slug: string; token_address: string };
    quote: {
        USD: {
            fully_diluted_market_cap: number;
            last_updated: string;
            market_cap: number;
            market_cap_dominance: number;
            percent_change_1h: number;
            percent_change_7d: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_60d: number;
            percent_change_90d: number;
            price: number;
            tvl: null;
            volume_24h: number;
            volume_change_24h: number;
        };
    };
    self_reported_circulating_supply: null;
    self_reported_market_cap: null;
    slug: string;
    symbol: string;
    tags: [];
    total_supply: number;
    tvl_ratio: null;
}
