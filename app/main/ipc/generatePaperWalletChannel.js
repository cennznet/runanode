// @flow
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import qr from 'qr-image';
import { app } from 'electron';

import { Logger } from 'main/utils/logging';
import { MainIpcChannel } from './lib/MainIpcChannel';
import { GeneratePaperWalletChannelName } from '../../common/ipc/api';
import type {
  GeneratePaperWalletMainResponse,
  GeneratePaperWalletRendererRequest
} from '../../common/ipc/api';
import { stringifyError } from '../../common/utils/logging';

const { resourcesPath } = process;
const distAssetsPath = path.join(resourcesPath, '..', 'dist/assets')
let paperWalletFontPath = path.join(distAssetsPath,'app/common/assets/pdf/paper-wallet-certificate-font.ttf');
let paperWalletPage1Path = path.join(distAssetsPath,'app/common/assets/pdf/paper-wallet-certificate-page-1.png');
let paperWalletPage1PathTestnet = path.join(distAssetsPath,'app/common/assets/pdf/paper-wallet-certificate-page-1-testnet.png');
let paperWalletPage2Path = path.join(distAssetsPath,'app/common/assets/pdf/paper-wallet-certificate-page-2.png');
let paperWalletPage2PathTestnet = path.join(distAssetsPath,'app/common/assets/pdf/paper-wallet-certificate-page-2-testnet.png');
let paperWalletCertificateBgPath = path.join(distAssetsPath,'app/common/assets/pdf/paper-wallet-certificate-background.png');

if(!app.isPackaged) {
  paperWalletFontPath = '../../../app/common/assets/pdf/paper-wallet-certificate-font.ttf';
  paperWalletPage1Path = '../../../app/common/assets/pdf/paper-wallet-certificate-page-1.png';
  paperWalletPage1PathTestnet = '../../../app/common/assets/pdf/paper-wallet-certificate-page-1-testnet.png';
  paperWalletPage2Path = '../../../app/common/assets/pdf/paper-wallet-certificate-page-2.png';
  paperWalletPage2PathTestnet = '../../../app/common/assets/pdf/paper-wallet-certificate-page-2-testnet.png';
  paperWalletCertificateBgPath = '../../../app/common/assets/pdf/paper-wallet-certificate-background.png';
}

export const generatePaperWalletChannel: (
  // IpcChannel<Incoming, Outgoing>
  MainIpcChannel<GeneratePaperWalletRendererRequest, GeneratePaperWalletMainResponse>
) = (
  new MainIpcChannel(GeneratePaperWalletChannelName)
);

export const handlePaperWalletRequests = () => {
  generatePaperWalletChannel.onReceive((request: GeneratePaperWalletRendererRequest) => (
    new Promise((resolve, reject) => {
      Logger.info('handlePaperWalletRequests');
      // Prepare params
      const { address, mnemonics, buildLabel, filePath, isMainnet, messages } = request;

      // Helpers
      const printMnemonic = (index) => `${index + 1}. ${mnemonics[index]}`;
      const readAssetSync = (p) => fs.readFileSync(__dirname.startsWith('/') ? path.join(__dirname, p) : p);

      // Generate QR image for wallet address
      const qrCodeImage = qr.imageSync(address, {
        type: 'png',
        size: 10,
        ec_level: 'L',
        margin: 0
      });
      const textColor = '#3b5c9b';
      const width = 595.28;
      const height = 841.98;
      const doc = new PDFDocument({
        size: [width, height],
        margins: {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        },
        info: {
          Title: messages.infoTitle,
          Author: messages.infoAuthor,
        }
      });
      try {
        // font family
        // const fontBuffer = readAssetSync(paperWalletFontPath);
        // doc.font(fontBuffer);

        // background images
        const backgroundUri = readAssetSync(paperWalletCertificateBgPath);
        doc.image(backgroundUri, 0, 0, { fit: [width, height] });

        // first page
        const page1Uri = readAssetSync(
          isMainnet ? paperWalletPage1Path : paperWalletPage1PathTestnet
        );

        doc.image(page1Uri, 0, 0, { fit: [width, height] });
        doc.rotate(180, { origin: [width / 2, height / 2] });
        doc.fillColor(textColor);
        doc.fontSize(10).text(messages.walletAddressLabel, 0, 160, {
          width: 595,
          align: 'center'
        });
        doc.image(qrCodeImage, (width / 2) - 80 / 2, 180, { fit: [80, 80] });
        doc.fontSize(8).text(address, (width - 250) / 2, 274, {
          width: 250,
          align: 'center',
          lineGap: 2
        });

        // revert document rotation
        doc.rotate(-180, { origin: [width / 2, height / 2] });

        // second page
        doc.addPage();
        const page2Uri = readAssetSync(
          isMainnet ? paperWalletPage2Path : paperWalletPage2PathTestnet
        );
        doc.image(page2Uri, 0, 0, { fit: [width, height] });
        doc.rotate(180, { origin: [width / 2, height / 2] });
        doc.fillColor(textColor);
        doc.fontSize(10).text(messages.recoveryPhraseLabel, 0, 535, {
          width: 595,
          align: 'center'
        });

        // mnemonics
        doc.fontSize(7);
        doc.text(printMnemonic(0), 168, 560);
        doc.text(printMnemonic(1), 212, 560);
        doc.text(printMnemonic(2), 256, 560);
        doc.text(printMnemonic(3), 300, 560);
        doc.text(printMnemonic(4), 344, 560);
        doc.text(printMnemonic(5), 388, 560);

        doc.text(printMnemonic(6), 168, 581);
        doc.text(printMnemonic(7), 212, 581);
        doc.text(printMnemonic(8), 256, 581);
        doc.text(printMnemonic(9), 300, 581);
        doc.text(printMnemonic(10), 344, 581);
        doc.text(printMnemonic(11), 388, 581);

        doc.text(printMnemonic(12), 168, 602);
        doc.text(printMnemonic(13), 212, 602);
        doc.text(printMnemonic(14), 256, 602);
        doc.text(printMnemonic(15), 300, 602);
        doc.text(printMnemonic(16), 344, 602);
        doc.text(printMnemonic(17), 388, 602);

        doc.fontSize(7).text(buildLabel, (width - 270) / 2, 705, {
          width: 270,
          align: 'left'
        });

        doc.rotate(-180, { origin: [width / 2, height / 2] });
      } catch (error) {
        Logger.info('handlePaperWalletRequests fail');
        Logger.info(stringifyError(error));
        reject(error);
      }

      // Write file to disk
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      doc.end();
      writeStream.on('close', resolve);
      writeStream.on('error', reject);
    })
  ));
};
