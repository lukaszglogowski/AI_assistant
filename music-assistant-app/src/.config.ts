
export const config: any = {
  
}

export function getEnv(variable: string, defaultValue: any = null) {
  const v = config[variable];
  return v === undefined ? defaultValue : v
}

export default config