```jsx
<DemoFlex>
  <Button
    color="success"
    onClick={() =>
      toast('success', 'This is a success toaster', {
        autoClose: 100000,
      })
    }
  >
    Success
  </Button>
  <Button color="danger" onClick={() => toast('error', 'This is an error toaster')}>
    Error
  </Button>
  <Button color="warning" onClick={() => toast('warning', 'This is a warning toaster')}>
    Warning
  </Button>
  <Button color="info" onClick={() => toast('info', 'This is an info toaster')}>
    Information
  </Button>
  <Toaster />
</DemoFlex>
```
