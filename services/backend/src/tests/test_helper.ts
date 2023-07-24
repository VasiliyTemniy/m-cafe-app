export const apiBaseUrl = '';


export const getRandomElement = (list: string[]): string => {
  return list[Math.floor((Math.random() * list.length))];
};

const getCharRange = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));

export const alphabetEn = getCharRange('A'.charCodeAt(0), 'Z'.charCodeAt(0), 1).map((char) => String.fromCharCode(char))
  .concat(getCharRange('a'.charCodeAt(0), 'z'.charCodeAt(0), 1).map((char) => String.fromCharCode(char)));

export const alphabetRu = getCharRange('А'.charCodeAt(0), 'Я'.charCodeAt(0), 1).map((char) => String.fromCharCode(char))
  .concat(getCharRange('а'.charCodeAt(0), 'я'.charCodeAt(0), 1).map((char) => String.fromCharCode(char)));

export const alphabetAll = alphabetEn.concat(alphabetRu);

export const numbers = getCharRange('0'.charCodeAt(0), '9'.charCodeAt(0), 1).map((char) => String.fromCharCode(char));

export const usernameChars = alphabetEn.concat(['_', ' ', '-']).concat(numbers);
export const nameChars = alphabetAll.concat(' ');

export const possibleChars = alphabetEn.concat(alphabetRu)
  .concat(['.', ',', ':', '/', '\\', '[', ']', '{', '}', '|', '\'', '"', '`', '~', '!', '@', '#', '$', '%', '^'])
  .concat(['&', '*', '(', ')', '=', '+', '№', '?', '<', '>', '_', ' ', '-'])
  .concat(numbers);