import solanaChainImg from '~/images/chainImgs/openverse.png';
import solanaTokenImg from '~/images/symbols/openverse.png';
import type { SolanaNetwork } from '~/types/chain';

export const MAINNET: SolanaNetwork = {
  id: '174f6671-ef2d-4c30-a140-63f493c5a318',
  networkName: 'Mainnet',
  displayDenom: 'SOL',
  tokenImageURL: solanaTokenImg,
  imageURL: solanaChainImg,
  explorerURL: 'https://openverse.live',
  coinGeckoId: 'solana',
  decimals: 9,
  chainId: '102x',
  rpcURL: 'https://api.mainnet.openverse.network/', 

};