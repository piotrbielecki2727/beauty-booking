const cityCharactersRegex = /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż -]/gu;
const streetCharactersRegex = /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .-]/gu;

export const formatCityValue = (value: string) => {
  const filteredValue = value.replace(cityCharactersRegex, "").slice(0, 50);

  return filteredValue
    ? `${filteredValue.charAt(0).toLocaleUpperCase("pl-PL")}${filteredValue.slice(1)}`
    : "";
};

export const formatPostalCodeValue = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 5);

  return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
};

export const formatStreetValue = (value: string) =>
  value.replace(streetCharactersRegex, "").slice(0, 60);

export const formatBuildingNumberValue = (value: string) => {
  const normalizedValue = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  const [, digits = "", letter = ""] =
    normalizedValue.match(/^(\d*)([A-Z]?)/) ?? [];

  return `${digits}${letter}`.slice(0, 6);
};

export const formatApartmentNumberValue = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4);

export const formatIntegerValue = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

export const formatPriceValue = (value: string) => {
  const normalizedValue = value.replace(",", ".").replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = normalizedValue.split(".");
  const decimalPart = decimalParts.join("").slice(0, 2);

  return decimalParts.length > 0
    ? `${integerPart.slice(0, 5)},${decimalPart}`
    : integerPart.slice(0, 5);
};
