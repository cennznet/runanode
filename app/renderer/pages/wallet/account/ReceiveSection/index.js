import React from 'react';
import styled from 'styled-components';
import qr from 'qr-image';
import SVGInline from 'react-svg-inline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from 'components';
import { colors } from 'renderer/theme';
import QRFocusBox from './QRFocusBox';

const Wrapper = styled.div``;

const Desc = styled.div`
  text-align: center;
`;

const Warning = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const SectionRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const ReceiveSection = ({ account }) => {
  const rawQR = qr.imageSync(account.address, {
    type: 'svg',
    size: 6,
    ec_level: 'L',
    margin: 0,
  });

  const refinedQR = rawQR.replace('<path', `<path fill=${colors.N0}`);

  return (
    <Wrapper>
      <Desc>
        Send assets to this wallet by scanning the QR code below, or by copying and pasting your
        public address
      </Desc>
      <Warning>
        <FontAwesomeIcon icon="exclamation-triangle" size="sm" color={colors.danger} />
        <span>
          WARNING: Only send assets that are compatible with CENNZNet. Sending other assets will
          result in permanent loss.
        </span>
      </Warning>
      <SectionRow>
        <QRFocusBox>
          <SVGInline svg={refinedQR} />
        </QRFocusBox>
      </SectionRow>
      <SectionRow>
        Why use a QR code?
        <Hint tooltip={{ place: 'right', styles: { minWidth: '15rem' } }}>
          <React.Fragment>
            <p>
              Scanning a QR code to send funds gives you certainty that you are sending your assets
              to the right public address.
            </p>
            <p>
              If you choose to enter a public address manually, then there is a chance that you may
              enter the address incorrectly and send your assets to the wrong address.
            </p>
          </React.Fragment>
        </Hint>
      </SectionRow>
    </Wrapper>
  );
};

export default ReceiveSection;
