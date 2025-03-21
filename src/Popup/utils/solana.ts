import { Keypair,PublicKey } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { hdkey } from '@ethereumjs/wallet';
import { OpenverseNetwork } from '~/types/chain';
import type { ChainIdToAssetNameMapsResponse as ChainIdToAssetNameMaps } from '~/types/cosmos/asset';

export function mnemonSolana(mnemonic:string , path:string){
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = hdkey.EthereumHDKey.fromMasterSeed(seed);
const child = root.derivePath(path);
const privateKey = child.getWallet().getPrivateKey();
const keypair = Keypair.fromSeed(privateKey.slice(0, 32));
const publicKey = keypair.publicKey.toBuffer();
return { privateKey:Buffer.from(keypair.secretKey), publicKey: publicKey};
}

export function getSolana(privateKey: Buffer) {
    const key = new PublicKey(privateKey);
    return key.toString();
}

export function convertEVMToAssetName(evmNetwork: OpenverseNetwork, chainIdToApiNameMaps: ChainIdToAssetNameMaps) {
  return chainIdToApiNameMaps[evmNetwork.chainId] || evmNetwork.networkName.toLowerCase();
}
