import puppeteer from "puppeteer";

export const searchComic = async (title) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(`https://komiku.org/?post_type=manga&s=${title}`);

    await page.evaluate(() => {
      const searchResultContainer = document.querySelector(".perapih section");
      const listmangaContainer = searchResultContainer.querySelector(".daftar");
      listmangaContainer.scrollIntoView();
    });

    try {
      await page.waitForSelector(".daftar .bge", { timeout: 10000 });
    } catch (error) {
      console.log(
        "Element .bge tidak muncul (Mungkin loading lama atau data kosong)"
      );
    }

    const comics = await page.evaluate(() => {
      const listmangaContainer = document.querySelector(".daftar");
      const mangas = listmangaContainer.querySelectorAll(".bge");

      return Array.from(mangas).map((manga) => {
        const imageContainer = manga.querySelector(".bgei");
        const titleContainer = manga.querySelector(".kan");

        const image = imageContainer.querySelector("img").src;
        const categoryAndGenreEl =
          imageContainer.querySelector("a .tpe1_inf").innerText;
        const categoryAndGenre = categoryAndGenreEl.split(" ");

        const title = titleContainer.querySelector("a h3").innerText;
        const latestUpdate = titleContainer.querySelector("p").innerText;
        const chapters = Array.from(titleContainer.querySelectorAll(".new1"));

        const lastChapter =
          chapters[1].querySelector("a span:last-child").innerText;

        return {
          title: title,
          category: categoryAndGenre[0],
          genre: categoryAndGenre[1],
          latestUpdate: latestUpdate,
          lastChapter: lastChapter.slice(8),
          image: image,
        };
      });
    });
    return comics;
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
