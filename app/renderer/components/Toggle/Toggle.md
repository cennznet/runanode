```jsx
initialState = { selected: false };

<DemoFlex>
  <label>
    <Toggle
      defaultChecked={state.selected}
      onChange={e => {
        setState({ selected: !state.selected });
      }}
    />
    <span>SUCCESS</span>
  </label>

  <label>
    <Toggle
      disabled
      defaultChecked={state.selected}
      onChange={e => {
        setState({ selected: !state.selected });
      }}
    />
    <span>DISABLED</span>
  </label>
</DemoFlex>;
```
