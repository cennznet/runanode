```jsx
const DemoSubNav = styled(SubNav)`
  height: 20rem;
`;

const menuList = [
  {
    title: 'Wallet 1',
    navItems: [
      {
        label: 'account 1',
        link: '/',
      },
      {
        label: 'account 2',
        link: '/',
      },
      {
        label: 'account 3',
        link: '/',
      },
    ],
  },
  {
    title: 'Wallet 2',
    navItems: [
      {
        label: 'account a',
        link: '/',
      },
      {
        label: 'account b',
        link: '/',
      },
      {
        label: 'account c',
        link: '/',
      },
    ],
  },
];

const navItems = [
  {
    label: 'Settings',
    link: '/',
  },
  {
    label: 'Terms and Conditions',
    link: '/',
  },
  {
    label: 'About',
    link: '/',
  },
];

<DemoFlex justifyContent="space-between">
  <DemoSubNav footer={<Button>Add wallet</Button>}>
    <CollapsibleMenu menuList={menuList} isInsideRouter={false} />
  </DemoSubNav>
  <DemoSubNav>
    <SimpleMenu navItems={navItems} isInsideRouter={false} />
  </DemoSubNav>
</DemoFlex>;
```
