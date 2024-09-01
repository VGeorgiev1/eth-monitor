import { useEffect, useContext, useState } from 'react';
import { ProviderContext } from '../Provider/Provider'
import { MetaMask } from './MetaMask'
import { Account } from './Account';

export function ConnectWallet() {
    const { provider, chainId } = useContext(ProviderContext);
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        const checkLoggedStatus = async() => {
            if(!provider) {
                setError('MetaMask not detected!');
                return;
            }
            if(chainId == -1) { // We are on the wrong chain
                setError('Please select either Etherium Mainnet or Sepolia!');
                return;
            } else {
                setError('');
            }

            setLogged(chainId != 0);
        };
        checkLoggedStatus();
    }, [provider, chainId]);


    if(error!='') {
        return <div> {error} </div>
    }
    else {
        if(logged) {
            return <Account/> 
        } else { 
            return <MetaMask/>
        }
    }
}