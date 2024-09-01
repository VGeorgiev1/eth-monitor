
import { useEffect, useContext, useState } from 'react';

import {ProviderContext} from '../Provider/Provider'
import Container from 'react-bootstrap/Container';
import { ErrorDecoder } from 'ethers-decode-error';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';

export function MetaMask() {
  const { provider, setChain, chainId }  = useContext(ProviderContext);
  const [ error, setError ] = useState('');
  const [ btnDisabled, setDisabled ] = useState(false); 

  const errorDecoder = ErrorDecoder.create();

  const connectMetaMask = async () => {
    try{
      setDisabled(true);
      await provider.getSigner();
      const _chainId  = (await provider.getNetwork()).chainId;
      setChain(_chainId);
    } catch(e) {
      let decodedError = await errorDecoder.decode(e);
      setError(decodedError.name);
      setDisabled(false);
    }
  }
  
  
  return <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{marginTop: '2em'}}>
      <Row style={{width: '50%'}}>
        <button type="button" disabled={btnDisabled} onClick={connectMetaMask} className="btn btn-info">Connect to MetaMask!</button>
      </Row>
      {error != '' && 
      <Row style={{width: '50%', marginTop: '2em'}}>
      <Alert key='danger' variant='danger' className="text-center">
        {error}
      </Alert>
      </Row>}
    </Container>
  
}