import mergeOptions from 'merge-options';

export const createThemeStyle = (componentProps, defaultThemeStyle) => {
  const props = mergeOptions(
    {
      theme: {
        components: {},
      },
      themeStyle: {},
      themeKey: '',
    },
    componentProps
  );

  return mergeOptions(
    {},
    defaultThemeStyle(props),
    props.themeStyle,
    props.theme.components[props.themeKey]
  );
};
