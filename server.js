const express = require("express");
const app = express();
const fetch = require("node-fetch");

app.get("/", function(req, res) {
  getTrend();
  res.send("Hello World");
});

console.log("start", "http://localhost:3000");

app.listen(3000);

const getTrend = async function() {
  let res = await fetch("https://qiita.com/api/v2/items");
  let json = await res.json();
  console.log("json:", json);

  return json;
};
