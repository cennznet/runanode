```jsx
initialState = { selected: { label: 'World', value: 'world' } };
<Select
  value={state.selected}
  options={[{ label: 'Hello', value: 'hello' }, { label: 'World', value: 'world' }]}
  onChange={selected =>
    setState({
      selected,
    })
  }
/>;
```
