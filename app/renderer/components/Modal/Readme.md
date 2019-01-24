```jsx
initialState = { isOpen: false };
<div>
  <Button onClick={() => setState({ isOpen: true })}>Open Modal</Button>
  <Modal
    isOpen={state.isOpen}
    footer={
      <Button color="warning" onClick={() => setState({ isOpen: false })}>
        Close
      </Button>
    }
  >
    This is the example modal
  </Modal>
</div>;
```
