import React from 'react';
import { Select } from 'components';
import { components } from 'react-select';
import styled from 'styled-components';
import { colors } from 'theme';
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

const PublicAddressDetail = styled.div`
  margin: 0.8rem 0;
`;

const SingleValue = ({ children, ...props }) => {
  const { data } = props;
  const { groupName } = data || 'Wallet';
  return <components.SingleValue {...props}>{`${groupName} : ${children}`}</components.SingleValue>;
};

const SelectStakingAccount = ({ wallets, onSelectFn, stakingOption }) => {
  const groupedOptions =
    Array.isArray(wallets) &&
    wallets.map(wallet => {
      const { name, accounts = {} } = wallet;
      const groupName = name || 'Wallet';
      const accountsKeys = Object.keys(accounts);
      const groupedAccountsOptions = accountsKeys.map(key => {
        const optionName = accounts[key].name || 'Account 1';

        return { label: optionName, value: key, groupName, wallet };
      });

      return { label: groupName, options: groupedAccountsOptions };
    });

  return (
    <div>
      <StepDescription>Step 1: Start staking by choosing an account from dropdown.</StepDescription>
      <SelectTitle>Choose an account to stake</SelectTitle>
      <Select
        placeholder="Select from dropdown."
        options={groupedOptions}
        formatGroupLabel={data => <WalletName>{data.label}</WalletName>}
        styles={{ option: styles => ({ ...styles, paddingLeft: '1.5rem' }) }}
        onChange={option => onSelectFn(option)}
        components={{ SingleValue }}
      />
      {stakingOption && (
        <PublicAddressDetail>Public address : {stakingOption.value}</PublicAddressDetail>
      )}
    </div>
  );
};

export default SelectStakingAccount;
