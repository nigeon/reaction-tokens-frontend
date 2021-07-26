import { Button, Col, Form, Input, Row } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import { useEffect, useState } from 'react';
import './App.css';

import { Web3Connector } from './components/other/Web3Connector';
import Web3WalletButton from './components/other/Web3WalletButton';

import ReactionButton, { IReactionSettings } from './components/ReactionButton';

function App() {
  const [web3Connector, setWeb3Connector] = useState<Web3Connector>();
  const [reactionProps, setReactionProps] = useState<IReactionSettings>({ erc20: '', nft: '', amount: 0});

  // Web3Modal initializer
  useEffect(() => {
    ;(async function iife() {
      const web3Connector = new Web3Connector();
      web3Connector.init();
      setWeb3Connector(web3Connector);
    })()
  }, []);

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
              name="basic"
              initialValues={{ remember: true }}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              onFinish={onFinish}
            >
              <Form.Item
                label="NFT Address"
                name="nft"
                rules={[{ required: true, message: 'Please input the NFT Address you are going to react' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Staking ERC20"
                name="erc20"
                rules={[{ required: true, message: 'Please input the ERC20 address you are going to Stake' }]}
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
            <ReactionButton settings={reactionProps} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
