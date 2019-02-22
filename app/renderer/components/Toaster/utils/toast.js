import React from 'react';
import styled from 'styled-components';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-toastify/dist/ReactToastify.css';
import { colors } from 'renderer/theme';
import IconSuccess from './IconSuccess';
import IconWarning from './IconWarning';
import IconDanger from './IconDanger';
import IconInfo from './IconInfo';

const ToasterInfoWrapper = styled.div`
  display: flex;
  height: 5rem;
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
  warn: { color: colors.warning, title: 'Warning', Icon: IconWarning },
  info: { color: colors.info, title: 'Warning', Icon: IconInfo },
  error: { color: colors.danger, title: 'Error', Icon: IconDanger },
};

export const setToaster = (toasterStatus = 'success', toasterText) => {
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
    </ToasterInfoWrapper>
  );
};
