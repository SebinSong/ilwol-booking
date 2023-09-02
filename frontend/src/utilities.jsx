import { parse } from "dotenv"

export function classNames (...args) {
  // simplified version of 'classnames' npm package (https://www.npmjs.com/package/classnames) 
  const isObjectLiteral = (val) => {
    return typeof val === 'object' && val !== null && val.constructor === Object
  }

  return args.filter(Boolean)
    .map(arg => {
      if (typeof arg === 'string') { return arg }
      else if (isObjectLiteral(arg)) {
        const validKeyArr = []

        for (const [key, val] of Object.entries(arg)) {
          if (val) { validKeyArr.push(key) }
        }
        return validKeyArr.join(' ')
      }
    }).join(' ')
}

export function formatMoney(val, opts = {}) {
  let value = parseFloat(val)

  if (isNaN(value)) {
    value = 0.00
  }

  return new Intl.NumberFormat(
    'ko-KR',
    {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 2,
      ...opts
    }
  ).format(value)
}
