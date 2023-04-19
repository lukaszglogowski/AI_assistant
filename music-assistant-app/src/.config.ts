
export const config: any = {
  SHAZAM_API_KEY: '',
  SHAZAM_API_BASE_URL: '',
  YOUTUBE_V3_BASE_URL: ''
}

export function getEnv(variable: string, defaultValue: any = null) {
  let v = config[variable];
  if (!v) {
    v = import.meta.env[variable]
  }
  return v === undefined ? defaultValue : v
}

export default config