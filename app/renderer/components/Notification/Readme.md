```jsx
initialState = {
  content: 'This is a warning notification bar which gonna be positioned to the top of screen',
};

<div>
  <Notification>{state.content}</Notification>
  <DemoFlex>
    <Button
      onClick={() =>
        setState({
          content: state.content ? '' : initialState.content,
        })
      }
    >
      Toogle Notification
    </Button>
  </DemoFlex>
</div>;
```
