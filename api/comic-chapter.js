import puppeteer from "puppeteer";

export const getChapterImages = async (chapterSlug) => {
  const url = `https://komiku.org/${chapterSlug}`;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(url);
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
