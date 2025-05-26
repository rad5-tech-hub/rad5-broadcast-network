export const toSentenceCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ""
    )
    .join(" ");
};
