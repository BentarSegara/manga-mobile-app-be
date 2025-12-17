import puppeteer from "puppeteer";

export const getComicByGenre = async (genre, pageNum) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(
      `https://api.komiku.org/manga/page/${pageNum}/?orderby=modified&tipe&genre=${genre}&genre2&status`
    );

    const comicByGenre = await page.evaluate(() => {
      const mangas = document.querySelectorAll(".bge");

      return Array.from(mangas).map((manga) => {
        const imageContainer = manga.querySelector(".bgei");
        const titleContainer = manga.querySelector(".kan");

        const image = imageContainer.querySelector("img").src;
        const categoryAndGenreEl =
          imageContainer.querySelector("a .tpe1_inf").innerText;
        const categoryAndGenre = categoryAndGenreEl.split(" ");

        const title = titleContainer.querySelector("a h3").innerText;
        const viewAndUpdate = titleContainer.querySelector("span").innerText;
        const shortDesc = titleContainer.querySelector("p").innerText;
        const chapters = Array.from(titleContainer.querySelectorAll(".new1"));

        const lastChapter =
          chapters[1].querySelector("a span:last-child").innerText;

        return {
          title: title,
          category: categoryAndGenre[0],
          genre: categoryAndGenre[1],
          viewUpdate: viewAndUpdate,
          shortDesc: shortDesc,
          lastChapter: lastChapter.slice(8),
          image: image,
        };
      });
    });

    return comicByGenre;
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
