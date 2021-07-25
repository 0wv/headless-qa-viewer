const { basename } = require('path')
const puppeteer = require('puppeteer')

; (async () => {
  for (const arg of process.argv.slice(2)) {
    const browser = await puppeteer.launch({
      args: [
        '--disable-gpu',
      ],
    })
    const page = await browser.newPage()
    await page.goto('https://qa-viewer.netlify.app')
    const elementHandle = await page.$('input[type=file]')
    await elementHandle.uploadFile(arg)
    await page.pdf({
      path: `${basename(arg, '.txt')}-qa.pdf`,
    })
    await page.evaluate(() => {
      function toggleCheckbox (optionName) {
        [...document.querySelectorAll('label')]
          .filter(v => (new RegExp(`${optionName}$`)).test(v.innerText))[0]
          .click()
      }
      toggleCheckbox('答えを隠す')
      toggleCheckbox('解答欄を表示する')
    })
    await page.pdf({
      path: `${basename(arg, '.qax')}-iq.pdf`,
    })
    await browser.close()
  }
})()
