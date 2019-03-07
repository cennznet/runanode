import React, { useEffect, useState } from 'react';
import { Select } from 'components';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import useApis from '../stakingOverviewPage/useApis';

const cennzAssetId = '0';
const cpayAssetId = '10';

const StakingAccountBalances = ({ stakingOption }) => {
  console.log('stakingOption', stakingOption);
  const {
    value: stakingAccount,
    wallet: { accounts },
  } = stakingOption;

  const { assets } = accounts[stakingAccount];
  const cennzFreeBalance = assets[cennzAssetId].freeBalance.toString;
  const cpayFreeBalance = assets[cpayAssetId].freeBalance.toString;

  return (
    <div>
      <div>CENNZ Balances: {cennzFreeBalance}</div>
      <div>CENTRAPAY Balances : {cpayFreeBalance}</div>
    </div>
  );
};

export default StakingAccountBalances;
