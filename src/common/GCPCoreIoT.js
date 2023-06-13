export const keyFormatOpt = [
  { label: 'RS256', value: 'RSA_PEM' },
  { label: 'ES256', value: 'ES256_PEM' },
  { label: 'RS256_X509', value: 'RSA_X509_PEM' },
  { label: 'ES256_X509', value: 'ES256_X509_PEM' },
]

export const getLabelFromValue = (value) => {
  const target = keyFormatOpt.find((item) => item.value === value)
  return target ? target.label : ''
}

export default {}
