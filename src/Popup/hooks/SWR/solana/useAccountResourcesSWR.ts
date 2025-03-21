import type { AxiosError } from 'axios';
import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

import { APTOS } from '~/constants/chain/aptos/aptos';
import { useAccounts } from '~/Popup/hooks/SWR/cache/useAccounts';
import { useExtensionStorage } from '~/Popup/hooks/useExtensionStorage';
import { get, isAxiosError, post } from '~/Popup/utils/axios';
import type { ResourcesPayload } from '~/types/aptos/accounts';
import type { SolanaNetwork } from '~/types/chain';

import { useCurrentSolanaCoins } from '../../useCurrent/useCurrentSolanaCoins';
import { useCurrentSolanaNetworks } from '../../useCurrent/useCurrentSolanaNetworks';
import { SOLANA } from '~/constants/chain/solana/solana';

type FetchParams = {
    url: string;
    address: string;
};

type useAccountResourcesSWRProps = {
    network?: SolanaNetwork;
    address?: string;
};

export function useAccountResourcesSWR({ address, network }: useAccountResourcesSWRProps, config?: SWRConfiguration) {
    const chain = SOLANA;
    const accounts = useAccounts(config?.suspense);
    const { extensionStorage } = useExtensionStorage();
    const { currentSolanaNetwork } = useCurrentSolanaNetworks();

    const { rpcURL } = network || currentSolanaNetwork;

    const addr = address || accounts.data?.find((account) => account.id === extensionStorage.selectedAccountId)?.address[chain.id] || '';

    const fetcher = async (params: FetchParams) => {
        try {
            return await post<ResourcesPayload>(`${params.url}/v1/accounts/${params.address}/resources`,
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "getAccountInfo",
                    "params": [
                        params.address,
                      {
                        "encoding": "jsonParsed",
                        "filters": [
                          {
                            "memcmp": {
                              "offset": 1,
                              "bytes": "1"
                            }
                          }
                        ]
                      }
                    ]
                  }, { headers: { "Content-Type": "application/json" } });;
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response?.status === 404) {
                    return [];
                }
            }
            throw e;
        }
    };

    const { data, error, mutate } = useSWR<ResourcesPayload, AxiosError>({ url: rpcURL, address: addr }, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000,
        refreshInterval: 11000,
        errorRetryCount: 0,
        isPaused: () => !addr,
        ...config,
    });

    return { data, error, mutate };
}
