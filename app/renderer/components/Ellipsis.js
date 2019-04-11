import React from 'react';

const Ellipsis = ({ maxLength = 17, substrLength = 12, tailLength = 5, children }) => {
  if (!children) {
    return null;
  }
  const formattedText =
    children.length > maxLength
      ? children.substr(0, substrLength) +
        ' ... ' +
        children.substr(children.length - tailLength, children.length)
      : children;
  return <span>{formattedText}</span>;
};

export default Ellipsis;
