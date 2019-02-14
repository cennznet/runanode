import React from 'react';
import styled from 'styled-components';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-toastify/dist/ReactToastify.css';
import { colors } from 'renderer/theme';
import IconSuccess from './IconSuccess';
import IconWarning from './IconWarning';
import IconDanger from './IconDanger';

const ToasterInfoWrapper = styled.div`
  display: flex;
  height: 5rem;
  align-items: center;
`;

const ToasterInfoContent = styled.div`
  padding-left: 1rem;
`;

const Title = styled.div`
  color: ${colors.success};
`;

const Wrapper = styled.div`
  display: flex;
  border-radius: 3px;
  font-size: 12px;
  box-shadow: 0 2px 8px ${colors.border};
  width: 18rem;
  background-color: ${colors.N0};
  position: relative;
  user-select: none;

  & + & {
    margin-top: 0.5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 0.5rem;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.N0};
`;

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.8rem;
  background: ${colors.success};
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  height: 100%;
`;

const SuccessMessage = styled.div`
  font-weight: 500;
  margin-top: 0.5rem;
`;

export const successToast = scuessText => {
  console.log('!!!successToast');
  toast.success(
    <ToasterInfoWrapper>
      <IconBox>
        <IconSuccess color={colors.N0} />
      </IconBox>

      <ToasterInfoContent>
        <Title>Success</Title>
        <SuccessMessage>{scuessText}</SuccessMessage>
      </ToasterInfoContent>
    </ToasterInfoWrapper>
  );
};
