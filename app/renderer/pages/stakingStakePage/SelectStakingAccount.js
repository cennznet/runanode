import React from 'react';
import { Select } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { getConstantValue } from 'typescript';

const StepDescription = styled.div`
  margin: 1.5rem 0;
`;

const SelectTitle = styled.div`
  margin: 0.5rem 0;
  font-weight: 600;
  font-size: 16px;
`;

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
      <StepDescription>
        Step 1: Start staking by choosing an account from dropdown.{' '}
      </StepDescription>
      <SelectTitle>Choose an account to stake</SelectTitle>
      <Select
        placeholder="Select from dropdown."
        options={groupedOptions}
        formatGroupLabel={data => <WalletName>{data.label}</WalletName>}
        styles={{ option: styles => ({ ...styles, paddingLeft: '1.5rem' }) }}
        onChange={value => console.log(getConstantValue)}
      />
    </div>
  );
};

export default SelectStakingAccount;
