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
  let res = await fetch(
    "https://qiita.com/api/v2/items?query=created%3A>2018-08-21+created%3A<2018-08-22&per_page=100"
  );
  let json = await res.json();

  json.map(item => {
    console.log("item.created_at:", item.created_at);
  });
  //   console.log("json:", json);

  return json;
};
