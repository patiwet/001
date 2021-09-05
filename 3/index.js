const axios = require('axios').default;
const jsdom = require("jsdom");

async function run() {
   const fundName = process.argv[2].trim();
   console.info(`Search NAV for ${fundName}`);

   const rawHtml = await getRawHtml();
   const dom = new jsdom.JSDOM(rawHtml);
   const [, ...rowsDom] = dom.window.document.querySelectorAll('tbody > tr');

   const fund = rowsDom.find(el => el.children[0].textContent.trim() === fundName);
   if (!fund) {
       console.info(`Not found ${fundName}`);
       return;
   }

   const nav = fund.children[1].textContent;
   console.info(`found ${fundName} NAV: ${nav}`);
}

async function getRawHtml() {
    const res = await axios.request({
        url: "https://codequiz.azurewebsites.net/",
        method: "get",
        headers:{
            Cookie: "hasCookie=true;"
        },
    });

    return res.data;
}

run().catch(console.error);
