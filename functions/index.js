const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

//クロスサイト対応。swagger-uiから見た際、クロスサイトのエラーがでることへの対応。
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//swaggerの基本定義
var options = {
  swaggerDefinition: {
    info: {
      title: "qiita-scraiping",
      version: "1.0.0."
    }
  },
  apis: ["./index.js"] //自分自身を指定。外部化した場合は、そのファイルを指定。配列で複数指定も可能。
};
var swaggerSpec = swaggerJSDoc(options);
//swagger-ui向けにjsonを返すAPI
app.get("/api-docs.json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * @swagger
 * tags:
 *  name: trends
 *  description: qiitaいいね数ランキング
 */

/**
 * @swagger
 * paths:
 *   /{type}/{date}:
 *     get:
 *       tags:
 *         - trends
 *       summary: ランキング取得API
 *       description: qiitaいいね数ランキングを日毎/週毎で取得する
 *       parameters:
 *         - name: type
 *           in: path
 *           description: 期間タイプ
 *           required: true
 *           type: string
 *           enum:
 *           - daily
 *           - weekly
 *         - name: date
 *           in: path
 *           description: 日付(YYYY-MM-DD)。2018-09-23〜現在日付-1日まで指定可。
 *           required: true
 *           type: string
 *       responses:
 *         200:
 *           description: qiitaいいね数ランキング(20件)
 *
 */
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
