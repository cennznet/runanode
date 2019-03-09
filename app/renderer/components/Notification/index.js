import React from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

import { colors } from 'renderer/theme';
import { IconWarning } from 'components/icons';

const NotificationWrapper = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.warning};
  color: ${colors.N800};
`;

const Icon = styled.div`
  margin-right: 0.5rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Notification = ({ children }) => {
  const springProps = useSpring({ opacity: children ? 1 : 0 });

  return (
    <animated.div style={springProps}>
      <NotificationWrapper>
        <Flex>
          <Icon>
            <IconWarning size="1rem" light color={colors.N800} />
          </Icon>
          {children}
        </Flex>
      </NotificationWrapper>
    </animated.div>
  );
};

export default Notification;
