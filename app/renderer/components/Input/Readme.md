```jsx
<Input prepend="prepend" append="append" prefix="prefix" suffix="suffix" />
```

```jsx
const button = (
  <Button inputSuffix onClick={() => alert('Button was clicked!')}>
    Submit
  </Button>
);
<Input suffix={button} />;
```

```jsx
<Input suffix="spinner" />
```

```jsx
<Input placeholder="Disabled" disabled />
```

```jsx
<Input value="Readonly" readOnly />
```
