var express = require("express");
var passport = require("passport");
var path = require("path");

var User = require("./models/user");
var router = express.Router();

const myDatabase = require("./myDatabase");
let db = new myDatabase();

const Info = require("./Info");

router.use(function (req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

//new create code from signup.
router.post("/create", function (req, res) {
  if (!req.isAuthenticated()) {
    console.log("req is not Authenticated");
    res.json({ error: true });
    return;
  }

  let trimIdentifier = req.body.identifier.trim();
  if (trimIdentifier == "") {
    res.json({ error: true });
    return;
  }

  let identifier = Number(trimIdentifier);
  if (Number.isNaN(identifier)) {
    res.json({ error: true });
    return;
  }

  let trimgradeLevel = req.body.gradeLevel.trim();
  if (trimgradeLevel == "") {
    res.json({ error: true });
    return;
  }

  let gradeLevel = Number(trimgradeLevel);
  if (Number.isNaN(gradeLevel)) {
    res.json({ error: true });
    return;
  }

  //    let name = req.body.name.trim();
  //    if (name == "") {
  //        res.json({error:true});
  //        return;
  //    }

  let obj = new Info(
    identifier,
    req.user.username,
    gradeLevel,
    req.body.canDrive
  );
  ////change code
  db.postData(obj, res);
  ////    return(db.postData(obj,res));
  ///*
  //    let val = db.postData(obj);
  //    if (val)
  //        res.json({error:false});
  //    else
  //        res.json({error:true});
  //*/

  console.log("post create routesData.js");
  //    res.json({error:true});
});

router.get("/read", function (req, res) {
  if (!req.isAuthenticated()) {
    console.log("req is not Authenticated");
    res.json({ error: true });
    return;
  }

  //changed code.
  return db.getData(req.user.username, res);
  /*
    let val = db.getData(identifier);
    if (val == null)
        res.json({error:true});
    else
        res.json({error:false,name:val.name});
*/
});

router.put("/update", function (req, res) {
  if (!req.isAuthenticated()) {
    console.log("req is not Authenticated");
    res.json({ error: true });
    return;
  }

  let trimIdentifier = req.body.identifier.trim();
  if (trimIdentifier == "") {
    res.json({ error: true });
    return;
  }

  let identifier = Number(trimIdentifier);
  if (Number.isNaN(identifier)) {
    res.json({ error: true });
    return;
  }

  let trimgradeLevel = req.body.gradeLevel.trim();
  if (trimgradeLevel == "") {
    res.json({ error: true });
    return;
  }

  let gradeLevel = Number(trimgradeLevel);
  if (Number.isNaN(gradeLevel)) {
    res.json({ error: true });
    return;
  }

  let canDrive = req.body.canDrive.trim();

  console.log("here = " + gradeLevel);
  let obj = new Info(identifier, req.user.username, gradeLevel, canDrive);
  //changed code.
  return db.putData(obj, res);
  /*    
    let val = db.putData(obj);
    if (val)
        res.json({error:false});
    else
        res.json({error:true});
 
*/
});

router.delete("/delete/:identifier", function (req, res) {
  if (!req.isAuthenticated()) {
    console.log("req is not Authenticated");
    res.json({ error: true });
    return;
  }

  //changed code.
  //    return( db.deleteData(identifier,res));
  return db.deleteData(req.user.username, res);
  /*
    let val = db.deleteData(identifier);
    if (val == null)
        res.json({error:true});
    else
        res.json({error:false});
*/
});

router.get("/readAdmin", function (req, res) {
  if (!req.isAuthenticated()) {
    console.log("req is not Authenticated");
    res.json({ error: true });
    return;
  }

  //changed code.
  console.log(req.query.username);
  return db.getData(req.query.username, res);
  /*
    let val = db.getData(identifier);
    if (val == null)
        res.json({error:true});
    else
        res.json({error:false,name:val.name});
*/
});

router.put("/updateAdmin", function (req, res) {
  if (!req.isAuthenticated()) {
    console.log("req is not Authenticated");
    res.json({ error: true });
    return;
  }

  let trimIdentifier = req.body.identifier.trim();
  if (trimIdentifier == "") {
    res.json({ error: true });
    return;
  }

  let identifier = Number(trimIdentifier);
  if (Number.isNaN(identifier)) {
    res.json({ error: true });
    return;
  }

  let trimgradeLevel = req.body.gradeLevel.trim();
  if (trimgradeLevel == "") {
    res.json({ error: true });
    return;
  }

  let gradeLevel = Number(trimgradeLevel);
  if (Number.isNaN(gradeLevel)) {
    res.json({ error: true });
    return;
  }

  let canDrive = req.body.canDrive;

  console.log("here = " + gradeLevel + " " + canDrive);
  let obj = new Info(identifier, req.body.username, gradeLevel, canDrive);
  //changed code.
  return db.putData(obj, res);
});

module.exports = router;
