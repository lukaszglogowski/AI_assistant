import { getEnv } from 'config';
import queryString from 'query-string';
import { URLSearchParams } from 'url';



const Methods = {
    GET: 'GET',
  };

export type ApiConfigs = {
    [key: string]: ApiConfigs |  {[key in keyof typeof Methods]?: Function}
  }

// prevents assining any to {} type
export type KeyObject<T> = keyof T extends never ? Record<string, never> : T

export type SearchParams = URLSearchParams | string | Record<string, string | ReadonlyArray<string>> | Iterable<[string, string]> | ReadonlyArray<[string, string]>;

export function createYoutubeEndpoint<
  URL_PARAMETERS extends {[key: string]: string | number},
  URL_SEARCH_PARAMS extends SearchParams,
  REQUEST_BODY extends BodyInit | null | undefined,
  RESPONSE_BODY,
>(
  method: keyof typeof Methods,
  urlResolver: (parameters: KeyObject<URL_PARAMETERS>) => string,
) {
  return function ( 
    urlParameters: KeyObject<URL_PARAMETERS>,
    urlParams: KeyObject<URL_SEARCH_PARAMS>,
    requestBody: REQUEST_BODY
  ) {
    const url = `${new URL(urlResolver(urlParameters)).toString()}?${typeof urlParams === 'string' ? urlParams : queryString.stringify(urlParams)}` as const;

    return async function () {
      const res = await fetch(url, {
        method: method,
        body: requestBody,
        headers: {
          'X-RapidAPI-Key': getEnv('SHAZAM_API_KEY'),
          'X-RapidAPI-Host': 'youtube-v3-alternative.p.rapidapi.com'
        }
      });
      return res.json() as RESPONSE_BODY;
    }
  }
}

export default createYoutubeEndpoint;