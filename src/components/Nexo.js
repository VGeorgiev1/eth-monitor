import { useState, useContext, useEffect } from 'react';
import { ProviderContext } from '../Provider/Provider'
import { ethers } from 'ethers';
import { MAINNET_NEXO_ADDRESS, NEXO_ABI, MAINNET } from '../../config'
import NexoLogo from '../../public/logos/nexo.svg'
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

export function Nexo() {
    const { provider, chainId } = useContext(ProviderContext);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState('');
    const nexoContract = new ethers.Contract(
        MAINNET_NEXO_ADDRESS,
        NEXO_ABI,
        provider
    );
    useEffect(() => {
        const getBalance = async () => {
            
            if(chainId != MAINNET) {
                setBalance('NEXO is only supported on mainnet!');
                setLoading(false);
                return;
            }
            
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const txSigner = nexoContract.connect(signer);
            const balance = await txSigner.balanceOf(address);
            const symbol = await nexoContract.symbol();

            let nexo_balance = ethers.formatEther(balance.toString());
            setBalance(nexo_balance + ' ' + symbol);
            setLoading(false);
        };
        getBalance();
    }, [provider, chainId]);

    if(loading) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }
    
    return (
        <Card style={{ width: '18rem', minHeight: '7.2em' }}>
            <Card.Body className="d-flex align-items-center flex-row" style={{wordWrap: "break-word"}}>
            <img style={{ width: '2em', height: '2em'}} className="float-left img-fluid" src={NexoLogo}></img>
            <div className="media d-flex" style={{position: 'absolute', right: '0.5em'}}>
                <div className="media-body text-end text-wrap">
                    <h5 className="text-wrap">{balance}</h5>
                </div>
            </div>
            </Card.Body>
        </Card>
    )
}