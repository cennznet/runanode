import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Spinner from 'components/Spinner';

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

const SuffixContent = ({ suffix }) => {
  if (suffix === 'spinner') {
    return <Spinner size="1rem" />;
  }

  return suffix;
};

const Suffix = ({ suffix }) => (
  <SuffixWrapper>
    <SuffixContent {...{ suffix }} />
  </SuffixWrapper>
);

const AffixWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  align-items: center;
`;

const InputAffix = ({ children, ...otherProps }) => {
  const { prefix, suffix } = otherProps;

  if (!(prefix || suffix)) {
    return children;
  }

  return (
    <AffixWrapper>
      {prefix && <Prefix {...{ prefix }} />}
      {children}
      {suffix && <Suffix {...{ suffix }} />}
    </AffixWrapper>
  );
};

InputAffix.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputAffix;
