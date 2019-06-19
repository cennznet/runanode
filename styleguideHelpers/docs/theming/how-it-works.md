### Default theme defination

In each of themable components, `themeKey` and `themeStyle` are the two available props for customising components, taking the example of `Tooltip` component.

The default props of `Tooltip` is like:

```jsx static
Tooltip.defaultProps = {
  themeKey: 'Tooltip',
  themeStyle: {}
};
```

The default style of `Tooltip` is like:

```jsx static
  Tooltip: {
    background: 'grey',
    color: 'white'
  }
```

#### Here are the approaches could be considered for customising a component:

### Option 1: Customizing theme via themeStyle prop
```jsx static
<Tooltip themeStyle={{
  background: 'purple',
  // color: 'white'
}}>
  This is a tooltip.
</Tooltip>
```

This one Tooltip will have a `purple` background whereas other Tooltips in your app are still have grey background.

### Option 2: Customizing theme via component theming configure files

If you wanna customize all Tooltips in your app to have `black` background, could check out `yourApp/src/themes/dark/appComponentStyle.js`, and style could be defined like:

```jsx static
{
  Tooltip: {
    background: 'black',
    // color: 'white'
  }
}
```

### Option 3: Customizing theme via defining themeKey

You should be aware that theming overriding has priorites, that means, component theming defined as `Tooltip` themeKey in configure file (e.g. `appComponentStyle.js`) will override theming defined in component `themeStyle` prop. Taking the example of option 1 and option 2 above, all Tooltips would have `black` background if you taking actions on both option 1 and option 2.

But what if you only want to customize one Tooltip to have `red` background, and leave other?

You could assign a new `themeKey` to the Tooltip and assign new theming defination to that new `themeKey`, like:

```jsx static
// In staking page for example
<Tooltip themeKey='AppStakingPageTooltip'>This is a tooltip in staking page</Tooltip>
```

```jsx static
// yourApp/src/themes/dark/appComponentStyle.js

{
  AppStakingPageTooltip: {
    background: 'yellow',
    // color: 'white'
  }
}
```

Then the background color of staking page tooltip would be `yellow`, whereas other tooltips are still `grey/purple/black` which depends on which options did you take.

### Option 4: Advanced customizing

If the component designed is absolutely different from the themable component, you should consider to customize it on your own.
