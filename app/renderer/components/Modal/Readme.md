```jsx
initialState = { isOpen: false };
<div>
  <Button onClick={() => setState({ isOpen: true })}>Open Modal</Button>
  <Modal
    isOpen={state.isOpen}
    footer
    rightBtnLabel="Confirm"
    rightBtnFn={() => setState({ isOpen: false })}
    leftBtnLabel="Close"
    leftBtnFn={() => setState({ isOpen: false })}
    descLabel="Here is modal footer note"
  >
    This is the example modal
  </Modal>
</div>;
```
