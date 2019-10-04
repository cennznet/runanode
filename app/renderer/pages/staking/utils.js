import { PreDefinedAssetId } from 'common/types/theNode.types';

export const reorderList = (arryList, fromIndex, toIndex = 0) => {
  if (Array.isArray(arryList)) {
    arryList.splice(toIndex, 0, arryList.splice(fromIndex, 1)[0]);
    return arryList;
  }
  return [];
};

export const sortedListWithBalances = (accountList, premierAccount, setValueFn) => {
  if (accountList) {
    const index = accountList.indexOf(premierAccount);
    const reorderAccountList = index === -1 ? accountList : reorderList(accountList, index);
    Promise.all(
      reorderAccountList.map(async account => {
        const stakingTokenBalance = await window.appApi.getGenericAssetFreeBalance(
          PreDefinedAssetId.stakingToken,
          account
        );
        return (
          stakingTokenBalance && {
            address: account,
            stakingTokenBalance: stakingTokenBalance.toString(10),
          }
        );
      })
    ).then(result => setValueFn(result));
  }
};
