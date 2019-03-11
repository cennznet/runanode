import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { colors } from 'renderer/theme';
import { IconSuccess, IconWarning, IconDanger, IconInfo } from 'components/icons';

const ToasterInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToasterInfoContent = styled.div``;

const ToasterTitle = styled.div`
  color: ${p => p.color};
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
  success: { color: colors.success, title: 'Success', Icon: IconSuccess },
  warning: { color: colors.warning, title: 'Warning', Icon: IconWarning },
  info: { color: colors.info, title: 'Information', Icon: IconInfo },
  error: { color: colors.danger, title: 'Error', Icon: IconDanger },
};

export default (toasterStatus = 'info', toasterText, options) => {
  const { color, title, Icon } = statusMap[toasterStatus];
  toast[toasterStatus](
    <ToasterInfoWrapper>
      <IconBox>
        <Icon color={color} />
      </IconBox>

      <ToasterInfoContent>
        <ToasterTitle color={color}>{title}</ToasterTitle>
        <ToasterMessage>{toasterText}</ToasterMessage>
      </ToasterInfoContent>
    </ToasterInfoWrapper>,
    options
  );
};
