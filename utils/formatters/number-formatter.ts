import numbro from 'numbro'
import Decimal from 'decimal.js-light'

const prettyFormatNumber = (
  num: string | number | Decimal,
  forceSign: boolean = false,
) => {
  let mantissa = 3
  const numStr = num.toString(10)
  const numDec = new Decimal(numStr)
  if (numDec.lessThan(0.1)) {
    mantissa = 4
  }
  if (numDec.lessThan(0.01)) {
    mantissa = 6
  }
  return numbro(num.toString(10)).format({
    mantissa: mantissa,
    trimMantissa: true,
    thousandSeparated: true,
    forceSign,
  })
}

const prettyFormatCurrency = (num: number, forceSign: boolean = false) => {
  return numbro(num.toFixed(2)).formatCurrency({
    mantissa: 2,
    thousandSeparated: true,
    forceSign,
  })
}

const prettyFormatPercent = (num: string | number | Decimal) => {
  return numbro(num.toString()).format({
    output: 'percent',
    mantissa: 2,
    trimMantissa: true,
    thousandSeparated: true,
    forceSign: true,
  })
}

export { prettyFormatNumber, prettyFormatCurrency, prettyFormatPercent }
