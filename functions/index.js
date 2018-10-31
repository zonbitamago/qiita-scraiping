const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get("/:type/:date", function(req, res) {
  console.log("get start");
  console.log(showLog(req));
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=900");
  const doc = getFunction(req.params.type, req.params.date);

  console.log("get end");

  doc.then(content => {
    res.send(content.data());
  });
});

app.post("/:type", function(req, res) {
  console.log("post start");
  console.log(req.url);

  const json = req.body;
  const type = req.params.type;
  postFunction(json, type);

  console.log("post end");

  res.send("Hello postFunction!");
});

const api = functions.https.onRequest(app);
exports.qiitaScraiping = api;

function postFunction(json, type) {
  for (key in json) {
    var docRef = db.collection(type).doc(key);

    docRef.set({ data: json[key] });
  }
}

function getFunction(type, date) {
  const docRef = db.collection(type);

  const getDoc = docRef.doc(date).get();

  return getDoc;
}

function showLog(req) {
  function getip(req) {
    return (
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
    );
  }

  function getUrl(req) {
    return req.originalUrl || req.url;
  }

  function getReferrer(req) {
    return req.headers["referer"] || req.headers["referrer"];
  }

  function getUserAgent(req) {
    return req.headers["user-agent"];
  }

  return (
    getip(req) +
    " " +
    getUrl(req) +
    " " +
    getReferrer(req) +
    " " +
    getUserAgent(req)
  );
}
