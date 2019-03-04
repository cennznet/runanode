import React from 'react';

const Ellipsis = ({ substrLength = 12, children }) => {
  const formattedText =
    children.length > 17
      ? children.substr(0, substrLength) +
        ' ... ' +
        children.substr(children.length - 5, children.length)
      : children;
  return <span>{formattedText}</span>;
};

export default Ellipsis;
