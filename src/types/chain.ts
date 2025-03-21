import type { Network } from 'bitcoinjs-lib';

import type { LINE_TYPE } from '~/constants/chain';
import type { COSMOS_TYPE, TOKEN_TYPE as COSMOS_TOKEN_TYPE ,SOLANA_TOKEN_TYPE } from '~/constants/cosmos';
import type { TOKEN_TYPE as ETHEREUM_TOKEN_TYPE } from '~/constants/ethereum';

export type LineType = ValueOf<typeof LINE_TYPE>;

export type CosmosType = ValueOf<typeof COSMOS_TYPE>;

export type BIP44 = {
  purpose: string;
  coinType: string;
  account: string;
  change: string;
  addressIndex: string;
};

export type CommonChain = {
  id: string;
  chainName: string;
  bip44: Omit<BIP44, 'addressIndex'>;
  tokenImageURL?: string;
  imageURL?: string;
};

export type GasRate = {
  tiny: string;
  low: string;
  average: string;
};

export type GasRateKey = keyof GasRate;

export type Gas = {
  send?: string;
  ibcSend?: string;
  transfer?: string;
  ibcTransfer?: string;
};

export type CosmosChain = {
  line: typeof LINE_TYPE.COSMOS;
  isTerminated?: boolean;
  type: CosmosType;
  chainId: string;
  baseDenom: string;
  displayDenom: string;
  restURL: string;
  decimals: number;
  bech32Prefix: {
    address: string;
  };
  coinGeckoId?: string;
  explorerURL?: string;
  gasRate: GasRate;
  gas: Gas;
  cosmWasm?: boolean;
  custom?: 'no-stake';
} & CommonChain;

export type CosmosCW20Token = {
  id: string;
  chainId: CosmosChain['id'];
  tokenType: typeof COSMOS_TOKEN_TYPE.CW20;
  address: string;
  name?: string;
  displayDenom: string;
  decimals: number;
  imageURL?: string;
  coinGeckoId?: string;
  default?: boolean;
};

export type CosmosToken = CosmosCW20Token;

export type CosmosGasRate = {
  chainId: string;
  baseDenom: string;
  originDenom: string;
  gasRate: GasRate;
};

export type Coin = {
  type: string;
  baseDenom: string;
  decimals: number;
  displayDenom: string;
  imageURL?: string;
  coinGeckoId?: string;
};

export type FeeCoin = {
  baseDenom: string;
  displayDenom: string;
  decimals: number;
  coinGeckoId?: string;
  imageURL?: string | undefined;
  availableAmount: string;
  gasRate?: GasRate;
};

export type EthereumChain = {
  line: typeof LINE_TYPE.ETHEREUM;
} & CommonChain;

export type EthereumNetwork = {
  id: string;
  chainId: string;
  networkName: string;
  displayDenom: string;
  decimals: number;
  rpcURL: string;
  tokenImageURL?: string;
  imageURL?: string;
  explorerURL?: string;
  coinGeckoId?: string;
};

export type AptosChain = {
  line: typeof LINE_TYPE.APTOS;
} & CommonChain;

export type SuiChain = {
  line: typeof LINE_TYPE.SUI;
  chainName: string;
} & CommonChain;

// 修改
export type OpenverseChain = {
  line: typeof LINE_TYPE.OPENVERSE;
  chainName: string;
} & CommonChain;

export type AptosNetwork = {
  id: string;
  chainId: number;
  networkName: string;
  restURL: string;
  tokenImageURL?: string;
  imageURL?: string;
  explorerURL?: string;
  coinGeckoId?: string;
};

export type SuiNetwork = {
  id: string;
  networkName: string;
  rpcURL: string;
  displayDenom: string;
  tokenImageURL?: string;
  imageURL?: string;
  explorerURL?: string;
  coinGeckoId?: string;
  decimals: number;
};

// 修改
export type OpenverseNetwork = {
  id: string;
  networkName: string;
  rpcURL: string;
  displayDenom: string;
  tokenImageURL?: string;
  imageURL?: string;
  explorerURL?: string;
  coinGeckoId?: string;
  decimals: number;
  chainId: string;
};

export type EthereumERC20Token = {
  id: string;
  ethereumNetworkId: string;
  tokenType: typeof ETHEREUM_TOKEN_TYPE.ERC20;
  address: string;
  name?: string;
  displayDenom: string;
  decimals: number;
  imageURL?: string;
  coinGeckoId?: string;
  default?: boolean;
};

// 修改
export type SolanaERC20Token = {
  id: string;
  solanaNetworkId?: string | undefined;
  tokenType: typeof SOLANA_TOKEN_TYPE.SPL;
  address: string;
  name?: string;
  displayDenom: string;
  decimals: number;
  imageURL?: string;
  coinGeckoId?: string;
  default?: boolean;
};

export type BitcoinChain = {
  line: typeof LINE_TYPE.BITCOIN;
  chainName: string;
  rpcURL: string;
  displayDenom: string;
  explorerURL?: string;
  coinGeckoId?: string;
  decimals: number;
  mempoolURL: string;
  network?: Network;
  isTestnet?: boolean;
  isSignet?: boolean;
} & CommonChain;

// 修改
// Solana 链类型
export type SolanaChain = {
  line: typeof LINE_TYPE.SOLANA; // 假设 LINE_TYPE 中有 SOLANA 常量
  chainName: string;
  rpcURL: string;
  displayDenom: string;
  explorerURL?: string;
  coinGeckoId?: string;
  decimals: number;
  mempoolURL?: string; // Solana 可能需要的 mempool URL
} & CommonChain;

// Solana 网络类型
export type SolanaNetwork = {
  id: string;
  networkName: string;
  rpcURL: string;
  displayDenom: string;
  tokenImageURL?: string;
  imageURL?: string;
  explorerURL?: string;
  coinGeckoId?: string;
  decimals: number;
  chainId: string;
};

// Solana Token 类型
export type SolanaToken = {
  id: string;
  solanaNetworkId?: string;
  tokenType: typeof SOLANA_TOKEN_TYPE.SPL; // 假设 SOLANA_TOKEN_TYPE 中有 SPL 常量
  address: string;
  name?: string;
  displayDenom: string;
  decimals: number;
  imageURL?: string;
  coinGeckoId?: string;
  default?: boolean;
};


// 修改
export type Chain = CosmosChain | EthereumChain | AptosChain | SuiChain | BitcoinChain | OpenverseChain | SolanaChain;

export type EthereumToken = EthereumERC20Token;
export type SolANAToken = SolanaERC20Token;
