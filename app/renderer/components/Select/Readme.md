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

```jsx
const frameworkOptions = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
];

const typeOptions = [
  { label: 'Javascript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Flow Type', value: 'flowType' },
];

const groupedOptions = [
  { label: 'Framework', options: frameworkOptions },
  { label: 'DataType', options: typeOptions },
];

<Select
  defaultValue={''}
  options={groupedOptions}
  formatGroupLabel={data => <div>data.label</div>}
/>;
```
