import puppeteer from "puppeteer";
import { getChapterSlug } from "./get-chapter-slug.js";

export const getPopularComic = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto("https://komiku.org/");

    await page.exposeFunction("getChapterSlug", (url) => {
      return getChapterSlug(url);
    });

    const popularComics = await page.evaluate(() => {
      const trendingSection = document.querySelector(
        "#Komik_Hot_Manga .perapih"
      );
      const mangaContainer = trendingSection.querySelector(".ls112 .ls12");
      const mangas = mangaContainer.querySelectorAll(".ls2");
      const mangaList = Array.from(mangas);
      return Promise.all(
        mangaList.map(async (manga) => {
          const imageContainer = manga.querySelector(".ls2v");
          const titleContainer = manga.querySelector(".ls2j");
          const genreAnViewEl = titleContainer.querySelector(".ls2t").innerText;
          const slugUrl = imageContainer.querySelector("a").href;

          const slug = slugUrl.slice(25, slugUrl.length - 1);
          const image = imageContainer
            .querySelector("img")
            .getAttribute("data-src");

          const title = titleContainer.querySelector("h3 a ").innerText;
          const genreAndView = genreAnViewEl.split(" ");
          const chapterEl = titleContainer.querySelector(".ls2l");
          const chapter = chapterEl.innerText;
          const chapterSlug = await window.getChapterSlug(chapterEl.href);

          return {
            title: title,
            slug: slug,
            genre: genreAndView[0],
            chapter: chapter.slice(8),
            chapterSlug: chapterSlug,
            view: genreAndView[1],
            image: image,
          };
        })
      );
    });

    return popularComics;
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new Error("Website terlalu lama merespons (Timeout).");
    } else {
      throw new Error(err.message);
    }
  } finally {
    await browser.close();
  }
};
