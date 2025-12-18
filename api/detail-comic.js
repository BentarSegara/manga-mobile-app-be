import puppeteer from "puppeteer";

export const getDetailComic = async (slug) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(`https://komiku.org/manga/${slug}/`);

    const details = await page.evaluate(() => {
      const els = document.querySelector(".cv");
      const hImageEl = window.getComputedStyle(els).backgroundImage;
      const hImage = hImageEl.match(/url\(["']?([^"']*)["']?\)/)[1];
      const hImageMod = hImage.replace(/quality=\d+/, "quality=100");

      const detailSection = document.querySelector(".perapih article");
      const judul = detailSection.querySelector("#Judul");
      const informations = detailSection.querySelector("#Informasi");

      const vImageEl = informations.querySelector(".ims");
      const vImage = vImageEl.querySelector("img").src;

      const tbody = informations.querySelector(".inftable tbody");
      const tr = tbody.querySelectorAll("tr td:last-child");
      const title = tr[0].innerText;
      const comic = tr[2].innerText;
      const genre = tr[3].innerText;
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
        title: title,
        author: author,
        status: status,
        comic: comic,
        genre: genre,
        genres: genres,
        synopsis: synopsis,
        total_chapter: chapter.slice(8),
        vImage: vImage,
        hImage: hImageMod,
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
