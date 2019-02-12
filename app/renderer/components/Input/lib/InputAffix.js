import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from 'components/Spinner';
import Tick from './Tick';
import Cross from './Cross';

const ContentWrapper = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

const PrefixWrapper = styled(ContentWrapper)`
  left: 0;
`;

const Prefix = ({ prefix }) => <PrefixWrapper>{prefix}</PrefixWrapper>;

const SuffixWrapper = styled(ContentWrapper)`
  right: 0;
`;

const SuffixContent = ({ suffix, valid }) => {
  if (valid === true) {
    return <Tick />;
  }

  if (valid === false) {
    return <Cross />;
  }

  if (suffix === 'spinner') {
    return <Spinner size="1rem" />;
  }

  return suffix;
};

const Suffix = ({ suffix, valid }) => (
  <SuffixWrapper>
    <SuffixContent {...{ suffix, valid }} />
  </SuffixWrapper>
);

const AffixWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  align-items: center;
`;

const InputAffix = ({ children, ...otherProps }) => {
  const { prefix, suffix, valid } = otherProps;

  if (!(prefix || suffix || typeof valid === 'boolean')) {
    return children;
  }

  return (
    <AffixWrapper>
      {prefix && <Prefix {...{ prefix }} />}
      {children}
      {(suffix || typeof valid === 'boolean') && <Suffix {...{ suffix, valid }} />}
    </AffixWrapper>
  );
};

InputAffix.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputAffix;
