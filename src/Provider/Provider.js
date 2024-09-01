import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Spinner from 'react-bootstrap/Spinner';
import {MAINNET, SEPOLIA} from '../../config';

export const ProviderContext = React.createContext();
export const ProvContext = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [chainId, setChain] = useState(BigInt(0));
  const [loading, setLoading] = useState(true);

  const resetProvider = async (_provider, _chainId) => {
    const newProvider = new ethers.BrowserProvider(_provider, 'any') 
    const newChain = _chainId !== null ? _chainId 
    : (await newProvider.getNetwork()).chainId;
    
    if(newChain != BigInt(MAINNET) && newChain != BigInt(SEPOLIA) && newChain != BigInt(0)) {
      setChain(BigInt(-1));
      setLoading(false);
      return;  
    }
    setProvider(newProvider);
    setChain(BigInt(newChain));
    setLoading(false);
  };
  
  useEffect(() => {
    if(!window.ethereum) { setLoading(false); return };
    if(!window.ethereum.providers && !window.ethereum.isMetaMask) { setLoading(false); return };

    (async () => {
      let provider = null;

      if(window.ethereum.providers) {
          provider = window.ethereum.providers.filter(prov => prov.isMetaMask)[0];
          if(!provider) {
            return;
          }
      } else {
        provider = window.ethereum;
      }

      let accounts = (await provider.send('eth_accounts')).result;
      await resetProvider(provider, accounts != 0 ? null : 0); 

      provider.on("chainChanged", (e) => {
        let chainId = BigInt(e);
        resetProvider(provider, chainId)
      });
      
      provider.on("accountsChanged", (accounts) => {

        if(accounts.length == 0) {
          setChain(BigInt(0));
        } else {
          resetProvider(provider, null);
        }
      });
    })();
  },[]);
  if(loading) {
    return  (
        <Spinner style={{position: "absolute", height: "100px", width: "100px", top:"50%", left: "50%", marginLeft: "-50px", marginTop: "-50px"}} animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
  } else {
    return (
      <ProviderContext.Provider value={{ provider, chainId ,setChain, name }}>
          {children}
      </ProviderContext.Provider>
    ); 
  }
}
