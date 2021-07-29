import { Button } from 'antd';
import { Contract, ethers } from 'ethers';
import { Web3Connector } from './other/Web3Connector';
import reactionFactoryABI from '../contracts/reactionFactoryABI.json';
import reactionTokenABI from '../contracts/reactionTokenABI.json';
import erc20ABI from '../contracts/erc20ABI.json';

export interface IReactionProps {
    settings: IReactionSettings;
    web3Connector: Web3Connector;
}

export interface IReactionSettings {
    erc20: string
    nft: string
    amount: number
    reactionTokenName: string
    reactionTokenSymbol: string
    tokenMetadataURI: string
}

export default function ReactionButton(props: IReactionProps) {  
  const settings: IReactionSettings = props.settings;
  const web3Connector: Web3Connector = props.web3Connector;
  
  const buttonOnClick = async function () {
    console.log('Reacting with', settings);

    try {
      const contractFactoryAddress: string = process.env.REACT_APP_REACTION_FACTORY || "";
      const signer = web3Connector.web3Provider.getSigner();

      const reactionFactoryContract: Contract = new ethers.Contract(contractFactoryAddress, reactionFactoryABI, signer);

      await reactionFactoryContract.deployReaction(settings.reactionTokenName, settings.reactionTokenSymbol, settings.tokenMetadataURI);
      reactionFactoryContract.once("ReactionDeployed", async (sender, reactionContractAddr, reactionTokenName, reactionTokenSymbol, tokenMetadataURI) => {
        console.log('New reaction deployed at: ', reactionContractAddr);

        const erc20Contract: Contract = new ethers.Contract(settings.erc20, erc20ABI, signer);
        const preDecimals = await erc20Contract.decimals();
        const decimals = ethers.BigNumber.from(10).pow(preDecimals);
        const stakingAmount = ethers.BigNumber.from(settings.amount).mul(decimals);

        await erc20Contract.approve(reactionContractAddr, stakingAmount);
        erc20Contract.once("Approval", async (owner, spender, amount) => {
          console.log('%s Tokens Approved', amount.toString());

          const reactionTokenContract: Contract = new ethers.Contract(reactionContractAddr, reactionTokenABI, signer);
          await reactionTokenContract.stakeAndMint(stakingAmount, erc20Contract.address, settings.nft);
          reactionTokenContract.once("Staked", async (author, amount, stakingTokenAddress, stakingSuperTokenAddress) => {
            console.log('Successfully Staked: ', author, amount, stakingTokenAddress, stakingSuperTokenAddress);
          });

        });
      });
    } catch (e) {
      console.log(e)
      return false
    }
  }

  return (
    <Button type="ghost" onClick={buttonOnClick}>💩</Button>
  );
}