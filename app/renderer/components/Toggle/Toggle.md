```jsx
initialState = { selected: false };

const Label = styled.label`
  display: flex;
  align-items: center;

  span {
    margin-left: 0.3rem;
  }
`;

<DemoFlex>
  <Label>
    <Toggle
      defaultChecked={state.selected}
      onChange={e => {
        setState({ selected: !state.selected });
      }}
    />
    <span>SUCCESS</span>
  </Label>

  <Label>
    <Toggle
      disabled
      defaultChecked={state.selected}
      onChange={e => {
        setState({ selected: !state.selected });
      }}
    />
    <span>DISABLED</span>
  </Label>
</DemoFlex>;
```
