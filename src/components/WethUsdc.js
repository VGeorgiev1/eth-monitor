import { useState, useContext, useEffect, useRef } from 'react';
import { ethers } from 'ethers'
import { ProviderContext } from '../Provider/Provider'
import { UNISWAP_POOL, UNISWAP_QUOTER,WETH_TOKEN, USDC_TOKEN, SEPOLIA_WETH_ADDRESS, MAINNET_WETH_ADDRESS, WETH_ABI, MAINNET, SEPOLIA, UNISWAP_QUOTER_CONTRACT_ADDRESS, UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS } from '../../config'
import { FeeAmount } from '@uniswap/v3-sdk'
import { computePoolAddress } from '@uniswap/v3-sdk'
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

export function WethUsdc() {
    const { provider, chainId } = useContext(ProviderContext);
    const [loading, setLoading] = useState(true);
    const [rate, setRate] = useState(BigInt(0));

    const getUSDCValue = async () => {
        if(chainId != MAINNET) {
            setRate('WEHT/USDC Exhcnage rate only available on Mainnet');
            setLoading(false);
            return;
        }
        const quoterContract = new ethers.Contract(
            UNISWAP_QUOTER_CONTRACT_ADDRESS,
            UNISWAP_QUOTER.abi,
            provider
        );

        const currentPoolAddress = computePoolAddress({
            factoryAddress: UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS,
            tokenA:  WETH_TOKEN,
            tokenB: USDC_TOKEN,
            fee: FeeAmount.LOW,
        });
        
        const poolContract = new ethers.Contract(
            currentPoolAddress,
            UNISWAP_POOL.abi,
            provider
        );

        const [token0, token1, fee] = await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
        ])
        let amountIn = ethers.parseUnits('1', USDC_TOKEN.decimals);
        
        const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
            token0,
            token1,
            fee,
            amountIn.toString(),
            0
        )
        setRate('1 WETH <-> ' + (1/ ethers.formatUnits(quotedAmountOut, WETH_TOKEN.decimals)).toFixed(2) + ' USDC');
        setLoading(false);
    }

    useEffect(() => {
        getUSDCValue()
    },[provider]);
    if(loading) {
        return  (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
        );
    }
    return (
        <>
            <Card style={{ width: '18rem', minHeight: '7.2em' }}>
              <Card.Body className="d-flex align-items-center justify-content-center flex-row" style={{wordWrap: "break-word"}}>
              <div className="media d-flex">
                <div className="media-body text-center text-wrap">
                  <h5 style={{marginBottom: '0'}} className="text-wrap">{rate}</h5>
                </div>
              </div>
              </Card.Body>
            </Card>
        </>
    )
}