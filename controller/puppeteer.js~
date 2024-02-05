const puppeteer = require('puppeteer');
const  { PuppeteerWebBaseLoader } = require("langchain/document_loaders/web/puppeteer");
/*(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = (await browser.pages())[0];
    await page.goto('https://en.wikipedia.org/wiki/Olive_fruit_fly');
    const extractedText = await page.$eval('*', (el) => el.innerText);

    await browser.close();
})();
*/
const loader = new PuppeteerWebBaseLoader("https://en.wikipedia.org/wiki/Olive_fruit_fly");
