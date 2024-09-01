import { useContext, useState, useRef } from 'react';
import { ethers } from 'ethers'
import { ProviderContext } from '../Provider/Provider'
import { WRAP_TIME_MESSAGE ,SEPOLIA_WETH_ADDRESS, MAINNET_WETH_ADDRESS, WETH_ABI, MAINNET, SEPOLIA, ETHERSCAN_URL, SEPOLIA_URL } from '../../config'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup'
import { ErrorDecoder } from 'ethers-decode-error';

export function WethWrapper({ resetAccountInfo }) {
    const errorDecoder = ErrorDecoder.create();

    const { provider, chainId }  = useContext(ProviderContext);
    const [ message, setMessage ] = useState(null);

    const wrapInputField = useRef(null);
    const unwrapInputField = useRef(null);
    const contract = new ethers.Contract(chainId == MAINNET 
        ? MAINNET_WETH_ADDRESS
        : SEPOLIA_WETH_ADDRESS, WETH_ABI, provider
    );
    const setMessageTimeout = () => {
        return setTimeout(() => {
            setMessage(null);
        }, WRAP_TIME_MESSAGE);
    }
    const swap = async (wrap) => {
        const signer = await provider.getSigner();

        const txSigner = contract.connect(signer);

        let value = wrap ? wrapInputField.current.value : unwrapInputField.current.value;

        try{
            let amount = ethers.parseEther(value.toString());
            let tx = null;
            if(wrap) {
                tx = await txSigner.deposit({value: amount});
            } else {
                tx = await txSigner.withdraw(amount);
            }
            
            setMessage({msg: (chainId == MAINNET ? ETHERSCAN_URL : SEPOLIA_URL) + tx.hash, variant: 'info', clickable: true})
            
            const timer = setMessageTimeout();

            let result = await tx.wait();
            if(result && result.status == 1) {
                resetAccountInfo();
            }

        } catch(e) {
            let decodedError = await errorDecoder.decode(e);
            setMessage({msg: decodedError.reason ? decodedError.reason : decodedError.name, variant: 'danger', clickable: false});
            
            const timer = setMessageTimeout();
        }

        return () => clearTimeout(timer);
    };

    return (
        <>
        <Container className="container d-flex justify-content-center" style={{width: '50%', marginTop: '1em'}}>
        <InputGroup className="mb-3">
            <Button onClick={() => {swap(true)} }variant="outline-secondary" id="button-addon1">
                Wrap ETH to WETH!
            </Button>
            <Form.Control
            ref={wrapInputField}
            type="number"
            min="0"
            />
        </InputGroup>
        
        </Container>
        <Container className="container d-flex justify-content-center" style={{width: '50%', marginTop: '1em'}}>
            <InputGroup className="mb-3">
                <Button onClick={ () => {swap(false)} } variant="outline-secondary" id="button-addon1">
                    Unwrap WETH to ETH!
                </Button>
                <Form.Control
                ref={unwrapInputField}
                type="number"
                min="0"
                />
            </InputGroup>
        </Container>
        {message !== null &&
            <Alert style={{width: '50%'}} key='danger' variant={message.variant} className="text-center text-break d-flex justify-content-center container">
                {message.clickable ? (
                        <a href={message.msg} className="alert-link">{message.msg}</a>
                    ) : (
                        message.msg
                    )
                }
            </Alert>
        }
        </>
    )
} 