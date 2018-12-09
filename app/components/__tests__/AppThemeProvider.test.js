import React from 'react';
import AppThemeProvider from '../AppThemeProvider';

describe('AppThemeProvider', () => {
  describe('render', () => {
    test('should load theme', () => {
      const theme = {};
      const Component = (
        <AppThemeProvider theme={theme}>
          <div>test</div>
        </AppThemeProvider>
      );
      const wrapper = shallow(Component);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
