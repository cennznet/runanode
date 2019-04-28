```jsx
initialState = { selected: false };
<DemoFlex>
  <Checkbox
    checked={state.selected}
    onChange={e => {
      setState({ selected: !state.selected });
    }}
  >
    Hello
  </Checkbox>
  <Checkbox
    variant="danger"
    checked={state.selected}
    onChange={e => {
      setState({ selected: !state.selected });
    }}
  >
    Danger
  </Checkbox>
  <Checkbox disabled>Disabled</Checkbox>
  <Checkbox themeStyle={{ color: { primary: 'pink' } }}>Custom</Checkbox>
</DemoFlex>;
```
