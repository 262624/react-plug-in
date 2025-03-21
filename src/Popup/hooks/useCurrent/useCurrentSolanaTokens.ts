import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { useExtensionStorage } from '~/Popup/hooks/useExtensionStorage';
import type { SolANAToken } from '~/types/chain';

import { useCurrentSolanaNetworks } from './useCurrentSolanaNetworks';
import { useTokensSWR } from "../SWR/solana/useTokensSWR";
type addSolanaTokenParams = Omit<SolANAToken, 'id' | 'solanaNetworkId'>;

export function useCurrentSolanaTokens() {
    const { extensionStorage, setExtensionStorage } = useExtensionStorage();
    const { currentSolanaNetwork } = useCurrentSolanaNetworks();
    const { data } = useTokensSWR();

    const defaultTokens: SolANAToken[] = useMemo(
        () =>
            data
                .filter((item) => item.default)
                .map((item) => ({
                    id: `${currentSolanaNetwork.id}${item.address}`,
                    solanaNetworkId: currentSolanaNetwork.id,
                    address: item.address,
                    name: item.name,
                    displayDenom: item.displayDenom,
                    tokenType:'SPL',
                    decimals: item.decimals,
                })),
        [currentSolanaNetwork.id, data],
    )

    const { solansTokens } = extensionStorage;
    const currentSolanaTokens = useMemo(
        () =>
            [...defaultTokens, ...solansTokens.filter((item) => item.id === currentSolanaNetwork.id)].filter(
                (token, idx, self) => self.findIndex((item) => item.address.toLowerCase() === token.address.toLowerCase()) === idx,
            ),
        [currentSolanaNetwork.id, defaultTokens, solansTokens],
    )

    const addSolanaToken = async (token: addSolanaTokenParams) => {
        const newSolanaTokens = [
            ...currentSolanaTokens.filter((item) => !(item.address.toLowerCase() === token.address.toLowerCase())),
            { ...token, id: uuidv4() },
        ];

        await setExtensionStorage('solansTokens', newSolanaTokens);
    };

    const addSolanaTokens = async (tokens: addSolanaTokenParams[]) => {
        const filteredTokens = tokens.filter((token, idx, self) => self.findIndex((item) => item.address.toLowerCase() === token.address.toLowerCase()) === idx);

        const tokensAddress = filteredTokens.map((token) => token.address.toLowerCase());

        const newTokens = filteredTokens.map((token) => ({ ...token, id: uuidv4(), solanaNetworkId: currentSolanaNetwork.id }));

        const newSolanaTokens = [
            ...currentSolanaTokens.filter((item) => !tokensAddress.includes(item.address.toLowerCase())),
            ...newTokens,
        ];

        await setExtensionStorage('solansTokens', newSolanaTokens);
    };

    const removeSolanaToken = async (token: SolANAToken) => {
        const newSolanaTokens = currentSolanaTokens.filter((item) => item.id !== token.id);

        await setExtensionStorage('solansTokens', newSolanaTokens);
    };

    return { currentSolanaTokens, addSolanaToken, addSolanaTokens, removeSolanaToken };
}