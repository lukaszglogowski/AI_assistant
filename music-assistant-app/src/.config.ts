
export const config: any = {
  SHAZAM_API_KEY: '',
  SHAZAM_API_BASE_URL: '',
}

export function getEnv(variable: string, defaultValue: any = null) {
  const v = config[variable];
  return v === undefined ? defaultValue : v
}

export default config