import { css } from 'styled-components';

const media = (breakPoints = ['36em', '48em', '62em', '75em']) => {
  const sizes = {
    xlUp: breakPoints[3], // >75em
    xlDown: breakPoints[3], // <75em
    lgUp: breakPoints[2], // >62em
    lgDown: breakPoints[2], // <62em
    mdUp: breakPoints[1], // >48em
    mdDown: breakPoints[1], // <48em
    smUp: breakPoints[0], // >36em
    smDown: breakPoints[0], // <36em
  };

  const sizeUp = ['xlUp', 'lgUp', 'mdUp', 'smUp'];

  return Object.keys(sizes).reduce((accumulator, label) => {
    const remSize = sizes[label];

    accumulator[label] = (...args) => css`
      @media screen and (${sizeUp.includes(label) ? 'min' : 'max'}-width: ${remSize}) {
        ${css(...args)};
      }
    `;
    return accumulator;
  }, {});
};

export default media();
