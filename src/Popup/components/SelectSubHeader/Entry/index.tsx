import { useCurrentChain } from '~/Popup/hooks/useCurrent/useCurrentChain';

import Aptos from './Aptos';
import Bitcoin from './Bitcoin';
import Cosmos from './Cosmos';
import Ethereum from './Ethereum';
import Sui from './Sui';
import Solana from './Solana';

type EntryProps = {
  isShowChain: boolean;
};

export default function Entry({ isShowChain }: EntryProps) {
  const { currentChain } = useCurrentChain();

  if (currentChain.line === 'COSMOS') {
    return <Cosmos chain={currentChain} isShowChain={isShowChain} />;
  }

  if (currentChain.line === 'ETHEREUM') {
    return <Ethereum chain={currentChain} isShowChain={isShowChain} />;
  }

  if (currentChain.line === 'APTOS') {
    return <Aptos chain={currentChain} isShowChain={isShowChain} />;
  }

  if (currentChain.line === 'SUI') {
    return <Sui chain={currentChain} isShowChain={isShowChain} />;
  }

  if (currentChain.line === 'BITCOIN') {
    return <Bitcoin chain={currentChain} isShowChain={isShowChain} />;
  }

  // 修改
  if(currentChain.line === 'SOLANA') {
    return <Solana chain={currentChain} isShowChain={isShowChain} />;
  }

  return null;
}
