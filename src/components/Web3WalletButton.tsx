import { useEffect, useState } from 'react';

export default function Web3WalletButton(props: any) {  
  const web3Connector = props.web3Connector;

  const [web3Connected, setWeb3Connected] = useState(false)
  const [web3Connecting, setWeb3Connecting] = useState(false)

  // Web3 modal connection if existing
  useEffect(() => {
    if(web3Connector && web3Connector.web3Modal && web3Connector.web3Modal.cachedProvider){
      loadWeb3Modal();
    }
  }, [web3Connector]);

  // Show web3Modal
  const loadWeb3Modal = async () => {
    setWeb3Connecting(true);

    try{
      if(!web3Connector.getInjectedProvider()){
        alert('No Metmask! Please, install.');
        return false;
      }

      await web3Connector.connect();

      setWeb3Connected(true);
    }catch(e){
      console.log('Exception...', e);
      alert('Something went wrong');
      logoutOfWeb3Modal();
    }

    setWeb3Connecting(false);
  }

  const logoutOfWeb3Modal = function () {
    if (web3Connector.web3Modal) {
      web3Connector.web3Modal.clearCachedProvider();
      setWeb3Connected(false);
    }

		window.location.reload();
	}

  const buttonOnClick = async function () {
		if (web3Connected) {
      logoutOfWeb3Modal()
		} else {
      await loadWeb3Modal()
		}
	}

  const buttonText = (web3Connected) ? 'Disconnect Wallet':'Connect Wallet';
  return (
    <button type="button" 
      disabled={web3Connecting} 
      onClick={buttonOnClick}>{buttonText}</button>
  );
}