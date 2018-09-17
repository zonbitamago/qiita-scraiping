const express = require("express");
const app = express();
const fetch = require("node-fetch");
const moment = require("moment");

app.get("/", function(req, res) {
  getTrend();
  res.send("Hello World");
});

console.log("start", "http://localhost:3000");

app.listen(3000);

const getTrend = async function() {
  const peerPage = 100;
  let page = 1;
  let hasNextPage = true;
  const conditionDate = getSerchDate();

  const postContent = [];

  while (hasNextPage) {
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

    postContent.push(json);

    if (res.status != 200 || json.length < peerPage) {
      hasNextPage = false;
    } else {
      page++;
    }
  }

  postContent
    .sort((a, b) => {
      //いいね数降順
      return b.likes_count - a.likes_count;
    })
    .slice(0, 20)
    .map(content => {
      return {
        created_at: content.created_at,
        id: content.id,
        likes_count: content.likes_count,
        tags: content.tags,
        title: content.title,
        updated_at: content.updated_at,
        url: content.url,
        user: content.user
      };
    });

  console.log("postContent.length:", postContent.length);

  const postData = {
    [moment()
      .subtract(1, "days")
      .format("YYYY-MM-DD")]: postContent
  };

  await postResult(postData);

  console.log("finish fetch");

  return "finish";
};

const getSerchDate = function() {
  let toDate = moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  let fromDate = moment()
    .subtract(7, "days")
    .format("YYYY-MM-DD");

  return {
    toDate: toDate,
    fromDate: fromDate
  };
};

const postResult = async function(json) {
  const functionName = "qiitaScraiping";
  const url =
    process.env.NODE_ENV == "dev"
      ? "http://localhost:5000/qiita-trend-web-scraping/us-central1/"
      : "https://us-central1-qiita-trend-web-scraping.cloudfunctions.net/";
  const functionURL = url + functionName;

  console.log("functionURL:", functionURL);

  const res = await fetch(functionURL, {
    method: "POST",
    body: JSON.stringify(json),
    headers: { "Content-Type": "application/json" }
  });

  console.log("post result:", res.status);
};
