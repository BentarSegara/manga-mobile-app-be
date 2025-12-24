import { getMangaSortBy } from "../services/manga-service.js";
import { getChapterImages } from "../utils/get-comic-chapter.js";
import { getDetailComic } from "../utils/get-detail-comic.js";

export const getManga = async (req, res) => {
  const { sort, genre, page, q } = req.query;
  try {
    const dataToSend = await getMangaSortBy({
      sort: sort,
      genre: genre,
      page: page,
      q: q,
    });

    if (dataToSend) {
      res.status(200).json({
        status: "Ok",
        message: "Berhasil mengambil data",
        data: dataToSend,
      });
    } else {
      res.status(400).json({
        status: "Bad",
        message: "Invalid request",
        data: dataToSend,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Gagal mengambil data: ${err.message}`,
      data: null,
    });
  }
};

export const getMangaDetail = async (req, res) => {
  const mangaSlug = req.params.slug;

  try {
    const comicDetail = await getDetailComic(mangaSlug);
    res.status(200).json({
      status: "Ok",
      message: "Data berhasil diambil",
      data: comicDetail,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Gagal mengambil data: ${err.message}`,
      data: null,
    });
  }
};

export const getMangaChapterImages = async (req, res) => {
  const chapterSlug = req.params.chapter_slug;
  const [slug, chapter] = chapterSlug.split("-chapter-");
  try {
    const chapterImages = await getChapterImages(slug, chapter);
    res.status(200).json({
      status: "Ok",
      message: "Data berhasil diambil",
      data: chapterImages,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Gagal mengambil data: ${err.message}`,
      data: null,
    });
  }
};
