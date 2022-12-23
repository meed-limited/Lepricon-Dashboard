// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

// import "hardhat/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {DSMath} from "./library/DSMath.sol";

/**
 * @title Lepricon Staking Contract
 * @author @Pedrojok01
 */
contract LepriconStaking is DSMath, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /* Storage:
     ***********/

    IERC20 public token;
    address private admin; // = back-end address (yield payment + API)

    struct Vault {
        uint8 apr;
        uint256 timelock;
        uint256 totalAmountLock;
    }

    Vault[4] public vaults;

    /**
     * @notice Define the token that will be used for staking, and push once to stakeholders for index to work properly
     * @param _token the token that will be used for staking
     */
    constructor(IERC20 _token) {
        _initializeVaults();
        token = _token;
        admin = _msgSender();
        stakeholders.push();
    }

    /**
     * @notice Struct used to represent the way we store each stake;
     * A Stake contain the users address, the amount staked, the timeLock duration, and the unlock time;
     * @param since allow us to calculate the reward (reset to block.timestamp with each withdraw)
     * @param claimable is used to display the actual reward earned to user (see hasStake() function)
     */
    struct Stake {
        address user;
        uint8 timeLock;
        uint256 amount;
        uint256 since;
        uint256 unlockTime;
        uint256 claimable;
    }

    /// @notice Track the NFT status per stakeholders that has at least 1 active stake
    struct Boost {
        bool isBoost;
        uint8 boostValue;
        address NftContractAddress;
        uint256 tokenId;
        uint256 since;
    }

    /// @notice A Stakeholder is a staker that has at least 1 active stake
    struct Stakeholder {
        address user;
        Stake[] address_stakes;
    }

    /// @notice Struct used to contain all stakes per address (user)
    struct StakingSummary {
        uint256 total_amount;
        Stake[] stakes;
    }

    /// @notice Store all Stakes performed on the Contract per index, the index can be found using the stakes mapping
    Stakeholder[] private stakeholders;

    /// @notice Map all NFTboost status per stakehoder address
    mapping(address => Boost) public boost;

    /// @notice keep track of the INDEX for the stakers in the stakes array
    mapping(address => uint256) private stakes;

    /***********************************************************************************
                                    STAKE FUNCTIONS
    ************************************************************************************/

    /**
     * @notice Allow a user to stake his tokens
     * @param _amount Amount of tokens that the user wish to stake
     * @param _timeLock Duration of staking (in months) chosen by user: 0 | 3 | 6 | 12 (will determines the APR)
     */
    function stake(uint256 _amount, uint8 _timeLock)
        external
        nonReentrant
        whenNotPaused
    {
        require(
            _amount < token.balanceOf(_msgSender()),
            "Cannot stake more than you own"
        );
        require(
            _amount <= token.allowance(_msgSender(), address(this)),
            "Not authorized"
        );
        token.safeTransferFrom(_msgSender(), address(this), _amount); // Transfer tokens to staking contract
        _stake(_amount, _timeLock); // Handle the new stake
    }

    /**
     * @notice Create a new stake from sender. Will remove the amount to stake from sender and store it in a container
     */
    function _stake(uint256 _amount, uint8 _timeLock) private {
        require(_amount > 0, "Cannot stake nothing");

        uint256 _lock = _getLockPeriod(_timeLock);
        _addAmountToVault(_amount, _timeLock);

        uint256 index = stakes[_msgSender()];
        uint256 since = block.timestamp;
        uint256 unlockTime = since + _lock;
        // Check if the staker already has a staked index or if new user
        if (index == 0) {
            index = _addStakeholder(_msgSender());
        }

        stakeholders[index].address_stakes.push(
            Stake(_msgSender(), _timeLock, _amount, since, unlockTime, index)
        );

        emit Staked(_msgSender(), _amount, index, since, _lock, unlockTime);
    }

    /**
     * @notice Add the selected amount to the selected vault;
     * @param _amount Amount to be added;
     * @param _timelock Vault to add the amount in (0 | 1 | 3 | 6 | 12);
     */
    function _addAmountToVault(uint256 _amount, uint8 _timelock) private {
        uint8 vaultIndex = _getIndexFromTimelock(_timelock);
        vaults[vaultIndex].totalAmountLock += _amount;
    }

    event Staked(
        address indexed user,
        uint256 amount,
        uint256 index,
        uint256 timestamp,
        uint256 lockTime,
        uint256 unlockTime
    );

    /***********************************************************************************
                                    WITHDRAW FUNCTIONS
    ************************************************************************************/

    /**
     * @notice Allow a staker to withdraw his stakes from his holder's account
     */
    function withdrawStake(uint256 amount, uint256 stake_index)
        external
        nonReentrant
        whenNotPaused
    {
        uint256 reward = _withdrawStake(amount, stake_index);
        // Return staked tokens to user
        token.safeTransfer(_msgSender(), amount);
        // Pay earned reward to user
        token.safeTransferFrom(admin, _msgSender(), reward);
    }

    /**
     * @notice Takes in an amount and the index of the stake to withdraw from, and removes the tokens from that stake
     * The index of the stake is the users stake counter, starting at 0 for the first stake
     * Will return the amount to transfer back to the acount (amount to withdraw + reward) and reset timer
     */
    function _withdrawStake(uint256 _amount, uint256 _index)
        private
        returns (uint256)
    {
        uint256 user_index = stakes[_msgSender()];
        Stake memory current_stake = stakeholders[user_index].address_stakes[
            _index
        ];
        require(block.timestamp > current_stake.unlockTime, "Still under lock");
        require(
            current_stake.amount >= _amount,
            "Can't withdraw more than staked"
        );

        uint8 NftBoost = boost[_msgSender()].boostValue;
        uint256 reward = calculateStakeReward(current_stake, NftBoost);
        current_stake.amount = current_stake.amount - _amount;
        if (current_stake.amount == 0) {
            delete stakeholders[user_index].address_stakes[_index];
        } else {
            stakeholders[user_index]
                .address_stakes[_index]
                .amount = current_stake.amount;
            // Reset timer for reward calculation
            stakeholders[user_index].address_stakes[_index].since = block
                .timestamp;
        }
        _withdrawAmountFromVault(_amount, current_stake.timeLock);
        return reward;
    }

    /**
     * @notice Remove the selected amount from the selected vault;
     * @param _amount Amount to be removed;
     * @param _timelock Vault to remove the amount from (0 | 1 | 3 | 6 | 12);
     */
    function _withdrawAmountFromVault(uint256 _amount, uint8 _timelock)
        private
    {
        uint8 vaultIndex = _getIndexFromTimelock(_timelock);
        vaults[vaultIndex].totalAmountLock -= _amount;
    }

    /***********************************************************************************
                                    NFT BOOST FUNCTIONS
    ************************************************************************************/

    function setNftStatus(
        address _account,
        address _NftContractAddress,
        uint256 _tokenId,
        uint8 _NftBoost
    ) external {
        require(
            _msgSender() == owner() || _msgSender() == admin, // if set afterwards in case of transfer/sale
            "Not authorized"
        );
        require(_NftBoost <= 10, "Wrong boost amount"); // Prevent abuse if logic flaw
        // If never staked, initialized user first:
        if (stakes[_account] == 0) {
            _addStakeholder(_account);
        }
        _setNftStatus(_account, _NftContractAddress, _tokenId, _NftBoost);
    }

    function resetNftStatus(address _account) external {
        require(
            _account == _msgSender() || _msgSender() == admin,
            "Not authorized"
        );
        _resetNftStatus(_account);
    }

    function _setNftStatus(
        address _account,
        address _NftContractAddress,
        uint256 _tokenId,
        uint8 _NftBoost
    ) private {
        boost[_account].isBoost = true;
        boost[_account].NftContractAddress = _NftContractAddress;
        boost[_account].tokenId = _tokenId;
        boost[_account].boostValue = _NftBoost;
        boost[_account].since = block.timestamp;
    }

    function _resetNftStatus(address _account) private {
        boost[_account].isBoost = false;
        boost[_account].NftContractAddress = address(0);
        boost[_account].tokenId = 0;
        boost[_account].boostValue = 0;
        boost[_account].since = 0;
    }

    /***********************************************************************************
                                    VIEW FUNCTIONS
    ************************************************************************************/

    /**
     * @notice Allow to check if a account has stakes and to return the total amount along with all the seperate stakes
     */
    function hasStake(address _staker)
        external
        view
        returns (StakingSummary memory)
    {
        // totalStakeAmount is used to count total staked amount of the address
        uint256 totalStakeAmount;
        // Keep a summary in memory since we need to calculate this
        StakingSummary memory summary = StakingSummary(
            0,
            stakeholders[stakes[_staker]].address_stakes
        );
        for (uint256 s = 0; s < summary.stakes.length; s += 1) {
            uint8 NftBoost = boost[_staker].boostValue;
            uint256 availableReward = calculateStakeReward(
                summary.stakes[s],
                NftBoost
            );
            summary.stakes[s].claimable = availableReward;
            totalStakeAmount = totalStakeAmount + summary.stakes[s].amount;
        }
        summary.total_amount = totalStakeAmount;
        return summary;
    }

    /**
     * @notice Allow to to quickly fetch the total amount of tokens staked on the contract;
     */
    function getTotalStaked() external view returns (uint256) {
        uint256 totalStaked = 0;

        for (uint256 i = 0; i < vaults.length; i++) {
            totalStaked += vaults[i].totalAmountLock;
        }

        return totalStaked;
    }

    /***********************************************************************************
                                    RESTRICTED FUNCTIONS
    ************************************************************************************/

    /**
     * @notice Allow to pause staking/withawal in case of emergency;
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Allow to unpause staking/withawal if paused;
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    function setAdmin(address _newAdmin) external onlyOwner {
        require(_newAdmin != address(0), "Staking: zero address");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit NewAdminSet(oldAdmin, _newAdmin);
    }

    event NewAdminSet(address indexed oldAdmin, address indexed newAdmin);

    function setToken(IERC20 _newToken) external onlyOwner {
        IERC20 oldToken = token;
        token = _newToken;
        emit NewTokenSet(oldToken, _newToken);
    }

    event NewTokenSet(IERC20 indexed oldToken, IERC20 indexed newToken);

    /**
     * @notice The following functions allow to change the APR per lock duration;
     * @param _newApr Percent interest per year. MUST BE AN INTEGER. Will be divided by 10,000,000 to get the %/day;
     * @param _timelock Indicate the lock duration: 0 | 3 | 6 | 12 (months);
     */
    function setAPR(uint8 _newApr, uint8 _timelock) external onlyOwner {
        vaults[_getIndexFromTimelock(_timelock)].apr = _newApr;
        emit NewAprSet(_newApr, _timelock);
    }

    event NewAprSet(uint8 _newApr, uint8 _timelock);

    /***********************************************************************************
                                    PRIVATE FUNCTIONS
    ************************************************************************************/

    function _initializeVaults() private {
        vaults[0] = Vault({timelock: 0, apr: 2, totalAmountLock: 0});
        vaults[1] = Vault({timelock: 91 days, apr: 4, totalAmountLock: 0});
        vaults[2] = Vault({timelock: 182 days, apr: 6, totalAmountLock: 0});
        vaults[3] = Vault({timelock: 364 days, apr: 8, totalAmountLock: 0});
    }

    /**
     * @notice Add a stakeholder to the "stakeholders" array
     */
    function _addStakeholder(address staker) private returns (uint256) {
        stakeholders.push();
        uint256 userIndex = stakeholders.length - 1;
        stakeholders[userIndex].user = staker;
        stakes[staker] = userIndex;

        _resetNftStatus(staker);

        return userIndex;
    }

    /**
     * @notice Calculate how much a user should be rewarded for his stakes
     * @return reward Amount won based on: vault APR, NFT boost (if any), number of days, amount staked;
     */
    function calculateStakeReward(Stake memory _current_stake, uint8 _NftBoost)
        private
        view
        returns (uint256)
    {
        uint256 reward = 0;
        uint8 vaultIndex = _getIndexFromTimelock(_current_stake.timeLock);
        uint256 apr = _getAprFromPercent(vaults[vaultIndex].apr);

        if (_current_stake.timeLock == 0) {
            if (_NftBoost != 0) {
                uint256 extraBoost = _getAprFromPercent(_NftBoost);
                if (boost[_current_stake.user].since > _current_stake.since) {
                    reward = apr + extraBoost;
                    uint256 boostReward = wmul(
                        (((block.timestamp - boost[_current_stake.user].since) /
                            1 days) * _current_stake.amount),
                        reward
                    );
                    uint256 noBoostReward = wmul(
                        (((boost[_current_stake.user].since -
                            _current_stake.since) / 1 days) *
                            _current_stake.amount),
                        apr
                    );
                    return boostReward + noBoostReward;
                } else {
                    reward = apr + extraBoost;
                }
            } else {
                reward = apr;
            }
        } else {
            reward = apr;
        }
        // Calculation: numbers of days * amount staked * APR
        return
            wmul(
                (((block.timestamp - _current_stake.since) / 1 days) *
                    _current_stake.amount),
                reward
            );
    }

    /***********************************************************************************
                                    UTILS FUNCTIONS
    ************************************************************************************/

    /**
     * @notice Return the vault index to get the stake corresponding the the selected vault (_timelock);
     */
    function _getIndexFromTimelock(uint8 _timelock)
        private
        pure
        returns (uint8)
    {
        if (_timelock == 0) return _timelock;
        else if (_timelock == 3) return 1;
        else if (_timelock == 6) return 2;
        else if (_timelock == 12) return 3;
        else revert("Staking: invalid lock");
    }

    function _getLockPeriod(uint8 _timelock) private view returns (uint256) {
        return vaults[_getIndexFromTimelock(_timelock)].timelock;
    }

    function _getAprFromPercent(uint16 _percent)
        private
        pure
        returns (uint256)
    {
        return wdiv(_percent * 274, 1e7); // eg: 5% APR == 0.0001370/day
    }
}
