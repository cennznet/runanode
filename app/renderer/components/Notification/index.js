import React from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

import { colors } from 'renderer/theme';
import { IconWarning } from 'components/icons';

const NotificationWrapper = styled(animated.div)`
  width: 100%;
  height: ${p => (p.haschildren ? '3rem' : 0)};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.warning};
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
    <NotificationWrapper style={springProps} haschildren={!!children}>
      <Flex>
        <Icon>
          <IconWarning size="1rem" light color={colors.N800} />
        </Icon>
        {children}
      </Flex>
    </NotificationWrapper>
  );
};

export default Notification;
