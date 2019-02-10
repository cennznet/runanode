```jsx
<Input prepend="prepend" append="append" prefix="prefix" suffix="suffix" />
```

```jsx
const button = (
  <Button inputSuffix onClick={() => alert('Button was clicked!')}>
    Submit
  </Button>
);
<DemoFlex justifyContent="space-between">
  <Input suffix={button} />
  <Input suffix="spinner" />
  <Input placeholder="Disabled" disabled />
</DemoFlex>;
```
