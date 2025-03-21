import solanaChainImg from '~/images/chainImgs/openverse.png';
import solanaTokenImg from '~/images/symbols/openverse.png';
import type { SolanaNetwork } from '~/types/chain';

export const TESTNET: SolanaNetwork = {
  id: '8d44224c-52d1-41b5-8e00-94570ff948cf',
  networkName: 'Testnet',
  displayDenom: 'SOL',
  tokenImageURL: solanaTokenImg,
  imageURL: solanaChainImg,
  explorerURL: 'https://explorer.solana.com/?cluster=testnet',
  coinGeckoId: 'solana',
  decimals: 9,
  chainId:'102e',
  rpcURL: 'https://api.mainnet.openverse.network/', 

};