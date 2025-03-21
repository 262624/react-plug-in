import solanaChainImg from '~/images/chainImgs/openverse.png';
import solanaTokenImg from '~/images/symbols/openverse.png';
import type { SolanaChain } from '~/types/chain';

export const SOLANA: SolanaChain = {
  line: 'SOLANA',
  chainName: 'Solana Networks',
  rpcURL: 'https://api.mainnet.openverse.network/', 
  displayDenom: 'SOL',
  explorerURL: 'https://explorer.solana.com',
  coinGeckoId: 'solana',
  decimals: 9,
  id: '56c15c30-0381-4437-b184-94f97cb04081',
  bip44: {
    purpose: "44'",
    coinType: "501'",
    account: "0'",
    change: "0'"
  },
  tokenImageURL: solanaTokenImg,
  imageURL: solanaChainImg
};

export const EVM_NATIVE_TOKEN_ADDRESS = 'Stake11111111111111111111111111111111111111';
