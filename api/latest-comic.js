import puppeteer from "puppeteer";
import { getChapterSlug } from "../get-function/get-chapter-slug.js";

export const getLatestComic = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto("https://komiku.org/");

    await page.exposeFunction("getChapterSlug", (url) => {
      return getChapterSlug(url);
    });

    const latestComic = await page.evaluate(() => {
      const latestMangaSection = document.querySelector("#Terbaru .ls4w");
      const mangas = latestMangaSection.querySelectorAll(".ls4");
      const mangaList = Array.from(mangas);

      return Promise.all(
        mangaList.map(async (manga) => {
          const imageContainer = manga.querySelector(".ls4v");
          const titleContainer = manga.querySelector(".ls4j");

          const reserveLink = imageContainer.querySelector("a").href;
          const slug = reserveLink.slice(25, reserveLink.length - 1);
          const image = imageContainer
            .querySelector("img")
            .getAttribute("data-src");

          const title = titleContainer.querySelector("h3 a").innerText;

          const genreAndCategory =
            titleContainer.querySelector(".ls4s").innerText;
          const gnrAndCtg = genreAndCategory.split(" ");

          const chapterEl = titleContainer.querySelector(".ls24");
          let chapter = "";
          let chapterSlug = "";
          if (chapterEl !== null) {
            chapter = chapterEl.innerText;
            chapterSlug = await window.getChapterSlug(chapterEl.href);
          }

          return {
            title: title,
            slug: slug,
            genre: gnrAndCtg[1],
            category: gnrAndCtg[0],
            chapter: chapter.slice(8),
            chapterSlug: chapterSlug,
            image: image,
          };
        })
      );
    });

    return latestComic;
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
