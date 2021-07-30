import { Button, Col, Form, Input, Row } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';

import { Web3Connector } from './components/other/Web3Connector';
import Web3WalletButton from './components/other/Web3WalletButton';
import erc20ABI from './contracts/erc20ABI.json';

import ReactionButton, { IReactionSettings } from './components/ReactionButton';

function App() {
  const [form] = Form.useForm()

  const [web3Connector, setWeb3Connector] = useState<Web3Connector>();
  const [reactionProps, setReactionProps] = useState<IReactionSettings>({ erc20: '', nft: '', amount: 0, reactionTokenName: '', reactionTokenSymbol: '', tokenMetadataURI: ''});
  const [userErc20Balance, setUserErc20Balance] = useState('');
  const [nftReactionBalance, setNftReactionBalance] = useState('');
  const [userSuperTokenBalance, setUserSuperTokenBalance] = useState('');

  useEffect(() => {
    ;(async function iife() {
      const web3Connector = new Web3Connector();
      await web3Connector.init();
      setWeb3Connector(web3Connector);
      onChange();
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Connector, form]);

  const onChange = async () => {
    if(!web3Connector) return;

    try{
      const formValues = form.getFieldsValue();
      setReactionProps(formValues);
      const signer = await web3Connector.web3Provider.getSigner();
      const userAddress = await signer.getAddress();
      const erc20Contract: Contract = new ethers.Contract(formValues.erc20, erc20ABI, signer);
      setUserErc20Balance(ethers.utils.formatEther(await erc20Contract.balanceOf(userAddress)));
  
      if(formValues.reactionContractAddr){
        const reactionContract: Contract = new ethers.Contract(formValues.reactionContractAddr, erc20ABI, signer);
        setNftReactionBalance(ethers.utils.formatEther(await reactionContract.balanceOf(formValues.nft)));
      }
    }catch(e){
      console.log(e);
    }
  }

  const checkSuperTokenBalance = async (values: any) => {
    if(!web3Connector) return;

    const signer = await web3Connector.web3Provider.getSigner();
    const userAddress = await signer.getAddress();
    const supertTokenContract: Contract = new ethers.Contract(values.supertoken, erc20ABI, signer);

    setInterval(async () => {
      console.log('Checking the supertokenBalance...');
      setUserSuperTokenBalance(ethers.utils.formatEther(await supertTokenContract.balanceOf(userAddress)));
    }, 1000);
  }

  return (
    <Layout>
      <Header>
        <Web3WalletButton web3Connector={web3Connector} />
      </Header>
      <Content className="App" style={{ padding: '50px' }}>
        <Row>
          <Col flex="auto">
            <h2>Reaction Settings</h2>
            <Form
              form={form}
              initialValues={{
                nft: "0xa94E2Ba2c4892F9E6895AE075d146BC0f339Ab11",
                erc20: "0xae24B6DcE7a565200bC05394F87eF8c32ba573ae",
                // reactionContractAddr: "",
                amount: 100,
                reactionTokenName: 'Like', 
                reactionTokenSymbol: "LIKE", 
                tokenMetadataURI:"https://gateway.pinata.cloud/ipfs/QmbVsqnwUrDJBBdbr1wjC4FZNKdN5i2jQoBJyGoea5bYy9"
              }}
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              onChange={onChange}
            >
              <Form.Item
                label="NFT Address"
                name="nft"
                rules={[{ required: true, message: 'Please input the NFT Address you are going to react' }]}
                help={`Current Balance: ${nftReactionBalance}`}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Staking ERC20"
                name="erc20"
                rules={[{ required: true, message: 'Please input the ERC20 address you are going to Stake' }]}
                help={`Current Balance: ${userErc20Balance}`}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Staking Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input the Amount you are going to Stake' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item 
                label="Reaction Contract Address"
                name="reactionContractAddr">
                <Input />
              </Form.Item>

              <Form.Item style={{display:"none"}} name="reactionTokenName">
                <Input />
              </Form.Item>

              <Form.Item style={{display:"none"}} name="reactionTokenSymbol">
                <Input />
              </Form.Item>

              <Form.Item style={{display:"none"}} name="tokenMetadataURI">
                <Input />
              </Form.Item>

              <Form.Item style={{textAlign:"left"}} wrapperCol={{ offset: 6, span: 16 }}>
                { web3Connector &&
                  <ReactionButton web3Connector={web3Connector} settings={reactionProps} />
                }
              </Form.Item>
            </Form>
          </Col>
        </Row>
        
        <Row>
          <Col flex="auto">
            <h2>SuperToken Balance</h2>
            <Form
                name="stCheck"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={checkSuperTokenBalance}
            >
              <Form.Item
                label="SuperToken Address"
                name="supertoken"
                rules={[{ required: true, message: 'Please input the SuperToken Address' }]}
                help={`Current Balance: ${userSuperTokenBalance}`}
              >
                <Input />
              </Form.Item>

              <Form.Item style={{textAlign:"left"}} wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="default" htmlType="submit">
                  Check
                </Button>
              </Form.Item>

            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
