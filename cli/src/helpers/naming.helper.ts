export const functionName = (text: string) => {
  return name(text, (match, index) =>
    index === 0 ? match.toLowerCase() : match.toUpperCase()
  );
};

export const className = (text: string) => {
  return name(text, (match, index) => match.toUpperCase());
};

const name = (
  text: string,
  onMatch: (match: string, index: number) => string
): string => {
  return text
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return '';
      return onMatch(match, index);
    });
};
