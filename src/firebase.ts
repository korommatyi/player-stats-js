import * as firebase from "firebase"

const config = {
  apiKey: "AIzaSyC3J1d0aIsil-MVtWbDNzVVGXO0tPrnQgw",
  authDomain: "c99-foci-stats.firebaseapp.com",
  databaseURL: "https://c99-foci-stats.firebaseio.com",
  projectId: "c99-foci-stats",
  storageBucket: "c99-foci-stats.appspot.com",
  messagingSenderId: "439716566573"
};

export function init() {
  firebase.initializeApp(config);
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    }
  });
}

export function onDataChange(fn: (data: any) => void) {
  const db = firebase.database();
  const results = db.ref("/results");
  results.on("value", snapshot => fn(snapshot.val()));
}
