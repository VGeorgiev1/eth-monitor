import { useState, useContext, useEffect, useRef } from 'react';
import { ethers } from 'ethers'
import { ProviderContext } from '../Provider/Provider'
import { SEPOLIA_WETH_ADDRESS, MAINNET_WETH_ADDRESS, WETH_ABI, MAINNET } from '../../config'
import WethLogo from '../../public/logos/weth.svg'
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

export function Weth(props) {
    const { provider, chainId } = useContext(ProviderContext);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(BigInt(0));
    const contract = new ethers.Contract(chainId == MAINNET 
        ? MAINNET_WETH_ADDRESS
        : SEPOLIA_WETH_ADDRESS, WETH_ABI, provider
    );
    const getBalance = async () => {

        const signer = await provider.getSigner();
        
        const txSigner = contract.connect(signer);
        const address = await signer.getAddress();

        const balance = await txSigner.balanceOf(address);
        const symbol = await contract.symbol();
        let weth_balance = ethers.formatEther(balance.toString());
        setBalance(weth_balance + ' ' + symbol);
        setLoading(false);

    }

    useEffect(() => {
        getBalance()
    },[provider, chainId, props.refresh]);

    if(loading) {
        return  (
            <Spinner className="float-end"  animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }
    
    return (
        <Card className="float-end" style={{ width: '18rem', minHeight: '7.2em' }}>
            <Card.Body className="d-flex align-items-center flex-row" style={{wordWrap: "break-word"}}>
            <img style={{ width: '2em', height: '2em'}} className="float-left img-fluid" src={WethLogo}></img>
            <div className="media d-flex" style={{position: 'absolute', right: '0.5em'}}>
                <div className="media-body text-end text-wrap">
                    <h5 className="text-wrap">{balance}</h5>
                </div>
            </div>
            </Card.Body>
        </Card>
    )
}