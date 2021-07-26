import { useEffect, useState } from 'react';
import './App.css';

import { Web3Connector } from './components/Web3Connector';
import Web3WalletButton from './components/Web3WalletButton';

function App() {
  const [web3Connector, setWeb3Connector] = useState<Web3Connector>();

  // Web3Modal initializer
  useEffect(() => {
    ;(async function iife() {
      const web3Connector = new Web3Connector();
      web3Connector.init();
      setWeb3Connector(web3Connector);
    })()
  }, []);

  return (
    <div className="App">
      <Web3WalletButton web3Connector={web3Connector} />
    </div>
  );
}

export default App;
