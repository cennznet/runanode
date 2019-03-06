```jsx
<DemoFlex>
  <Input prepend="prepend" append="append" prefix="prefix" suffix="suffix" />
  <Input placeholder="Normal input" />
</DemoFlex>
```

```jsx
const button = (
  <Button inputSuffix onClick={() => alert('Button was clicked!')}>
    Submit
  </Button>
);
<DemoFlex>
  <Input suffix={button} />
  <Input suffix="spinner" />
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
