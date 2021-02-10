const firebase = require("firebase/app");
require("firebase/auth");
// const admin = require("firebase-admin");
// const db = admin.firestore();


module.exports.isLoggedIn = (req, res, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      return res.redirect("login");
    }
    next();
  });
};

module.exports.isClubHead = (req, res, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      return res.redirect("heads_login");
    }
    next();
  });
};
