import puppeteer from "puppeteer";

export const getChapterImages = async (slug, chapter) => {
  const baseUrl = `https://komiku.org/${slug}`;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    let response = await page.goto(`${baseUrl}-chapter-${chapter}`);

    if (response.status() === 404) {
      let chapterString;
      if (chapter.length === 2) {
        chapterString = chapter.slice(1);
      } else {
        chapterString = `0${chapter}`;
      }
      response = await page.goto(`${baseUrl}-chapter-${chapterString}`);
    }

    const chapterImages = await page.evaluate(() => {
      const chapterContainer = document.querySelector("#Baca_Komik");
      const images = chapterContainer.querySelectorAll("img");
      return Array.from(images).map((image) => image.getAttribute("src"));
    });
    return chapterImages;
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
