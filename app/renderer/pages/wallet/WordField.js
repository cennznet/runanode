import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { Input } from 'components';
import { colors } from 'renderer/theme';

const Label = styled.label`
  margin: 0.5rem 0.5rem 0 0;
  color: ${colors.N200};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  input {
    width: 10rem;
  }
`;

const WorldField = ({
  field, // Formik prop - { name, value, onChange, onBlur }
  form, // Formik prop - { touched, errors }, also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  labelText,
  placeholder,
  noTickShow,
}) => {
  const { name, value, onChange, onBlur } = field;
  const { touched, errors } = form;
  const fieldError = R.path(R.split('.')(name))(errors);
  const fieldTouched = R.path(R.split('.')(name))(touched);
  const recomposedValue = value && value.toLowerCase().trim();
  return (
    <Wrapper>
      {labelText && <Label htmlFor={name}>{labelText}</Label>}
      <Input
        value={recomposedValue || ''}
        {...{ placeholder, name, onChange, onBlur }}
        valid={fieldTouched ? (noTickShow && !fieldError ? null : !fieldError) : null}
        showValidIcon
      />
    </Wrapper>
  );
};

export default WorldField;
