import React from 'react';
import Button from 'components/Button';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const ModalFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: 1rem;
  border-top: ${p => `1px solid ${colors.N500}`};
`;

const ButtonGroup = styled.div`
  display: flex;
`;

const BottonWrapper = styled.div`
  margin-right: 0.25rem;
  margin-left: 0.25rem;
`;

const FooterNote = styled.div`
  color: ${colors.N0};
  font-size: 14px;
  flex: 1;
  line-height: 1rem;
`;

const ModalFooter = ({
  rightBtnLabel,
  rightBtnFn,
  rightBtnColor,
  rightBtnDisabled,
  rightBtnLoading,
  rightComponent,
  rightBtnStyles,

  leftBtnLabel,
  leftBtnFn,
  leftBtnColor,
  leftBtnDisabled,
  leftComponent,
  leftBtnStyles,

  descLabel,
  descComponent,
}) => {
  const isLayoutReverse = !(leftBtnLabel || leftComponent);
  const leftComp =
    leftComponent ||
    (leftBtnLabel && (
      <Button
        color={leftBtnColor || 'nuetral'}
        disabled={leftBtnDisabled}
        onClick={leftBtnFn}
        flat
        {...leftBtnStyles}
      >
        {leftBtnLabel}
      </Button>
    ));
  const rightComp =
    rightComponent ||
    ((rightBtnLabel || rightBtnLoading) && (
      <Button
        color={leftBtnColor || 'warning'}
        disabled={rightBtnDisabled}
        onClick={rightBtnFn}
        loading={rightBtnLoading}
        {...rightBtnStyles}
      >
        {rightBtnLabel}
      </Button>
    ));

  const descComp = descComponent ? (
    <FooterNote>{descComponent}</FooterNote>
  ) : (
    descLabel && <FooterNote>{descLabel}</FooterNote>
  );

  return (
    <ModalFooterWrapper>
      <ButtonGroup>
        <BottonWrapper>{leftComp}</BottonWrapper>
        <BottonWrapper>{rightComp}</BottonWrapper>
      </ButtonGroup>
      {descComp}
    </ModalFooterWrapper>
  );
};

export default ModalFooter;
