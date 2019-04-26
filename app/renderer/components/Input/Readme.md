```jsx
<DemoFlex>
  <Input prepend="prepend" append="append" prefix="prefix" suffix="suffix" />
  <Input placeholder="Placehoder..." />
  <Input placeholder="Read only" readOnly />
</DemoFlex>
```

```jsx
const button = (
  <Button inputSuffix onClick={() => alert('Button was clicked!')}>
    Submit
  </Button>
);
<DemoFlex>
  <Input suffix="spinner" size='sm' placeholder='small' />
  <Input suffix={button} />
  <Input size='lg' placeholder='large' />
</DemoFlex>;
```

```jsx
<DemoFlex justifyContent="space-between">
  <Input valid />
  <Input valid showValidIcon />
  <Input valid={false} />
  <Input valid={false} showValidIcon />
</DemoFlex>
```
