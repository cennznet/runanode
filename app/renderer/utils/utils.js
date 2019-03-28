import { shell } from 'electron';
import { Logger } from 'renderer/utils/logging';

export const openExternalLink = (url) => {
  shell.openExternal(url);
}
