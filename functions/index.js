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
  const doc = getFunction(req.params.type, req.params.date);
  doc.then(content => {
    res.send(content.data());
  });
});

app.post("/:type", function(req, res) {
  const json = req.body;
  const type = req.params.type;
  postFunction(json, type);
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
