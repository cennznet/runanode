// @flow
/**
 * The ipc api contract between main and renderer process.
 * Defines channel names and their possible message types.
 * Complex types are referenced from the common/types folder to keep this api readable.
 */
// import type {
//   ReportRequestHttpOptions,
//   ReportRequestPayload
// } from '../types/report-request.types';
// import type { GeneratePaperWalletParams } from '../types/paper-wallet-request.types';

/**
 * Channel for loading an base64 encoded asset from within the `source/renderer` folder
 */
export const LoadAssetChannelName = 'LoadAssetChannel';
export type LoadAssetRendererRequest = { fileName: string };
export type LoadAssetMainResponse = string;
/**
 * Channel for opening a url in the default browser
 */
export const OpenExternalUrlChannelName = 'OpenExternalUrlChannel';
export type OpenExternalUrlRendererRequest = string;
export type OpenExternalUrlMainResponse = void;

/**
 * Channel to send bug report requests
 */
export const ReportRequestChannelName = 'ReportRequestChannel';
// export type ReportRequestRendererRequest = {
//   httpOptions: ReportRequestHttpOptions,
//   requestPayload?: ReportRequestPayload
// }
export type ReportRequestMainResponse = void;

/**
 * Channel to generate and save a paper wallet certificate
 */
export const GeneratePaperWalletChannelName = 'GeneratePaperWalletChannel';
// export type GeneratePaperWalletRendererRequest = GeneratePaperWalletParams;
export type GeneratePaperWalletMainResponse = void;

// CennzNetNode ipc channels
// TODO: refactor to improved structure above
export const CENNZNET_AWAIT_UPDATE_CHANNEL = 'CENNZNET_AWAIT_UPDATE_CHANNEL';
export const CENNZNET_STATE_CHANGE_CHANNEL = 'CENNZNET_STATE_CHANGE_CHANNEL';
export const CENNZNET_TLS_CONFIG_CHANNEL = 'CENNZNET_TLS_CONFIG_CHANNEL';
export const CENNZNET_RESTART_CHANNEL = 'CENNZNET_RESTART_CHANNEL';
export const CENNZNET_FAULT_INJECTION_CHANNEL = 'CENNZNET_FAULT_INJECTION_CHANNEL';
export const CENNZNET_STATUS_CHANNEL = 'CENNZNET_STATUS_CHANNEL';

export const GO_TO_ADA_REDEMPTION_SCREEN_CHANNEL = 'GO_TO_ADA_REDEMPTION_SCREEN_CHANNEL';
export const GO_TO_NETWORK_STATUS_SCREEN_CHANNEL = 'GO_TO_NETWORK_STATUS_SCREEN_CHANNEL';

export const OPEN_ABOUT_DIALOG_CHANNEL = 'OPEN_ABOUT_DIALOG_CHANNEL';
