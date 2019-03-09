```jsx
initialState = { content: '' };

<div>
  <Notification>{state.content}</Notification>
  <DemoFlex>
    <Button
      onClick={() =>
        setState(
          'This is a warning notification bar which gonna be positioned to the top of screen'
        )
      }
    >
      Show
    </Button>
    <Button onClick={() => setState('')}>Hide</Button>
  </DemoFlex>
</div>;
```
