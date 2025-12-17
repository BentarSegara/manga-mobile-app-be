import { getComicByGenre } from "../api/comic-by-genre.js";
import { getLatestComic } from "../api/latest-comic.js";
import { getPopularComic } from "../api/popular-comic.js";
import { searchComic } from "../api/search-comic.js";
import { getTopComic } from "../api/top-comic.js";

export const getMangaSortBy = async (query) => {
  const { sort, genre, page, q } = query;
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
