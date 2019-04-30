import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from 'components/defaultTheme';
import styledProps from 'styled-props';
import { IconSuccess, IconWarning, IconDanger, IconInfo } from 'components/icons';

const ToasterInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToasterInfoContent = styled.div``;

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    color: {
      info: colors.info,
      error: colors.danger,
      success: colors.success,
      warning: colors.warning,
    },
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const ToasterTitle = styled.div`
  color: ${p => styledProps(computedThemeStyle(p).color, 'status')(p)};
`;

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  height: 100%;
`;

const ToasterMessage = styled.div`
  font-weight: 500;
  margin-top: 0.5rem;
`;

const statusMap = {
  success: { title: 'Success', Icon: IconSuccess },
  warning: { title: 'Warning', Icon: IconWarning },
  info: { title: 'Information', Icon: IconInfo },
  error: { title: 'Error', Icon: IconDanger },
};

export default (toasterStatus = 'info', toasterText, options) => {
  const { title, Icon } = statusMap[toasterStatus];
  const iconColor = computedThemeStyle({ theme }).color[toasterStatus];

  toast[toasterStatus](
    <ToasterInfoWrapper>
      <IconBox>
        <Icon color={iconColor} />
      </IconBox>

      <ToasterInfoContent>
        <ToasterTitle status={toasterStatus}>{title}</ToasterTitle>
        <ToasterMessage>{toasterText}</ToasterMessage>
      </ToasterInfoContent>
    </ToasterInfoWrapper>,
    options
  );
};

ToasterTitle.defaultProps = {
  theme,
  themeKey: 'Toaster',
};
