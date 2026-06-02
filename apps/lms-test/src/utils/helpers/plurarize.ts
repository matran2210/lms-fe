export const pluralize = (
  word: string,
  count: number,
  pluralForm?: string,
): string => {
  if (count === 1) return word;
  if (pluralForm) return pluralForm; // Use custom plural form if provided

  // Common pluralization rules
  if (word.endsWith("y") && !/[aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + "ies"; // city → cities
  }
  if (/(s|sh|ch|x|z)$/.test(word)) {
    return word + "es"; // bus → buses, box → boxes
  }
  if (word.endsWith("f")) {
    return word.slice(0, -1) + "ves"; // leaf → leaves
  }
  if (word.endsWith("fe")) {
    return word.slice(0, -2) + "ves"; // knife → knives
  }

  return word + "s"; // Default rule: just add "s"
};
