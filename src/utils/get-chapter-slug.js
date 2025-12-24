export const getChapterSlug = (rawChapterSlug) => {
  const endIndex = rawChapterSlug.indexOf("chapter");
  return rawChapterSlug.slice(19, endIndex + 7);
};
