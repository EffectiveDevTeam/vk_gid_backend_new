const StringIsNumber = (value: any) => !isNaN(Number(value));

export const convertEnumToArray = (enumme: object) => {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map((key) => enumme[key]);
};
