import React from 'react';
import { Select } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const WalletName = styled.div`
  font-size: 14px;
  color: ${colors.textMuted};
  padding: 0.5rem 0;
`;

const SelectStakingAccount = ({ wallets, onSelectFn }) => {
  const groupedOptions =
    Array.isArray(wallets) &&
    wallets.map(wallet => {
      const { name, accounts = {} } = wallet;
      const groupName = name || 'Wallet';
      const accountsKeys = Object.keys(accounts);
      const groupedAccountsOptions = accountsKeys.map(key => {
        const optionName = accounts[key].name || key || 'Error';
        return { label: optionName, value: key };
      });

      return { label: groupName, options: groupedAccountsOptions };
    });

  return (
    <div>
      <Select
        placeholder="Please select an account to stake"
        options={groupedOptions}
        formatGroupLabel={data => <WalletName>{data.label}</WalletName>}
      />
    </div>
  );
};

export default SelectStakingAccount;
