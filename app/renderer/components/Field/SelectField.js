import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { Select } from 'components';
import { colors } from 'theme';

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${colors.text};
  font-size: 16px;
  font-weight: 600;
`;

const Wrapper = styled.div``;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  height: 1.2rem;
  color: ${colors.danger};
`;

const ErrorMessagePleaceHolder = styled.div`
  margin-top: 0.5rem;
  height: 1.2rem;
`;

const SelectField = ({
  field, // Formik prop - { name, value, onChange, onBlur }
  form, // Formik prop - { touched, errors }, also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  labelText,
  placeholder,
  noTickShow,
  options,
  width,
}) => {
  const { name, value, onChange, onBlur } = field;
  const { touched, errors, setFieldValue } = form;
  const fieldError = R.path(R.split('.')(name))(errors);
  const fieldTouched = R.path(R.split('.')(name))(touched);
  return (
    <Wrapper style={{ width }}>
      {labelText && <Label htmlFor={name}>{labelText}</Label>}
      <Select
        value={value}
        options={options}
        onChange={option => {
          return setFieldValue(name, option);
        }}
      />
      {fieldError && fieldTouched ? (
        <ErrorMessage>{fieldError}</ErrorMessage>
      ) : (
        <ErrorMessagePleaceHolder />
      )}
    </Wrapper>
  );
};

export default SelectField;
