const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get("/:type/:date", async (req, res) => {
  console.log("type:", req.params.type);
  console.log("date:", req.params.date);

  const doc = await getFunction(req.params.type, req.params.date);

  res.send(doc);
});

app.post("/", (req, res) => {
  postFunction(req);
  res.send("Hello postFunction!");
});

const api = functions.https.onRequest(app);
exports.qiitaScraiping = api;

function postFunction(request) {
  const json = request.body;

  for (key in json) {
    var docRef = db.collection("weekly").doc(key);
    // console.log(json[key]);

    docRef.set({ data: json[key] });
    // docRef.set("1");
  }
}

async function getFunction(type, date) {
  const docRef = db.collection(type);

  const getDoc = await docRef.doc(date).get();

  return getDoc;
}
