import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InputAdornment, Typography } from '@mui/material';

import AccountAddressBookBottomSheet from '~/Popup/components/AccountAddressBookBottomSheet';
import AddressBookBottomSheet from '~/Popup/components/AddressBookBottomSheet';
import Button from '~/Popup/components/common/Button';
import Tooltip from '~/Popup/components/common/Tooltip';
import InputAdornmentIconButton from '~/Popup/components/InputAdornmentIconButton';
import { useAccountResourceSWR } from '~/Popup/hooks/SWR/aptos/useAccountResourceSWR';
import { useAccounts } from '~/Popup/hooks/SWR/cache/useAccounts';
import { useCurrentAccount } from '~/Popup/hooks/useCurrent/useCurrentAccount';
import { useCurrentAptosCoins } from '~/Popup/hooks/useCurrent/useCurrentAptosCoins';
import { useCurrentQueue } from '~/Popup/hooks/useCurrent/useCurrentQueue';
import { useTranslation } from '~/Popup/hooks/useTranslation';
import { getCoinAddress } from '~/Popup/utils/aptos';
import { gt, isDecimal, lte, toBaseDenomAmount, toDisplayDenomAmount } from '~/Popup/utils/big';
import { aptosAddressRegex, solanaAddressRegex } from '~/Popup/utils/regex';
import type { X1CoinCoinstore } from '~/types/aptos/accounts';
import type { SolanaChain } from '~/types/chain';
import { Connection, PublicKey, Transaction, SystemProgram, VersionedMessage, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Keypair, clusterApiUrl, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

import CoinButton from './components/CoinButton';
import CoinListBottomSheet from './components/CoinListBottomSheet';
import { BottomContainer, Container, DisableInput, Div, MaxButton, StyledInput } from './styled';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import AccountAddressIcon from '~/images/icons/AccountAddress.svg';
import AddressBook24Icon from '~/images/icons/AddressBook24.svg';
import { extensionSessionStorage } from '~/Popup/utils/extensionSessionStorage';
import { useRecoilValue } from 'recoil';
import { newMnemonicAccountState } from '~/Popup/recoils/newAccount';
import { useCurrentSolanaCoins } from '~/Popup/hooks/useCurrent/useCurrentSolanaCoins';
import * as bip39 from 'bip39';
import { hdkey } from '@ethereumjs/wallet';

type SolanaProps = {
  chain: SolanaChain;
};

export default function Solana({ chain }: SolanaProps) {
  const { currentAccount } = useCurrentAccount();
  const { solanaData } = useCurrentSolanaCoins({ suspense: true });
  const params = useParams();

  const { enQueue } = useCurrentQueue();

  const accounts = useAccounts(true);
  const address = accounts.data?.find((item) => item.id === currentAccount.id)?.address[chain.id] || '';
  const { t } = useTranslation();

  const [currentDisplayAmount, setCurrentDisplayAmount] = useState('');
  const [banlanceValue, setBanlanceValue] = useState(0);
  const [gasValue, setGasValue] = useState(0.000005);
  console.log(solanaData, 'solanaData');

  const [currentCoin, setCurrentCoin] = useState<X1CoinCoinstore | undefined>(
    // solanaData.find((item) => item.type === params.id) || solanaData[0],
  );

  const coinAddress = getCoinAddress(currentCoin?.type || '');

  const accountAddress = coinAddress.split('::')[0];

  const { data: coinInfo } = useAccountResourceSWR({ resourceType: '0x1::coin::CoinInfo', resourceTarget: coinAddress, address: accountAddress });

  const [currentAddress, setCurrentAddress] = useState('');

  const [isOpenedAddressBook, setIsOpenedAddressBook] = useState(false);
  const [isOpenedMyAddressBook, setIsOpenedMyAddressBook] = useState(false);
  const [isOpenedCoinList, setIsOpenedCoinList] = useState(false);

  const decimals = useMemo(() => coinInfo?.data.decimals || 0, [coinInfo?.data.decimals]);
  console.log(currentCoin, 'currentCoin');

  const currentCoinBaseAmount = useMemo(() => solanaData?.lamports || '0', [solanaData?.lamports]);
  console.log(currentCoinBaseAmount, decimals, '-----');

  const currentCoinDisplayAmount = useMemo(() => toDisplayDenomAmount(currentCoinBaseAmount, 9), [currentCoinBaseAmount, 9]);


  const errorMessage = useMemo(() => {
    if (!solanaAddressRegex.test(currentAddress)) {
      return t('pages.Wallet.Send.Entry.Aptos.index.invalidAddress');
    }

    if (address.toLowerCase() === currentAddress.toLowerCase()) {
      return t('pages.Wallet.Send.Entry.Aptos.index.invalidAddress');
    }

    if (currentCoinBaseAmount === '0') {
      return t('pages.Wallet.Send.Entry.Aptos.index.invalidAmount');
    }

    if (lte(currentDisplayAmount || '0', '0')) {
      return t('pages.Wallet.Send.Entry.Aptos.index.invalidAmount');
    }

    if (gt(currentDisplayAmount || '0', currentCoinDisplayAmount)) {
      return t('pages.Wallet.Send.Entry.Aptos.index.insufficientAmount');
    }

    return '';
  }, [address, currentAddress, currentCoinBaseAmount, currentCoinDisplayAmount, currentDisplayAmount, t]);

  const handleOnClickMax = () => {
    setCurrentDisplayAmount(currentCoinDisplayAmount);
  };
  console.log(currentAccount, 'currentAccount');


  const connection = new Connection('https://api.testnet.solana.com');
  const getBalance = async () => {
    console.log(123);

    const balance = await connection.getMinimumBalanceForRentExemption(1);
    const fromPubkey = new PublicKey(address ? address : '');//来源
    const toPubkey = new PublicKey(currentAddress ? currentAddress : '');//目的地址
    const lamports = 2;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    const message = VersionedMessage.deserialize(transaction.compileMessage().serialize());

    const { value } = await connection.getFeeForMessage(message);
    setGasValue(value ? value / 1e9 : 0.000005);

    // const balance = await connection.getFeeCalculatorForBlockhash();
    console.log(balance, 'banlance');
  }
  const encUtf8 = 'utf8';
  // const aesDecrypt = (message: any, key: any) => {
  //   // 假设密文格式为 IV:加密内容（Base64 编码）
  //   const [ivBase64, encryptedBase64] = message.split(':');
  //   console.log(ivBase64, encryptedBase64);
  //   console.log(message, key);

  //   const iv = Buffer.from(ivBase64, 'base64');

  //   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, encUtf8).slice(0, 32), iv);
  //   let decrypted = decipher.update(encryptedBase64, 'base64', encUtf8);
  //   decrypted += decipher.final(encUtf8);
  //   return decrypted;
  // }

  // function decrypt(content: string, key: any) { 
  //   return 
  // }

  function decrypt(content: any, key: any) {
    const bytes = CryptoJS.AES.decrypt(content, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }


  useEffect(() => {
    console.log(123);

    getBalance();
  }, []);

  return (
    <Container>
      <Div>
        <StyledInput
          // endAdornment={
          //   <>
          //     <InputAdornment position="end">
          //       <InputAdornmentIconButton onClick={() => setIsOpenedMyAddressBook(true)}>
          //         <AccountAddressIcon />
          //       </InputAdornmentIconButton>
          //     </InputAdornment>
          //     <InputAdornment position="start">
          //       <InputAdornmentIconButton onClick={() => setIsOpenedAddressBook(true)} edge="end">
          //         <AddressBook24Icon />
          //       </InputAdornmentIconButton>
          //     </InputAdornment>
          //   </>
          // }
          placeholder={t('pages.Wallet.Send.Entry.Aptos.index.recipientAddressPlaceholder')}
          onChange={(e) => setCurrentAddress(e.currentTarget.value)}
          value={currentAddress}
        />
      </Div>
      <Div sx={{ marginTop: '0.8rem' }}>
        {currentCoin && (
          <CoinButton
            currentCoin={currentCoin}
            isActive={isOpenedCoinList}
            onClick={() => {
              setIsOpenedCoinList(true);
            }}
          />
        )}
      </Div>
      <Div sx={{ marginTop: '0.8rem' }}>
        <StyledInput
          endAdornment={
            <InputAdornment position="end">
              <MaxButton type="button" onClick={handleOnClickMax}>
                <Typography variant="h7">MAX</Typography>
              </MaxButton>
            </InputAdornment>
          }
          placeholder={t('pages.Wallet.Send.Entry.Aptos.index.amountPlaceholder')}
          onChange={(e) => {
            console.log(e, 'e');

            if (!isDecimal(e.currentTarget.value, decimals || 0) && e.currentTarget.value) {
              return;
            }

            setCurrentDisplayAmount(e.currentTarget.value);
          }}
          value={currentDisplayAmount}
        />
      </Div>
      {/* 修改 */}
      <Div sx={{ marginTop: '0.8rem' }}>
        <DisableInput
          disabled
          startAdornment={
            <InputAdornment position="start">
              {t('balance')}
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              {currentCoinDisplayAmount}
            </InputAdornment>
          }
        />
      </Div>
      <Div sx={{ marginTop: '0.8rem' }}>
        <DisableInput
          disabled
          startAdornment={
            <InputAdornment position="start">
              {t('gas')}
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              {gasValue}
            </InputAdornment>
          }
        />
      </Div>

      <BottomContainer>
        <Tooltip varient="error" title={errorMessage} placement="top" arrow>
          <div>
            <Button
              type="button"
              // disabled={!!errorMessage}
              onClick={async () => {
                // console.log(address);
                // console.log(currentAccount);
                // console.log(currentAddress);
                const { currentPassword } = await extensionSessionStorage();
                // // console.log(await extensionSessionStorage());
                // // console.log(currentAccount.encryptedMnemonic);
                console.log(decrypt(currentAccount.encryptedMnemonic, currentPassword));
                // console.log(LAMPORTS_PER_SOL, address);
                console.log(Uint8Array.from(address));
                const mnemonic = decrypt(currentAccount.encryptedMnemonic, currentPassword);
                // const path = "m/44'/501'/0'/0'";
                // const seed = bip39.mnemonicToSeedSync(decrypt(currentAccount.encryptedMnemonic, currentPassword));
                // const root = hdkey.EthereumHDKey.fromMasterSeed(seed);
                // let pays = Keypair.fromSecretKey(Uint8Array.from(address));
                // const child = root.derivePath(path);
                // const privateKey = child.getWallet().getPrivateKey();
                // const keypair = Keypair.fromSeed(privateKey.slice(0, 32));
                // const publicKey = keypair.publicKey.toBuffer();
                // console.log(publicKey);
                // console.log(pays);
                console.log(mnemonic);
                
                const seed = bip39.mnemonicToSeedSync(mnemonic);
                console.log(seed);
                
                const keypair = Keypair.fromSeed(seed.slice(0, 32));
                console.log(keypair);
                

                console.log('------=-------');

                let secretKey = Uint8Array.from([254, 233, 47, 184, 38, 87, 109, 215, 23, 19, 232, 58, 158, 100, 20, 113, 114, 166, 245, 54, 156, 124, 150, 200, 102, 168, 189, 23, 167, 217, 250, 37, 4, 250, 253, 205, 123, 153, 120, 40, 76, 97, 155, 241, 245, 242, 16, 124, 107, 84, 183, 155, 167, 20, 153, 15, 155, 181, 72, 219, 246, 224, 14, 112])
                let payx = Keypair.fromSecretKey(secretKey); //导入账号
                console.log(payx);

                return;
              }}
            >
              {t('pages.Wallet.Send.Entry.Aptos.index.sendButton')}
            </Button>
          </div>
        </Tooltip>
      </BottomContainer>

      <AddressBookBottomSheet
        open={isOpenedAddressBook}
        onClose={() => setIsOpenedAddressBook(false)}
        onClickAddress={(a) => {
          setCurrentAddress(a.address);
        }}
      />

      <AccountAddressBookBottomSheet
        open={isOpenedMyAddressBook}
        hasCurrentAccount={false}
        chain={chain}
        onClose={() => setIsOpenedMyAddressBook(false)}
        onClickAddress={(a) => {
          setCurrentAddress(a);
        }}
      />

      <CoinListBottomSheet
        currentCoin={currentCoin}
        open={isOpenedCoinList}
        onClose={() => setIsOpenedCoinList(false)}
        onClickCoin={(coin) => {
          if (currentCoin?.type !== coin.type) {
            setCurrentCoin(coin);
            setCurrentDisplayAmount('');
          }
        }}
      />
    </Container >
  );
}
