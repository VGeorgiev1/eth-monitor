import { useState, useContext, useEffect } from 'react';
import { ProviderContext } from '../Provider/Provider'
import { ethers } from 'ethers';
import { Nexo } from './Nexo';
import { Weth } from './Weth';
import { WethWrapper } from './WethWrapper';
import { WethUsdc } from './WethUsdc'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EtherLog from '../../public/logos/etherium.svg';
import Spinner from 'react-bootstrap/Spinner';
export function Account() {
  const { provider, chainId }  = useContext(ProviderContext);

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);

  const getAccountInfo = async () => {
    const signer = await provider.getSigner();
    const address = await signer.getAddress(); 
    const { name } = await provider.getNetwork();
    
    const balance = await provider.getBalance(signer.address);

    let eth_balance = parseFloat(ethers.formatEther(balance.toString())).toFixed(4);
    
    setAccount({ address, balance: eth_balance + ' ETH', network: name});
    setLoading(false);
    setRefresh(!refresh);
  }

  useEffect(() => {
    if(!provider) {
      return;
    }
    getAccountInfo();
  }, [provider])
  
  if(loading) {
    return  (
    <Spinner style={{position: "absolute", height: "100px", width: "100px", top:"50%", left: "50%", marginLeft: "-50px", marginTop: "-50px"}} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    );
  } else {
    return (<>
      <Container fluid className="d-flex flex-column justify-content-center" style={{marginTop: '2em'}}>
        <Row style={{marginBottom: '2em'}}>
          <Col>
            <Card className="float-end" style={{ width: '18rem', minHeight: '7.2em'  }}>
              <Card.Body className="d-flex align-items-center flex-row">
                <Card.Title>Network:</Card.Title>
                <Card.Text style={{position: 'absolute', right: '0.5em'}}>
                  {account.network}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: '18rem', minHeight: '7.2em' }}>
              <Card.Body>
              <Card.Title>Wallet address:</Card.Title>
                <Card.Text>
                  {account.address}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{marginBottom: '2em'}}>
          <Col md="6" lg="6" sm="6">
            <Card className="float-end" style={{ width: '18rem' , minHeight: '7.2em' }}>
              <Card.Body className="d-flex align-items-center flex-row" style={{wordWrap: "break-word"}}>
              <img style={{ width: '2em', height: '2em'}} className="float-left img-fluid" src={EtherLog}></img>
              <div className="media d-flex" style={{position: 'absolute', right: '0.5em'}}>
                <div className="media-body text-end text-wrap">
                  <h5 className="text-wrap">{account.balance}</h5>
                </div>
              </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="6" lg="6" sm="6">
            <Nexo refresh={refresh}/>
          </Col>
        </Row>
        <Row>
          <Col md="6" lg="6" sm="6">
            <Weth refresh={refresh}/>
          </Col>
          <Col md="6" lg="6" sm="6">
            <WethUsdc/>
          </Col>
        </Row>
        
      </Container>
      <WethWrapper resetAccountInfo = {getAccountInfo}/>
      
    </>)
  }
  
}