```jsx
<DemoFlex>
  <Button
    variant="success"
    onClick={() =>
      toast('success', 'This is a success toaster', {
        autoClose: 100000,
      })
    }
  >
    Success
  </Button>
  <Button variant="danger" onClick={() => toast('error', 'This is an error toaster')}>
    Error
  </Button>
  <Button variant="warning" onClick={() => toast('warning', 'This is a warning toaster')}>
    Warning
  </Button>
  <Button variant="info" onClick={() => toast('info', 'This is an info toaster')}>
    Information
  </Button>
  <Toaster />
</DemoFlex>
```
