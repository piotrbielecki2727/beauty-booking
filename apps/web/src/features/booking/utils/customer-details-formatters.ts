const normalizeNameInput = (value: string) =>
  value.replace(/[^\p{L}\s'-]/gu, "").replace(/\s{2,}/g, " ").slice(0, 40)

const normalizePhoneInput = (value: string) => value.replace(/\D/g, "").slice(0, 9)

const formatPolishPhoneNumber = (value: string) => {
  const digits = normalizePhoneInput(value)
  const groupedNumber = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim()

  return groupedNumber ? `+48 ${groupedNumber}` : "+48"
}

export { formatPolishPhoneNumber, normalizeNameInput, normalizePhoneInput }
