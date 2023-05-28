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

export function convertMsToTime(milliseconds: number) {
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  const baseH = hours !== 0 ? `${padTo2Digits(hours)}:` : '';

  return `${baseH}${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}