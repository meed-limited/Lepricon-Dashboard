import { useState } from "react";
import { FileSearchOutlined } from "@ant-design/icons";

import { BigNumber } from "ethers";

import { TOKEN_ABI, NFT_ABI, STAKING_ABI } from "../data/abis";
import { getContractAddresses } from "../data/constant";
import { getExplorer } from "../utils/getExplorerByChain";
import { useContract } from "./useContract";
import { LepriconStaking, TestToken } from "../../hardhat/typechain-types";
import { openNotification } from "../utils/notifications";
import { useUserData } from "../context/UserContextProvider";
import { LepriTest } from "../../types/LepriTest";

const useWriteContract = () => {
    const { address, tokenName } = useUserData();
    const { token, nft, staking } = getContractAddresses();
    const tokenInstance: TestToken = useContract(token, TOKEN_ABI);
    const stakingInstance: LepriconStaking = useContract(staking, STAKING_ABI);
    const nftInstance: LepriTest = useContract(nft, NFT_ABI);

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

    /* Set Token Allowance:
     ***************************/
    const approveNft = async () => {
        try {
            const tx = await nftInstance.setApprovalForAll(staking, true);
            await tx.wait(2);
            const title = "NFT Approval set";
            const msg = `Allowance succesfully set.`;
            openNotification("success", title, msg);
        } catch (error: any) {
            const title = "NFT Approval denied";
            const msg = "Something went wrong while setting the allowance. Please try again.";
            openNotification("error", title, msg);
            console.log(error.reason ? error.reason : error.message);
        }
    };

    /* Set Token Allowance:
     ***************************/
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

    return { approveToken, approveNft, transferNft, stake, unstake };
};

export default useWriteContract;
