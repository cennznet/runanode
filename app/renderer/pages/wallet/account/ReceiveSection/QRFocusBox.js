import React from 'react';
import styled from 'styled-components';
import { colors } from 'theme';

const QRFocusBox = styled.div`
  position: relative;
  width: 11rem;
  height: 11rem;
  padding: 0.6rem;

  &:before,
  &:after,
  & > :first-child:before,
  & > :first-child:after {
    position: absolute;
    content: ' ';
    width: 2rem;
    height: 2rem;
    border-color: ${colors.N0};
    border-style: solid;
  }
  &:before {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }
  &:after {
    top: 0;
    right: 0;
    border-width: 2px 2px 0 0;
  }
  & > :first-child:before {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
  }
  & > :first-child:after {
    bottom: 0;
    left: 0;
    border-width: 0 0 2px 2px;
  }
`;

export default QRFocusBox;
