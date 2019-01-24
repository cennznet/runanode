```jsx
initialState = { selected: false };
<div>
  <Checkbox
    checked={state.selected}
    onChange={e => {
      setState({ selected: !state.selected });
    }}
  >
    Hello
  </Checkbox>
  <Checkbox
    color="danger"
    checked={state.selected}
    onChange={e => {
      setState({ selected: !state.selected });
    }}
  >
    Danger
  </Checkbox>
  <Checkbox disabled>Disabled</Checkbox>
  <Checkbox themeStyles={{ color: { primary: 'black' } }}>Custom</Checkbox>
</div>;
```
