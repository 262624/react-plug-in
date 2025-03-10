import type { AxiosError } from 'axios';
import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';

import { MINTSCAN_FRONT_API_V11_URL } from '~/constants/common';
import { get } from '~/Popup/utils/axios';
import type { ParamsV11Response } from '~/types/cosmos/params';

export function useAllParamsSWR(config?: SWRConfiguration) {
  const requestURL = `${MINTSCAN_FRONT_API_V11_URL}/utils/params`;

  const fetcher = async (fetchUrl: string) => {
    try {
      return await get<ParamsV11Response>(fetchUrl);
    } catch {
      return null;
    }
  };

  const { data, error, mutate } = useSWR<ParamsV11Response | null, AxiosError>(requestURL, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    ...config,
  });

  return { data, error, mutate };
}
