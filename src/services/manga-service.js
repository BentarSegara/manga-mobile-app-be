import { getComicByGenre } from "../utils/get-comic-by-genre.js";
import { getLatestComic } from "../utils/latest-comic.js";
import { getPopularComic } from "../utils/popular-comic.js";
import { searchComic } from "../utils/search-comic.js";
import { getTopComic } from "../utils/top-comic.js";

export const getMangaSortBy = async ({ sort, genre, page, q }) => {
  if (sort) {
    let dataToSend;
    try {
      if (sort === "popular") {
        dataToSend = await getPopularComic();
      } else if (sort === "top") {
        dataToSend = await getTopComic();
      } else {
        dataToSend = await getLatestComic();
      }
      return dataToSend;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  if (genre) {
    try {
      const comicByGenre = await getComicByGenre(genre, page ?? 1);
      return comicByGenre;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  if (q) {
    try {
      const comics = await searchComic(q);
      return comics;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return null;
};
