import { providers, Contract } from "ethers";
import { useAccount } from "wagmi";

import { LepriconStaking, TestToken } from "../../hardhat/typechain-types";
import { LepriTest } from "../../types/LepriTest";
import { TOKEN_ABI, NFT_ABI, STAKING_ABI } from "../data/abis";
import { getContractAddresses } from "../data/constant";
import { useContract } from "./useContract";

const useReadContract = () => {
    const { address } = useAccount();
    const { token, nft, staking } = getContractAddresses();
    const tokenInstance: TestToken = useContract(token, TOKEN_ABI);
    const stakingInstance: LepriconStaking = useContract(staking, STAKING_ABI);

    /* Get the staking's owner address :
     ************************************/
    const getOwnerAddress = async (): Promise<string> => {
        try {
            const owner = await stakingInstance.owner();
            return owner;
        } catch (error) {
            console.error(error);
            return "";
        }
    };

    /* Get the name of a specific TOKEN :
     ************************************/
    const getTokenName = async (): Promise<string> => {
        try {
            const symbol = await tokenInstance.symbol();
            return symbol;
        } catch (error) {
            console.error(error);
            return "";
        }
    };

    /* Get the token balance for the connected address:
     ***************************************************/
    const getTokenBalance = async () => {
        try {
            const balance = await tokenInstance.balanceOf(address as string);
            return balance.toString();
        } catch (error: any) {
            console.log(error.reason ? error.reason : error.message ? error.message : error);
            return "0";
        }
    };

    /* Check if existing allowance of ERC20 token :
     ***********************************************/
    const checkTokenAllowance = async () => {
        try {
            const allowance = await tokenInstance.allowance(address as string, staking);
            return allowance;
        } catch (error: any) {
            console.log(error.reason ? error.reason : error.message);
            return 0;
        }
    };

    /* Get all stakes for the connected address:
     ********************************************/
    const getStakes = async () => {
        try {
            const stakeSummary = await stakingInstance.hasStake(address as string);
            return stakeSummary;
        } catch (error: any) {
            console.log(error.reason ? error.reason : error.message ? error.message : error);
            return undefined;
        }
    };

    /* Get the boost status of the connected address:
     *************************************************/
    const getBoost = async () => {
        try {
            const boost = await stakingInstance.boost(address as string);
            return boost;
        } catch (error: any) {
            console.log(error.reason ? error.reason : error.message ? error.message : error);
            return undefined;
        }
    };

    /* Get APR from staking contract:
     **************************************/
    const getVaultForTimelock = async (timelock: number) => {
        try {
            const vault = await stakingInstance.vaults(timelock);
            return vault;
        } catch (error: any) {
            console.log(error.reason ? error.reason : error.message ? error.message : error);
            return undefined;
        }
    };

    /* Check if existing allowance of NFT 721 :
     ********************************************/
    const checkNftOwnership = async (account: string, tokenId: number) => {
        try {
            const provider = new providers.Web3Provider(window?.ethereum as any, "any");
            const nftInstance = new Contract(nft, NFT_ABI, provider) as LepriTest;

            const owner = await nftInstance.ownerOf(tokenId);
            if (owner.toLowerCase() === account.toLowerCase()) return true;
            return false;
        } catch (error: any) {
            console.log(error.reason ? error.reason : error.message);
            return false;
        }
    };

    return {
        getOwnerAddress,
        getTokenName,
        getTokenBalance,
        checkTokenAllowance,
        getStakes,
        getBoost,
        getVaultForTimelock,
        checkNftOwnership,
    };
};

export default useReadContract;
