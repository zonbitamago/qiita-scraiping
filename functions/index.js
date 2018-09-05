const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.qiitaScraiping = functions.https.onRequest((request, response) => {
  const json = request.body;
  console.log("json:", json);

  var docRef = db.collection("data").doc("sample");

  var setResult = docRef.set(json);
  console.log("setResult:", setResult);

  response.send("Hello QiitaScraiping!");
});
