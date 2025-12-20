import express from "express";
import { getPopularComic } from "./api/popular-comic.js";
import { getTopComic } from "./api/top-comic.js";
import { getLatestComic } from "./api/latest-comic.js";
import { searchComic } from "./api/search-comic.js";
import { getDetailComic } from "./api/detail-comic.js";
import { getComicByGenre } from "./api/comic-by-genre.js";
import { getChapterImages } from "./api/comic-chapter.js";
import { getMangaSortBy } from "./get-function/get-manga-sort.js";

const app = express();

app.use(express.json());

app.get("/manga", async (req, res) => {
  try {
    const dataToSend = await getMangaSortBy(req.query);

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
});

app.get("/manga/:slug", async (req, res) => {
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
});

app.get("/chapter/:chapter_slug", async (req, res) => {
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
});

app.listen(3000, () => {
  console.info("Server listening on port 3000");
});
