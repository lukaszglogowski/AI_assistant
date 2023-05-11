import { URLString } from './genericTypes.types';

export function openNewTab(link: URLString): void {
  window.open(
    link as string,
    "_blank",
    "noopener,noreferrer"
  )
}
