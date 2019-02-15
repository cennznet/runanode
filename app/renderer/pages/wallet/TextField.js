import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { Input } from 'components';
import { colors } from 'renderer/theme';

const Label = styled.label`
  margin: 0.5rem 0.5rem 0 0;
  color: ${colors.N0};
  font-size: 16px;	
  font-weight: 600;	
  line-height: 22px;
`;

const Wrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  height: 1.2rem;
  color: ${colors.danger};
`;

const ErrorMessagePleaceHolder = styled.div`
  margin-top: 0.5rem;
  height: 1.2rem;
`;

const TextField = ({
  field, // Formik prop - { name, value, onChange, onBlur }
  form, // Formik prop - { touched, errors }, also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  labelText,
  placeholder,
  noTickShow,
  width,
  minWidth,
}) => {
  const { name, value, onChange, onBlur } = field;
  const { touched, errors } = form;
  const fieldError = R.path(R.split('.')(name))(errors);
  const fieldTouched = R.path(R.split('.')(name))(touched);
  return (
    <Wrapper style={{minWidth, width}}>
      {labelText && <Label htmlFor={name}>{labelText}</Label>}
      <Input
        value={value || ''}
        {...{ placeholder, name, onChange, onBlur }}
        valid={fieldTouched ? (noTickShow && !fieldError ? null : !fieldError) : null}
      />
      {fieldError && fieldTouched ? <ErrorMessage>{fieldError}</ErrorMessage> : <ErrorMessagePleaceHolder />}
    </Wrapper>
  );
};

export default TextField;
