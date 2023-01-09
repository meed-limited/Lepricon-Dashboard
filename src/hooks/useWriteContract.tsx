import { FileSearchOutlined } from "@ant-design/icons";
import { BigNumber, providers, Contract } from "ethers";

import { LepriconStaking, TestToken } from "../../hardhat/typechain-types";
import { LepriTest } from "../../types/LepriTest";
import { useUserData } from "../context/UserContextProvider";
import { TOKEN_ABI, NFT_ABI, STAKING_ABI } from "../data/abis";
import { getContractAddresses } from "../data/constant";
import { getExplorer } from "../utils/getExplorerByChain";
import { openNotification } from "../utils/notifications";
import { useContract } from "./useContract";

const useWriteContract = () => {
    const { address, tokenName } = useUserData();
    const { token, nft, staking } = getContractAddresses();
    const tokenInstance: TestToken = useContract(token, TOKEN_ABI);
    const stakingInstance: LepriconStaking = useContract(staking, STAKING_ABI);

    const provider = new providers.Web3Provider(window?.ethereum as any, "any");
    const signer = provider.getSigner();
    const nftInstance = new Contract(nft, NFT_ABI, signer) as LepriTest;

    // 0xd8b96389d20Ade29a4F05777716688c097540f9d
    // 0xF0eEaAB7153Ff42849aCb0E817efEe09fb078C1b

    /* Set Token Allowance:
     ***************************/
    const approveToken = async (allowance: BigNumber | string) => {
        try {
            const tx = await tokenInstance.approve(staking, allowance.toString());
            await tx.wait(2);
            const value = parseInt(allowance.toString()) / 10 ** 18;
            const title = "Token Approval set";
            const msg = `Allowance succesfully set to ${value}.`;
            openNotification("success", title, msg);
        } catch (error: any) {
            const title = "Token Approval denied";
            const msg = "Something went wrong while setting the allowance. Please try again.";
            openNotification("error", title, msg);
            console.log(error.reason ? error.reason : error.message);
        }
    };

    /* Transfer an NFT to the receiver address:
     *******************************************/
    const transferNft = async (nft: Nft, receiver: string) => {
        try {
            const tx = await nftInstance.transferFrom(address as string, receiver, nft.token_id);
            await tx.wait(2);
            const title = "NFT Transfered";
            const msg = `Your nft has been succesfully transfered.`;
            openNotification("success", title, msg);
            return true;
        } catch (error: any) {
            const title = "NFT Transfer Failed";
            const msg = "Something went wrong while transfering your NFT. Please try again.";
            openNotification("error", title, msg);
            console.log(error.reason ? error.reason : error.message);
            return false;
        }
    };

    /* Stake the specified amount :
     *******************************/
    const stake = async (amount: BigNumber, vault: number): Promise<any> => {
        try {
            const tx = await stakingInstance.stake(amount, vault);
            const receipt = await tx.wait(2);
            const link = `${getExplorer()}tx/${receipt.transactionHash}`;
            const value = parseInt(amount.toString()) / 10 ** 18;
            const title = "Stake Successfully";
            const msg = (
                <>
                    {value} {tokenName} have been successfully staked{" "}
                    {vault === 0 ? "in the NO-LOCK vault" : `for ${vault} month(s)`}.<br></br>
                    <a href={link} target="_blank" rel="noreferrer noopener">
                        View in explorer: &nbsp;
                        <FileSearchOutlined style={{ transform: "scale(1.3)", color: "purple" }} />
                    </a>
                </>
            );

            openNotification("success", title, msg);
            return receipt;
        } catch (error: any) {
            const title = "An error occured";
            const msg = error.reason ? error.reason : "An unexpected error occured while staking.";
            openNotification("error", title, msg);
            return error.reason ? error.reason : error.message ? error.message : "Unexpected error";
        }
    };

    /* Unstake the specified amount :
     ********************************/
    const unstake = async (amount: BigNumber, index: number): Promise<any> => {
        try {
            const tx = await stakingInstance.withdrawStake(amount, index);
            const receipt = await tx.wait(2);
            const link = `${getExplorer()}tx/${receipt.transactionHash}`;
            const title = "Withdrawn Successfully!";
            const msg = (
                <>
                    Your stake has been successfully withdrawn and sent to your wallet.
                    <br></br>
                    <a href={link} target="_blank" rel="noreferrer noopener">
                        View in explorer: &nbsp;
                        <FileSearchOutlined style={{ transform: "scale(1.3)", color: "purple" }} />
                    </a>
                </>
            );
            openNotification("success", title, msg);
            return receipt;
        } catch (error: any) {
            const title = "An error occured";
            const msg = error.reason ? error.reason : "Something went wrong while withdrawing your stake.";
            openNotification("error", title, msg);
            return error.reason ? error.reason : error.message ? error.message : "Unexpected error";
        }
    };

    /* Reset the Boost status of a user:
     ************************************/
    const resetBoost = async () => {
        try {
            const tx = await stakingInstance.resetNftStatus(address as string);
            await tx.wait(2);
            const title = "Boost status cancelled";
            const msg = `Your boost status has been successfully removed.`;
            openNotification("success", title, msg);
        } catch (error: any) {
            const title = "Unexpected error";
            const msg = "Something went wrong while resetting your boost status. Please try again.";
            openNotification("error", title, msg);
            return error.reason ? error.reason : error.message ? error.message : "Unexpected error";
        }
    };

    return { approveToken, transferNft, stake, unstake, resetBoost };
};

export default useWriteContract;
