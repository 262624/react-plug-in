import type { AxiosError } from 'axios';
import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

import { ETHEREUM } from '~/constants/chain/ethereum/ethereum';
import { useAccounts } from '~/Popup/hooks/SWR/cache/useAccounts';
import { useExtensionStorage } from '~/Popup/hooks/useExtensionStorage';
import { post } from '~/Popup/utils/axios';
import type { SolanaNetwork } from '~/types/chain';
import type { BalancePayload } from '~/types/ethereum/rpc';
import { useCurrentSolanaNetworks } from '../../useCurrent/useCurrentSolanaNetworks';
import { SOLANA } from '~/constants/chain/solana/solana';

type FetchParams = {
    url: string;
    body: {
        method: string;
        params: string[];
    };
};

export function useBalanceSWR(network?: SolanaNetwork, config?: SWRConfiguration) {
    const chain = SOLANA;
    const accounts = useAccounts(config?.suspense);
    const { extensionStorage } = useExtensionStorage();
    const { currentSolanaNetwork } = useCurrentSolanaNetworks();

    const { rpcURL } = network || currentSolanaNetwork;


    const address = accounts.data?.find((account) => account.id === extensionStorage.selectedAccountId)?.address[chain.id] || '';


    const fetcher = (params: FetchParams) => post(params.url, { ...params.body, id: 1, jsonrpc: '2.0' });


    const { data, error, mutate } = useSWR<BalancePayload,AxiosError>(
        {
            url: rpcURL, body: {
                method: 'getMultipleAccounts', params: [[address], {
                    commitment
                        :
                        "confirmed",
                    encoding
                        :
                        "jsonParsed"
                }]
            }
        },
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 14000,
            refreshInterval: 15000,
            errorRetryCount: 0,
            isPaused: () => !address,
            ...config,
        },
    );
    console.log(rpcURL);
    console.log({
        method: 'getMultipleAccounts', params: [address, 'latest']
    });

    
    return { data, error, mutate };
}
