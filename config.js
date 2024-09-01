import WETH_ABI from './weth_abi.json'
import NEXO_ABI from './nexo_abi.json'
import { Token } from '@uniswap/sdk-core'
import UNISWAP_POOL from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import UNISWAP_QUOTER from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
const ETHERSCAN_URL = 'https://etherscan.io/tx/';
const SEPOLIA_URL  = 'https://sepolia.etherscan.io/tx/'
const MAINNET = BigInt(1);
const SEPOLIA = BigInt(11155111);
const MAINNET_NEXO_ADDRESS = '0xB62132e35a6c13ee1EE0f84dC5d40bad8d815206';
const MAINNET_WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const SEPOLIA_WETH_ADDRESS = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
const UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const UNISWAP_QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const WRAP_TIME_MESSAGE = 7000;


const WETH_TOKEN = new Token(
    1,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
);

const USDC_TOKEN = new Token(
    1,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
);
export {WRAP_TIME_MESSAGE,SEPOLIA_URL,ETHERSCAN_URL,UNISWAP_POOL, UNISWAP_QUOTER,MAINNET, SEPOLIA, MAINNET_NEXO_ADDRESS, UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS, UNISWAP_QUOTER_CONTRACT_ADDRESS, MAINNET_WETH_ADDRESS, SEPOLIA_WETH_ADDRESS, WETH_ABI, NEXO_ABI, WETH_TOKEN, USDC_TOKEN};
