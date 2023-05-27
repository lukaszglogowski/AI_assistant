import { URLString } from './genericTypes.types';

export function openNewTab(link: URLString): void {
  window.open(
    link as string,
    "_blank",
    "noopener,noreferrer"
  )
}

export function generateImgLinkFromShazam(link: URLString, width: number, height: number) {
  const c = link + '';
  return c.replace('{w}', width + '').replace('{h}', height + '')
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString()
}