```jsx
const { ModalFooter } = require('./lib/ModalFooter.js');
const { ModalBody } = require('./lib/ModalBody.js');
initialState = { isOpen: false };
<div>
  <Button onClick={() => setState({ isOpen: true })}>Open Modal</Button>
  <Modal isOpen={state.isOpen} onRequestClose={() => setState({ isOpen: false })}>
    <ModalBody>This is the example modal</ModalBody>
    <ModalFooter>
      <div style={{ display: 'flex' }}>
        <Button color="nuetral" onClick={() => setState({ isOpen: false })}>
          Close
        </Button>
        <Button style={{ marginLeft: '0.5rem' }} onClick={() => setState({ isOpen: false })}>
          Next
        </Button>
      </div>
    </ModalFooter>
  </Modal>
</div>;
```
