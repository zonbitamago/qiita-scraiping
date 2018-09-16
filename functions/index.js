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
  // if (request.method == "POST") {
  //   const json = request.body;
  //   console.log("json.length:", json.length);
  //   json.forEach(data => {
  //     var docRef = db.collection("qiita").doc(data.id);
  //     docRef.set(data);
  //   });
  //   response.send("Hello QiitaScraiping!");
  // } else {
  // }
  request.method == "POST"
    ? postFunction(request, response)
    : getFUnction(request, response);
});

function postFunction(request, response) {
  const json = request.body;
  console.log("json.length:", json.length);

  json.forEach(data => {
    var docRef = db.collection("qiita").doc(data.id);
    docRef.set(data);
  });

  response.send("Hello postFunction!");
}

async function getFUnction(request, response) {
  const docRef = db.collection("qiita").doc("c2c658925f7d70c4077f");
  const getDoc = await docRef.get()
  if (!getDoc.exists) {
      console.log("No such document!");
    } else {
      console.log(getDoc);
    }
  }

  response.send(getDoc);
}
