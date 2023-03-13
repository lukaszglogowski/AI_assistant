
export function buildCssClass(classObj: {[key: string]: boolean}, className = '') {
  return Object.entries(classObj).filter(([, condition]) => condition).map(([className, ]) => className).reduce(
    (prev, curr) => {
      return prev + ' ' + curr;
    },
    className
  )
}