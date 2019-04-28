import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import { useSpring, animated } from 'react-spring';
import { IconWarning } from 'components/icons';
import theme from 'renderer/components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;
  return {
    background: {
      info: colors.info,
      danger: colors.danger,
      success: colors.success,
      warning: colors.warning,
    },
    color: {
      info: colors.N800,
      danger: colors.N0,
      success: colors.N0,
      warning: colors.N800,
    },
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const NotificationWrapper = styled(animated.div)`
  width: 100%;
  height: ${p => (p.haschildren === 'true' ? '3rem' : 0)};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => styledProps(computedThemeStyle(p).background, 'variant')(p)};
  color: ${p => styledProps(computedThemeStyle(p).color, 'variant')(p)};
`;

const Icon = styled.div`
  margin-right: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomNotification = p => {
  const { children, ...restProps } = p;
  const springProps = useSpring({ opacity: children ? 1 : 0 });

  return (
    <NotificationWrapper style={springProps} {...restProps} haschildren={(!!children).toString()}>
      <Flex>
        <Icon>
          <IconWarning
            size="1rem"
            light
            color={styledProps(computedThemeStyle(p).color, 'variant')(p)}
          />
        </Icon>
        {children}
      </Flex>
    </NotificationWrapper>
  );
};

const Notification = styled(CustomNotification)``;

Notification.defaultProps = {
  variant: 'warning',
  theme,
  themeKey: 'Notification',
  themeStyle: {},
};

Notification.propTypes = {
  theme: PropTypes.object.isRequired,
  themeKey: PropTypes.string.isRequired,
  themeStyle: PropTypes.object,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
};

Notification.displayName = 'Notification';

/** @component */
export default Notification;
