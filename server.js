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
  let toDate = moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  let fromDate = moment()
    .subtract(2, "days")
    .format("YYYY-MM-DD");
  let url =
    "https://qiita.com/api/v2/items?query=" +
    "created%3A>" +
    fromDate +
    "+created%3A<" +
    toDate +
    "&per_page=100";

  console.log(url);

  let res = await fetch(url).catch(err => console.log(err));

  let json = await res.json();

  json.map(item => {
    console.log("item.created_at:", item.created_at);
  });
  //   console.log("json:", json);

  return json;
};
