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
  const [nftErc20Balance, setNftErc20Balance] = useState('');

  useEffect(() => {
    ;(async function iife() {
      const web3Connector = new Web3Connector();
      await web3Connector.init();
      setWeb3Connector(web3Connector);

      const formValues = form.getFieldsValue();
      const signer = await web3Connector.web3Provider.getSigner();
      const userAddress = await signer.getAddress();
      const erc20Contract: Contract = new ethers.Contract(formValues.erc20, erc20ABI, signer);
      setUserErc20Balance(ethers.utils.formatEther(await erc20Contract.balanceOf(userAddress)));
      setNftErc20Balance(ethers.utils.formatEther(await erc20Contract.balanceOf(formValues.nft)));
    })()
  }, [form]);

  const onFinish = (values: any) => {
    setReactionProps(values);
  };

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
                nft: "0x6044886e738F944D36a881F02a7D052407802a78",
                erc20: "0x4424bF269E2038eE30A3BC37B3ec14FE61dFeaFf",
                reactionContractAddr: "0xFe5D9d3f1B4b631a8bEE73381bb7056a9a4a6C54",
                amount: 100,
                reactionTokenName: 'Like', 
                reactionTokenSymbol: "LIKE", 
                tokenMetadataURI:"https://gateway.pinata.cloud/ipfs/QmbVsqnwUrDJBBdbr1wjC4FZNKdN5i2jQoBJyGoea5bYy9"
              }}
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              onFinish={onFinish}
            >
              <Form.Item
                label="NFT Address"
                name="nft"
                rules={[{ required: true, message: 'Please input the NFT Address you are going to react' }]}
                help={`Current Balance: ${nftErc20Balance}`}
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

              <Form.Item style={{display:"none"}} name="reactionContractAddr">
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
                <Button type="primary" htmlType="submit">
                  Set
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        
        <Row>
          <Col>
            { web3Connector &&
              <ReactionButton web3Connector={web3Connector} settings={reactionProps} />
            }
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
