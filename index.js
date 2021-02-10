// run vercel command to deploy after any changes
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const serviceAccount = require("./permissions.json");
const ExpressError = require("./ExpressError");
const firebase = require("firebase/app");
require("firebase/auth");
const config = require("./config.json");
const { isLoggedIn, isClubHead } = require("./auth");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
firebase.initializeApp(config);

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.use((req, res, next) => {
  res.locals.currentUser = firebase.auth().currentUser;
  next();
});

// Routes
// MAIN PAGE

const image = {
  club1: "Images/frag.jpg",
  club2: "Images/graphex.jpg",
  club3: "Images/noteveda.jpg",
  club4: "Images/cam.jpg",
};
const src = ["Images/frag.jpg","Images/graphex.jpg","Images/noteveda.jpg","Images/cam.jpg",];

app.get("/", async (req, res) => {
  const clubs = await db.doc("Index/ZsJzv2eD0qDeXjV4e05b").get();
  const club = clubs.data();
  const clubNames = [];
  const clubSlogan = [];
  for(let c of club.Club){
    const clubName = await c.get();
    const cN = clubName.data();
    clubNames.push(cN.title);
    clubSlogan.push(cN.Slogan);
  }
  res.render("index",{clubNames, clubSlogan, src});
});

//CLUB-HEAD PAGE
app
  .get("/club_head",isClubHead, async (req, res) => {
    const c = await db.doc("Clubs/Club 1").get();
    const club = c.data();
    const events = await db.collection("Clubs/Club 1/Events").listDocuments();
    const eventDetails = [];
    const participantDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
      for (let student of details.Participants) {
        const detail = await student.get();
        participantDetails.push(detail.data());
      }
    }
    const votes = await db.collection("Clubs/Club 1/Vote").listDocuments();
    const voteEvent = [];
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteEvent.push(details);
    }
    const r = await db.doc("Clubs/Club 1/Register/Members").get();
    const s_reg = r.data();
    const members = [];
    for (let m of s_reg.List_Of_Members) {
      const detail = await m.get();
      members.push(detail.data());
    }
    const contacts = await db
      .collection("/Clubs/Club 1/Contact Us")
      .listDocuments();
    const contactUs = [];
    for (let cu of contacts) {
      const data = await cu.get();
      const details = data.data();
      contactUs.push(details);
    }
    res.render("club_head", {
      club,
      participantDetails,
      eventDetails,
      voteEvent,
      members,
      contactUs,
    });
  })
  .post("/c1_head",isClubHead, async (req, res) => {
    const data = {
      title: `${req.body.Title}`,
      Slogan: `${req.body.Slogan}`,
      Speciality: `${req.body.Speciality}`,
      Description: `${req.body.Description}`,
    };
    await db
      .doc("Clubs/Club 1")
      .update({
        title: data.title,
        Slogan: data.Slogan,
        Speciality: data.Speciality,
        Description: data.Description,
      })
      .then(() => {
        res.redirect("club_head");
      });
  })
  .post("/c1_head_event", isClubHead,async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Participants: [],
    };
    await db
      .collection("Clubs/Club 1/Events")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club_head");
      });
  })
  .post("/c1_head_eRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 1/Events").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club_head");
  })
  .post("/c1_head_vote",isClubHead, async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Yes: 0,
      No: 0,
    };
    await db
      .collection("Clubs/Club /Vote")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club_head");
      });
  })
  .post("/c1_head_vRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 1/Vote").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club_head");
  });

app
  .get("/club3_head",isClubHead, async (req, res) => {
    const c = await db.doc("Clubs/Club 3").get();
    const club = c.data();
    const events = await db.collection("Clubs/Club 3/Events").listDocuments();
    const eventDetails = [];
    const participantDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
      for (let student of details.Participants) {
        const detail = await student.get();
        participantDetails.push(detail.data());
      }
    }
    const votes = await db.collection("Clubs/Club 3/Vote").listDocuments();
    const voteEvent = [];
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteEvent.push(details);
    }
    const r = await db.doc("Clubs/Club 3/Register/Members").get();
    const s_reg = r.data();
    const members = [];
    for (let m of s_reg.List_Of_Members) {
      const detail = await m.get();
      members.push(detail.data());
    }
    const contacts = await db
      .collection("/Clubs/Club 3/Contact Us")
      .listDocuments();
    const contactUs = [];
    for (let cu of contacts) {
      const data = await cu.get();
      const details = data.data();
      contactUs.push(details);
    }
    res.render("club_head", {
      club,
      participantDetails,
      eventDetails,
      voteEvent,
      members,
      contactUs,
    });
  })
  .post("/club3_head",isClubHead, async (req, res) => {
    const data = {
      title: `${req.body.Title}`,
      Slogan: `${req.body.Slogan}`,
      Speciality: `${req.body.Speciality}`,
      Description: `${req.body.Description}`,
    };
    await db
      .doc("Clubs/Club 3")
      .update({
        title: data.title,
        Slogan: data.Slogan,
        Speciality: data.Speciality,
        Description: data.Description,
      })
      .then(() => {
        res.redirect("club3_head");
      });
  })
  .post("/club3_head_event", isClubHead,async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Participants: [],
    };
    await db
      .collection("Clubs/Club 3/Events")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club3_head");
      });
  })
  .post("/club3_head_eRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 3/Events").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club3_head");
  })
  .post("/club3_head_vote",isClubHead, async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Yes: 0,
      No: 0,
    };
    await db
      .collection("Clubs/Club 3/Vote")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club3_head");
      });
  })
  .post("/club3_head_vRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 3/Vote").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club3_head");
  });

app
  .get("/club4_head",isClubHead, async (req, res) => {
    const c = await db.doc("Clubs/Club 4").get();
    const club = c.data();
    const events = await db.collection("Clubs/Club 4/Events").listDocuments();
    const eventDetails = [];
    const participantDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
      for (let student of details.Participants) {
        const detail = await student.get();
        participantDetails.push(detail.data());
      }
    }
    const votes = await db.collection("Clubs/Club 4/Vote").listDocuments();
    const voteEvent = [];
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteEvent.push(details);
    }
    const r = await db.doc("Clubs/Club 4/Register/Members").get();
    const s_reg = r.data();
    const members = [];
    for (let m of s_reg.List_Of_Members) {
      const detail = await m.get();
      members.push(detail.data());
    }
    const contacts = await db
      .collection("/Clubs/Club 4/Contact Us")
      .listDocuments();
    const contactUs = [];
    for (let cu of contacts) {
      const data = await cu.get();
      const details = data.data();
      contactUs.push(details);
    }
    res.render("club_head", {
      club,
      participantDetails,
      eventDetails,
      voteEvent,
      members,
      contactUs,
    });
  })
  .post("/club4_head",isClubHead, async (req, res) => {
    const data = {
      title: `${req.body.Title}`,
      Slogan: `${req.body.Slogan}`,
      Speciality: `${req.body.Speciality}`,
      Description: `${req.body.Description}`,
    };
    await db
      .doc("Clubs/Club 4")
      .update({
        title: data.title,
        Slogan: data.Slogan,
        Speciality: data.Speciality,
        Description: data.Description,
      })
      .then(() => {
        res.redirect("club4_head");
      });
  })
  .post("/club4_head_event",isClubHead, async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Participants: [],
    };
    await db
      .collection("Clubs/Club 4/Events")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club4_head");
      });
  })
  .post("/club4_head_eRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 4/Events").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club4_head");
  })
  .post("/club4_head_vote",isClubHead, async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Yes: 0,
      No: 0,
    };
    await db
      .collection("Clubs/Club 4/Vote")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club4_head");
      });
  })
  .post("/club4_head_vRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 4/Vote").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club4_head");
  });

app
  .get("/club2_head",isClubHead, async (req, res) => {
    const c = await db.doc("Clubs/Club 2").get();
    const club = c.data();
    const events = await db.collection("Clubs/Club 2/Events").listDocuments();
    const eventDetails = [];
    const participantDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
      for (let student of details.Participants) {
        const detail = await student.get();
        participantDetails.push(detail.data());
      }
    }
    const votes = await db.collection("Clubs/Club 2/Vote").listDocuments();
    const voteEvent = [];
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteEvent.push(details);
    }
    const r = await db.doc("Clubs/Club 2/Register/Members").get();
    const s_reg = r.data();
    const members = [];
    for (let m of s_reg.List_Of_Members) {
      const detail = await m.get();
      members.push(detail.data());
    }
    const contacts = await db
      .collection("/Clubs/Club 2/Contact Us")
      .listDocuments();
    const contactUs = [];
    for (let cu of contacts) {
      const data = await cu.get();
      const details = data.data();
      contactUs.push(details);
    }
    res.render("club_head", {
      club,
      participantDetails,
      eventDetails,
      voteEvent,
      members,
      contactUs,
    });
  })
  .post("/club2_head",isClubHead, async (req, res) => {
    const data = {
      title: `${req.body.Title}`,
      Slogan: `${req.body.Slogan}`,
      Speciality: `${req.body.Speciality}`,
      Description: `${req.body.Description}`,
    };
    await db
      .doc("Clubs/Club 2")
      .update({
        title: data.title,
        Slogan: data.Slogan,
        Speciality: data.Speciality,
        Description: data.Description,
      })
      .then(() => {
        res.redirect("club2_head");
      });
  })
  .post("/club2_head_event",isClubHead, async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Participants: [],
    };
    await db
      .collection("Clubs/Club 2/Events")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club2_head");
      });
  })
  .post("/club2_head_eRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 2/Events").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club2_head");
  })
  .post("/club2_head_vote",isClubHead, async (req, res) => {
    const data = {
      Title: `${req.body.Title}`,
      SubTitle: `${req.body.Subtitle}`,
      Description: `${req.body.Description}`,
      Yes: 0,
      No: 0,
    };
    await db
      .collection("Clubs/Club 2/Vote")
      .doc(`${data.Title}`)
      .set(data)
      .then(() => {
        res.redirect("club2_head");
      });
  })
  .post("/club2_head_vRemove",isClubHead, async (req, res) => {
    const docs = await db.collection("Clubs/Club 2/Vote").listDocuments();  
    for(let doc of docs){
      doc.delete()
    }
    res.redirect("club2_head");
  });

//CLUB PAGE
app
  .get("/c1", isLoggedIn, async (req, res) => {
    const c = await db.collection("Clubs").doc("Club 1").get();
    const events = await db.collection("Clubs/Club 1/Events").listDocuments()
    const votes = await db.collection("Clubs/Club 1/Vote").listDocuments()
    const eventDetails = [];
    const voteDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
    }
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteDetails.push(details);
    }
    const src = image.club1;
    const club = c.data();
    res.render("club", { club, src, eventDetails, voteDetails });
  })
  .post("/c1", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc(`/Clubs/Club 1/Events/${req.body.Participate}`)
      .update({ Participants: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("c1");
      });
  })
  .post("/c1v", isLoggedIn, async (req, res) => {
    console.log(req.body);
    if (req.body.yes === "Yes") {
      await db
        .doc(`/Clubs/Club 1/Vote/${req.body.title}`)
        .update({ Yes: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("c1");
        });
    } else {
      await db
        .doc(`/Clubs/Club 1/Vote/${req.body.title}`)
        .update({ No: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("c1");
        });
    }
  })
  .post("/c1r", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc("/Clubs/Club 1/Register/Members")
      .update({ List_Of_Members: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("c1");
      });
  })
  .post("/c1c", isLoggedIn, async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };
    await db
      .collection("/Clubs/Club 1/Contact Us")
      .doc(`${data.name}`)
      .set(data)
      .then(() => {
        res.redirect("c1");
      });
  });

app
  .get("/club2", isLoggedIn, async (req, res) => {
    const c = await db.collection("Clubs").doc("Club 2").get();
    const events = await db.collection("Clubs/Club 2/Events").listDocuments()
    const votes = await db.collection("Clubs/Club 2/Vote").listDocuments()
    const eventDetails = [];
    const voteDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
    }
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteDetails.push(details);
    }
    const src = image.club1;
    const club = c.data();
    res.render("club", { club, src, eventDetails, voteDetails });
  })
  .post("/club2", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc(`/Clubs/Club 2/Events/${req.body.Participate}`)
      .update({ Participants: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("club2");
      });
  })
  .post("/club2v", isLoggedIn, async (req, res) => {
    console.log(req.body);
    if (req.body.yes === "Yes") {
      await db
        .doc(`/Clubs/Club 2/Vote/${req.body.title}`)
        .update({ Yes: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("club2");
        });
    } else {
      await db
        .doc(`/Clubs/Club 2/Vote/${req.body.title}`)
        .update({ No: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("club2");
        });
    }
  })
  .post("/club2r", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc("/Clubs/Club 2/Register/Members")
      .update({ List_Of_Members: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("club2");
      });
  })
  .post("/club2c", isLoggedIn, async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };
    await db
      .collection("/Clubs/Club 2/Contact Us")
      .doc(`${data.name}`)
      .set(data)
      .then(() => {
        res.redirect("club2");
      });
  });

app
  .get("/club3", isLoggedIn, async (req, res) => {
    const c = await db.collection("Clubs").doc("Club 3").get();
    const events = await db.collection("Clubs/Club 3/Events").listDocuments()
    const votes = await db.collection("Clubs/Club 3/Vote").listDocuments()
    const eventDetails = [];
    const voteDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
    }
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteDetails.push(details);
    }
    const src = image.club1;
    const club = c.data();
    res.render("club", { club, src, eventDetails, voteDetails });
  })
  .post("/club3", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc(`/Clubs/Club 3/Events/${req.body.Participate}`)
      .update({ Participants: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("club3");
      });
  })
  .post("/club2v", isLoggedIn, async (req, res) => {
    console.log(req.body);
    if (req.body.yes === "Yes") {
      await db
        .doc(`/Clubs/Club 3/Vote/${req.body.title}`)
        .update({ Yes: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("club3");
        });
    } else {
      await db
        .doc(`/Clubs/Club 3/Vote/${req.body.title}`)
        .update({ No: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("club3");
        });
    }
  })
  .post("/club3r", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc("/Clubs/Club 3/Register/Members")
      .update({ List_Of_Members: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("club3");
      });
  })
  .post("/club3c", isLoggedIn, async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };
    await db
      .collection("/Clubs/Club 3/Contact Us")
      .doc(`${data.name}`)
      .set(data)
      .then(() => {
        res.redirect("club3");
      });
  });

app
  .get("/club4", isLoggedIn, async (req, res) => {
    const c = await db.collection("Clubs").doc("Club 4").get();
    const events = await db.collection("Clubs/Club 4/Events").listDocuments()
    const votes = await db.collection("Clubs/Club 4/Vote").listDocuments()
    const eventDetails = [];
    const voteDetails = [];
    for (let e of events) {
      const data = await e.get();
      const details = data.data();
      eventDetails.push(details);
    }
    for (let v of votes) {
      const data = await v.get();
      const details = data.data();
      voteDetails.push(details);
    }
    const src = image.club1;
    const club = c.data();
    res.render("club", { club, src, eventDetails, voteDetails });
  })
  .post("/club4", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc(`/Clubs/Club 4/Events/${req.body.Participate}`)
      .update({ Participants: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("club4");
      });
  })
  .post("/club4v", isLoggedIn, async (req, res) => {
    console.log(req.body);
    if (req.body.yes === "Yes") {
      await db
        .doc(`/Clubs/Club 4/Vote/${req.body.title}`)
        .update({ Yes: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("club4");
        });
    } else {
      await db
        .doc(`/Clubs/Club 4/Vote/${req.body.title}`)
        .update({ No: admin.firestore.FieldValue.increment(1) })
        .then(() => {
          res.redirect("club4");
        });
    }
  })
  .post("/club4r", isLoggedIn, async (req, res) => {
    const user = await db.doc(
      `/Users/Student_Login/New/${res.locals.currentUser.email}`
    );
    await db
      .doc("/Clubs/Club 4/Register/Members")
      .update({ List_Of_Members: admin.firestore.FieldValue.arrayUnion(user) })
      .then(() => {
        res.redirect("club4");
      });
  })
  .post("/club4c", isLoggedIn, async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };
    await db
      .collection("/Clubs/Club 4/Contact Us")
      .doc(`${data.name}`)
      .set(data)
      .then(() => {
        res.redirect("club4");
      });
  });

//CLUB_HEAD_LOGIN PAGE
app
  .get("/heads_login", (req, res) => {
    res.render("club_heads_login");
  })
  .post("/heads_login", async (req, res) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(req.body.email, req.body.password)
      .then((cred) => {
        db.doc("/Users/Student_Login")
          .get()
          .then((users) => {
            const user = users.data();
            if (user.c1 == cred.user.email) {
              res.redirect("club_head");
            } else if (user.c2 == cred.user.email) {
              res.redirect("club2_head");
            } else if (user.c3 == cred.user.email) {
              res.redirect("club3_head");
            } else if (user.c4 == cred.user.email) {
              res.redirect("club4_head");
            } else {
              res.redirect("login");
            }
          });
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  });

//LOGIN PAGE
app
  .get("/login", (req, res) => {
    res.render("login");
  })
  .post("/login", async (req, res, next) => {
    const data = {
      email: `${req.body.email}`,
      password: `${req.body.password}`,
    };
    await firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((cred) => {
        res.redirect("/");
      })
      .catch((error) => {
        next(error);
      });
  });

//SIGNUP PAGE
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res, next) => {
  const data = {
    name: `${req.body.name}`,
    email: `${req.body.email}`,
    admissionno: `${req.body.adno}`,
    rollno: `${req.body.enroll}`,
    year: `${req.body.year}`,
    mobileno: `${req.body.mobile}`,
    semester: `${req.body.semester}`,
    school: `${req.body.school}`,
    branch: `${req.body.branch}`,
  };
  const pass = req.body.password;
  await firebase
    .auth()
    .createUserWithEmailAndPassword(data.email, pass)
    .then((cred) => {
      db.collection("Users")
        .doc("Student_Login")
        .collection("New")
        .doc(`${data.email}`)
        .set(data);
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
});

//LOGOUT PAGE
app.get("/logout", (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      res.redirect("/");
    });
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Serving on PORT: ${port}`);
})