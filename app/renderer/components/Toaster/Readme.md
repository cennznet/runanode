```jsx
const { setToaster } = require('./utils/toast');

<DemoFlex>
  <Button color="success" onClick={() => setToaster('success', 'This is a success toaster')}>
    Success
  </Button>
  <Button color="danger" onClick={() => setToaster('error', 'This is an error toaster')}>
    danger
  </Button>
  <Button color="warning" onClick={() => setToaster('warn', 'This is a warning toaster')}>
    Warning
  </Button>
  <Button color="info" onClick={() => setToaster('info', 'This is an info toaster')}>
    Information
  </Button>
  <Toaster />
</DemoFlex>;
```
