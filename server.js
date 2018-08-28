const express = require("express");
const app = express();
const fetch = require("node-fetch");
const moment = require("moment");
const puppeteer = require("puppeteer");

app.get("/", function(req, res) {
  getTrend();
  res.send("Hello World");
});

console.log("start", "http://localhost:3000");

app.listen(3000);

const getTrend = async function() {
  const count = await getSerchPageCount();
  const peerPage = 100;
  let maxPage = Math.floor(count / peerPage);
  if (count % peerPage > 0) {
    maxPage++;
  }

  const conditionDate = getSerchDate();
  for (var page = 1; page <= maxPage; page++) {
    const url =
      "https://qiita.com/api/v2/items?query=" +
      "created%3A>" +
      conditionDate.fromDate +
      "+created%3A<" +
      conditionDate.toDate +
      "&per_page=" +
      peerPage +
      "&page=" +
      page;

    console.log(url);

    let res = await fetch(url).catch(err => console.log(err));

    let json = await res.json();

    console.log("json.length:", json.length);
  }

  return "finish";
};

const getSerchPageCount = async function() {
  const conditionDate = getSerchDate();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "https://qiita.com/search?utf8=%E2%9C%93&sort=created&q=created%3A%3E" +
    conditionDate.fromDate +
    "+created%3A%3C" +
    conditionDate.toDate;
  await page.goto(url);
  const count = await page.evaluate(function() {
    return document.querySelector(
      "#main > div > div > div.searchResultContainer_main > div.searchResultContainer_navigation > ul > li.active > a > span"
    ).innerText;
  });

  console.log("count:", count);

  await browser.close();
  return count;
};

const getSerchDate = function() {
  let toDate = moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  let fromDate = moment()
    .subtract(2, "days")
    .format("YYYY-MM-DD");

  return {
    toDate: toDate,
    fromDate: fromDate
  };
};
