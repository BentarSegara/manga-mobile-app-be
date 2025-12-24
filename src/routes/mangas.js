import express from "express";
import {
  getManga,
  getMangaChapterImages,
  getMangaDetail,
} from "../controllers/manga-controller.js";

const router = express.Router();

router.get("/", getManga);
router.get("/:slug", getMangaDetail);
router.get("/chapter/:chapter_slug", getMangaChapterImages);

export default router;
