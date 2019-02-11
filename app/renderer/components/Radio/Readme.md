```jsx
const RadioGroup = styled.div`
  display: flex;

  label {
    margin-right: 1rem;
  }
`;

initialState = { selected: 'world' };

<RadioGroup>
  <Radio selected={state.selected} onChange={() => setState({ selected: 'hello' })} value={'hello'}>
    Hello
  </Radio>
  <Radio selected={state.selected} onChange={() => setState({ selected: 'world' })} value={'world'}>
    World
  </Radio>
</RadioGroup>;
```
