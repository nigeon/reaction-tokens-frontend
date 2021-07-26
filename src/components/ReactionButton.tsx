import { Button } from 'antd';

export interface IReactionProps {
    settings: IReactionSettings;
}

export interface IReactionSettings {
    erc20: string
    nft: string
    amount: number
}

export default function ReactionButton(props: IReactionProps) {  
    const settings: IReactionSettings = props.settings;

    const buttonOnClick = async function () {
        console.log('Reacting with', settings);
    }

  return (
    <Button type="ghost" onClick={buttonOnClick}>💩</Button>
  );
}