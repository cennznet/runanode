import { shell } from 'electron';

export const openExternalLink = (url) => {
  shell.openExternal(url);
}
