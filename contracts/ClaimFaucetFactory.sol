// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import {ClaimFaucet} from "./ClaimFaucet.sol";
import {IERC20} from "./interface/IERC20Token.sol";

contract ClaimFaucetFactory {
    struct DeployedContractInfo {
        address deployer;
        address deployedContract;
    }

    mapping(address => DeployedContractInfo[]) allUserDeployedContracts;

    DeployedContractInfo[] allcontracts;

    function deployClaimFaucet(string memory _name, string memory _symbol)
        external
        returns (address contractAddress_)
    {
        require(msg.sender != address(0), "Zero not allowed");

        address _address = address(new ClaimFaucet(_name, _symbol));

        contractAddress_ = _address;

        DeployedContractInfo memory _deployedContract;
        _deployedContract.deployer = msg.sender;
        _deployedContract.deployedContract = _address;

        allUserDeployedContracts[msg.sender].push(_deployedContract);

        allcontracts.push(_deployedContract);
    }

    function getAllContractDeployed()
        external
        view
        returns (DeployedContractInfo[] memory)
    {
        return allcontracts;
    }

    function getUserDeployedContracts()
        external
        view
        returns (DeployedContractInfo[] memory)
    {
        return allUserDeployedContracts[msg.sender];
    }

    function getUserDeployedContractByIndex(uint8 index)
        external
        view
        returns (address deployer_, address deployedContract_)
    {
        require(
            index < allUserDeployedContracts[msg.sender].length,
            "Out of bound"
        );
        DeployedContractInfo memory deployedContract = allUserDeployedContracts[
            msg.sender
        ][index];

        deployer_ = deployedContract.deployer;
        deployedContract_ = deployedContract.deployedContract;
    }

    function getLengthDeployedContracts() external view returns (uint256) {
        uint256 lens = allcontracts.length;
        return lens;
    }

    function getInfoFromContract(address _claimFaucet)
        external
        view
        returns (string memory, string memory)
    {
        return (
            IERC20(_claimFaucet).getTokenName(),
            IERC20(_claimFaucet).getSymbol()
        );
    }

    function claimFaucetFromContract(address _claimFaucet) external {
        IERC20(_claimFaucet).claimToken();
    }

    function getBalanceFromDeployedContract(address _claimFaucet)
        external
        view
        returns (uint256)
    {
        uint256 userBal = IERC20(_claimFaucet).balanceOf(msg.sender);

        return userBal;
    }
}
