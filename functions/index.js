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
  request.method == "POST"
    ? postFunction(request, response)
    : getFunction(request, response);
});

function postFunction(request, response) {
  const json = request.body;

  for (key in json) {
    var docRef = db.collection("weekly").doc(key);
    console.log(json[key]);

    docRef.set(JSON.parse(json[key]));
  }
  response.send("Hello postFunction!");
}

async function getFunction(request, response) {
  const docRef = db.collection("qiita");

  const getDoc = await docRef.where("id", "==", "0004b7a281d43fac5ef9").get();

  response.send(getDoc);
}
