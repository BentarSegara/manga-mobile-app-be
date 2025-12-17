import puppeteer from "puppeteer";

export const getDetailComic = async (slug) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(`https://komiku.org/manga/${slug}/`);

    const details = await page.evaluate(() => {
      const els = document.querySelector(".cv");
      const bgImage = window.getComputedStyle(els).backgroundImage;
      const urlStartIndex = bgImage.indexOf("url");
      const hBgImage = bgImage.slice(urlStartIndex);

      const detailSection = document.querySelector(".perapih article");
      const judul = detailSection.querySelector("#Judul");
      const informations = detailSection.querySelector("#Informasi");

      const tbody = informations.querySelector(".inftable tbody");
      const tr = tbody.querySelectorAll("tr td:last-child");
      const author = tr[4].innerText;
      const status = tr[5].innerText;

      const ul = informations.querySelector("ul.genre");
      const li = ul.querySelectorAll(".genre");
      const genres = Array.from(li).map((genre) => {
        const genreText = genre.querySelector("a span");
        return genreText.innerText;
      });

      const synopsis = informations.querySelector(".desc").innerText;

      const lastChapter = judul.querySelector(".new1.sd.rd:last-child");
      const span = lastChapter.querySelector("a span:last-child");
      const chapter = span.innerText;

      return {
        author: author,
        status: status,
        genres: genres,
        synopsis: synopsis,
        total_chapter: chapter.slice(8),
        hBgImage: hBgImage,
      };
    });

    return details;
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
