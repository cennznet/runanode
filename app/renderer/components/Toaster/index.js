import React from 'react';
import styled from 'styled-components';
import { ToastContainer, Slide } from 'react-toastify';
import { colors } from 'renderer/theme';

const CustomToast = ({ children, ...props }) => {
  return (
    <ToastContainer transition={Slide} autoClose={80000} hideProgressBar {...props}>
      {children}
    </ToastContainer>
  );
};

const Toaster = styled(CustomToast)`
  .Toastify__toast {
    font-weight: 600;
    padding: 0;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.18), 0 1px 1px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.1);

    &.Toastify__toast--success {
      background-color: #020835;
    }

    &.Toastify__toast--error {
      background: ${colors.R500};
    }

    &.Toastify__toast--warning {
      background: ${colors.Y500};
    }

    &.Toastify__toast--info {
      background: ${colors.B500};
    }
  }
`;

export default Toaster;
