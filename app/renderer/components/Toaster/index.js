import React from 'react';
import styled from 'styled-components';
import { ToastContainer, Slide } from 'react-toastify';
import { colors } from 'renderer/theme';
import IconCross from './utils/IconCross';

const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  outline: none;
  border: 0;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: 0;
  }
`;

const CloseButton = ({ closeToast }) => (
  <IconButton onClick={closeToast}>
    <IconCross />
  </IconButton>
);

const CustomToast = ({ children, ...props }) => {
  return (
    <ToastContainer transition={Slide} autoClose={5000} closeButton={<CloseButton />} {...props}>
      {children}
    </ToastContainer>
  );
};

const Toaster = styled(CustomToast)`
  margin-top: 4.5rem;

  .Toastify__toast {
    font-weight: 500;
    padding: 0;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.18), 0 1px 1px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.1);
    background-color: #020835;
    border-radius: 3px;

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
