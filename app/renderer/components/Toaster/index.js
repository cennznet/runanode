import React from 'react';
import styled from 'styled-components';
import { ToastContainer, Slide } from 'react-toastify';
import { colors } from 'renderer/theme';
import IconCross from './utils/IconCross';

const CloseButton = styled(IconCross)`
  padding: 1rem;
`;

const CustomToast = ({ children, ...props }) => {
  return (
    <ToastContainer transition={Slide} autoClose={500000} {...props} closeButton={<CloseButton />}>
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
    background-color: #020835;

    .Toastify__close-button {
      padding: 1rem;
      font-size: 0.8rem;
      opacity: 0.6;
    }

    &.Toastify__toast--success {
      .Toastify__progress-bar {
        background: ${colors.success};
      }
    }

    &.Toastify__toast--error {
      .Toastify__progress-bar {
        background: ${colors.danger};
      }
    }

    &.Toastify__toast--warning {
      .Toastify__progress-bar {
        background: ${colors.warning};
      }
    }

    &.Toastify__toast--info {
      .Toastify__progress-bar {
        background: ${colors.info};
      }
    }
  }
`;

export default Toaster;
