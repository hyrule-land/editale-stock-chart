const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    slowMo: 100, //放慢速度
    headless: false,
    defaultViewport: { width: 1440, height: 780 },
    ignoreHTTPSErrors: false, //忽略 https 报错
    // args: ['--start-fullscreen'] //全屏打开页面
  });
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  const inputArea = await page.$('#kw');
  await inputArea.type('这是测试自动输入的内容');
  const button = await page.$('#su');
  await button.click();
  console.log('测试成功！！！');
})();
