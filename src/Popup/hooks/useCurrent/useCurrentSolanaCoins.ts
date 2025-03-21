import { useMemo } from 'react';
import type { SWRConfiguration } from 'swr';

import { ACCOUNT_TYPE, APTOS_COIN } from '~/constants/aptos';
import { getCoinAddress } from '~/Popup/utils/aptos';
import { isEqualsIgnoringCase } from '~/Popup/utils/string';
import type { X1CoinCoinstore } from '~/types/aptos/accounts';

import { useCurrentSolanaNetworks } from './useCurrentSolanaNetworks';
import { useAccountResourcesSWR } from '../SWR/solana/useAccountResourcesSWR';

export function useCurrentSolanaCoins(config?: SWRConfiguration) {
    const { currentSolanaNetwork } = useCurrentSolanaNetworks();
    // console.log(currentSolanaNetwork,'currentSolanaNetwork');
    
    const accountResources = useAccountResourcesSWR({ network: currentSolanaNetwork }, config);
    console.log(accountResources,'accountResources');

    const solanaData = accountResources.data? {
        lamports:accountResources.data?.result.value.lamports,
    } : null;
    
    // const currentSolanaCoins = useMemo(
    //     () =>
    //         (accountResources.data?.filter((item) => item.type.startsWith(ACCOUNT_TYPE.X1___COIN___COIN_STORE)) || []).sort((item) =>
    //             isEqualsIgnoringCase(getCoinAddress(item.type), APTOS_COIN) ? -1 : 1,
    //         ) as X1CoinCoinstore[],
    //     [accountResources.data],
    // );

    // return { currentSolanaCoins };
    return {solanaData};
}
