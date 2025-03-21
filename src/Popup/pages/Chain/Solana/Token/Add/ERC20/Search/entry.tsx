import { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { InputAdornment, Typography } from '@mui/material';

import Button from '~/Popup/components/common/Button';
import { useTokensSWR } from '~/Popup/hooks/SWR/solana/useTokensSWR';
import { useNavigate } from '~/Popup/hooks/useNavigate';
import { useTranslation } from '~/Popup/hooks/useTranslation';
import type { SolANAToken } from '~/types/chain';

import TokenItem from './components/TokenItem/index';
import {
  ButtonContainer,
  Container,
  ContentsContainer,
  Div,
  ImportCustomTokenButton,
  ImportCustomTokenImage,
  ImportCustomTokenText,
  StyledInput,
  StyledSearch20Icon,
  TokenIconBox,
  TokenIconText,
  TokenList,
  TokensIcon,
  WarningContainer,
  WarningIconContainer,
  WarningTextContainer,
} from './styled';

import Info16Icon from '~/images/icons/Info16.svg';
import Plus16Icon from '~/images/icons/Plus16.svg';
import { useCurrentSolanaTokens } from '~/Popup/hooks/useCurrent/useCurrentSolanaTokens';

type SolanaTokenParams = Omit<SolANAToken, 'id' | 'SolanaTokenId'>;

export default function Entry() {
  const tokens = useTokensSWR();
  const { enqueueSnackbar } = useSnackbar();

  const [search, setSearch] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<SolanaTokenParams[]>([]);

  const { addSolanaTokens, currentSolanaTokens } = useCurrentSolanaTokens();

  const { t } = useTranslation();
  const { navigate } = useNavigate();

  const currentTokenAddresses = currentSolanaTokens.map((current) => current.address);

  const validTokens = useMemo(() => tokens.data.filter((original) => !currentTokenAddresses.includes(original.address)), [currentTokenAddresses, tokens.data]);
  const filteredTokens = search
    ? validTokens.filter(
      (item) => item.name.toLowerCase().indexOf(search.toLowerCase()) > -1 || item.displayDenom.toLowerCase().indexOf(search.toLowerCase()) > -1,
    )
    : validTokens;
  console.log('filteredTokens', filteredTokens);
  console.log(123);

  const handleOnSubmit = async () => {
    await addSolanaTokens(selectedTokens);
    setSelectedTokens([]);
    enqueueSnackbar(t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.addTokenSnackbar'));
  };

  return (
    <Container>
      <WarningContainer>
        <WarningIconContainer>
          <Info16Icon />
        </WarningIconContainer>
        <WarningTextContainer>
          <Typography variant="h6">{t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.warning')}</Typography>
          {/* <Typography variant="h6">111111111</Typography> */}
        </WarningTextContainer>
      </WarningContainer>
      <Div sx={{ marginBottom: '1.2rem' }}>
        <ImportCustomTokenButton onClick={() => navigate('/chain/solana/token/add/erc20')}>
          <ImportCustomTokenImage>
            <Plus16Icon />
          </ImportCustomTokenImage>
          <ImportCustomTokenText>
            <Typography variant="h5">{t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.importCustomTokenButton')}</Typography>
          </ImportCustomTokenText>
        </ImportCustomTokenButton>
      </Div>
      <Div>
        <StyledInput
          startAdornment={
            <InputAdornment position="start">
              <StyledSearch20Icon />
            </InputAdornment>
          }
          placeholder={t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.searchPlaceholder')}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
          }}
        />
      </Div>

      <ContentsContainer>
        {filteredTokens.length > 0 ? (
          <TokenList>
            {filteredTokens.map((token) => {
              const isActive = !!selectedTokens.find((check) => check.address === token.address);
              return (
                <TokenItem
                  key={token.address}
                  name={token.name}
                  symbol={token.displayDenom}
                  imageURL={token.imageURL}
                  onClick={() => {
                    if (isActive) {
                      setSelectedTokens(selectedTokens.filter((selectedToken) => selectedToken.address !== token.address));
                    } else {
                      setSelectedTokens([...selectedTokens, { ...token, tokenType: 'SPL' }]);
                    }
                  }}
                  isActive={isActive}
                />
              );
            })}
          </TokenList>
        ) : (
          <TokenIconBox>
            <TokensIcon />
            <TokenIconText>
              <Typography variant="h6">
                {t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.tokenIconText1')}
                <br />
                {t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.tokenIconText2')}
              </Typography>
            </TokenIconText>
          </TokenIconBox>
        )}
      </ContentsContainer>
      <ButtonContainer>
        <Button onClick={handleOnSubmit} disabled={selectedTokens.length === 0}>
          {t('pages.Chain.Ethereum.Token.Add.ERC20.Search.entry.submitButton')}
        </Button>
      </ButtonContainer>
    </Container>
  );
}
