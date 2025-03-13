import { useExtensionStorage } from '~/Popup/hooks/useExtensionStorage';
import type { SolanaNetwork } from '~/types/chain';
// import { MAINNET, TESTNET } from '~/constants/chain/solana/network';
import { MAINNET } from '~/constants/chain/solana/network/mainnet';
import { TESTNET } from '~/constants/chain/solana/network/testnet';
import { emitToWeb } from '~/Popup/utils/message';
import { v4 as uuidv4 } from 'uuid';

const SOLANA_NETWORKS = [MAINNET, TESTNET];

export function useCurrentSolanaNetworks() {
  const { extensionStorage, setExtensionStorage } = useExtensionStorage();

  const { selectedSolanaNetworkId, additionalSolanaNetworks, allowedOrigins,showSolanaNetworks } = extensionStorage;

  const allNetworks = [...SOLANA_NETWORKS, ...additionalSolanaNetworks];
  // console.log(SOLANA_NETWORKS);
  // console.log(showSolanaNetworks,'000---000');
  
  const showSolanaNetwork = SOLANA_NETWORKS.filter((network) => showSolanaNetworks.includes(network.id));
  // console.log(showSolanaNetwork,'000---000');
  
  const currentAccountSelectedSolanaNetworkId = allNetworks.find((network) => network.id === selectedSolanaNetworkId)?.id ?? allNetworks[0].id;

  const currentSolanaNetwork = allNetworks.find((network) => network.id === currentAccountSelectedSolanaNetworkId)!;
  // console.log(currentSolanaNetwork,'currentSolanaNetwork');
  

  const setCurrentSolanaNetwork = async (network: SolanaNetwork) => {
    const newSelectedSolanaNetworkId = network.id;

    await setExtensionStorage('selectedSolanaNetworkId', newSelectedSolanaNetworkId);

    const origins = Array.from(new Set(allowedOrigins.map((item) => item.origin)));

    // 假设存在 emitToWeb 函数用于发送网络变更事件
    emitToWeb({ line: 'SOLANA', type: 'networkChange', message: { result: network.networkName.toLowerCase() } }, origins);
  };

  const removeSolanaNetwork = async (network: SolanaNetwork) => {
    if (currentSolanaNetwork.id === network.id) {
      await setCurrentSolanaNetwork(SOLANA_NETWORKS[0]);
    }

    const newAdditionalSolanaNetworks = additionalSolanaNetworks.filter((item) => item.id !== network.id);

    await setExtensionStorage('additionalSolanaNetworks', newAdditionalSolanaNetworks);
  };

  const addSolanaNetwork = async (network: Omit<SolanaNetwork, 'id'>) => {
    const officialChainId = SOLANA_NETWORKS.map((item) => item.rpcURL);

    if (officialChainId.includes(network.rpcURL)) return;

    const beforeNetwork = additionalSolanaNetworks.find((item) => item.rpcURL === network.rpcURL);

    const newAdditionalSolanaNetworks: SolanaNetwork[] = [
      ...additionalSolanaNetworks.filter((item) => item.rpcURL !== network.rpcURL),
      { ...network, id: beforeNetwork?.id || uuidv4() },
    ];

    await setExtensionStorage('additionalSolanaNetworks', newAdditionalSolanaNetworks);
  };
  // console.log(additionalSolanaNetworks, 'additionalSolanaNetworks');
  // console.log(currentSolanaNetwork, 'currentSolanaNetwork');
  return {
    solanaNetworks: allNetworks,
    additionalSolanaNetworks,
    currentSolanaNetwork,
    showSolanaNetwork,
    setCurrentSolanaNetwork,
    removeSolanaNetwork,
    addSolanaNetwork,
  };
}

