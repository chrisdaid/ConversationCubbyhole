var express = require("express");
var mongoose = require("mongoose");
var InfoModel = require("./models/Info");
//const Data = require('./Data');
//var routes = require("./routes");

let myDatabase = function () {};

myDatabase.prototype.postData = function (data, res) {
  let obj = {
    ident: data.ident,
    name: data.name,
    gradeLevel: data.gradeLevel,
    canDrive: data.canDrive,
  };
  InfoModel.create(obj, function (error, info) {
    if (error) {
      return res.json({ error: true });
    }
    return res.json({ error: false });
  });
};

myDatabase.prototype.getData = function (name, res) {
  console.log("getData");
  InfoModel.find({ name: name }, function (error, info) {
    if (error) {
      return res.json({ error: true });
    } else if (info == null) {
      return res.json({ error: true });
    }

    if (info.length == 1)
      return res.json({
        error: false,
        ident: info[0].ident,
        gradeLevel: info[0].gradeLevel,
        canDrive: info[0].canDrive,
      });
    else return res.json({ error: true });
  });
};

myDatabase.prototype.putData = function (data, res) {
  //  InfoModel.findOneAndUpdate({ident:data.ident},{name:data.name,gradeLevel:data.gradeLevel},function(error,oldData) {
  InfoModel.findOneAndUpdate(
    { name: data.name },
    { ident: data.ident, gradeLevel: data.gradeLevel, canDrive: data.canDrive },
    function (error, oldData) {
      if (error) {
        return res.json({ error: true });
      } else if (oldData == null) {
        return res.json({ error: true });
      }

      //    console.log("old identA = " + identA);
      //    if (identA < data.ident)
      //      identA = data.ident;
      //    console.log("new identA = " + identA);

      return res.json({ error: false });
    }
  );
};

myDatabase.prototype.deleteData = function (name, res) {
  InfoModel.remove({ name: name }, function (error, removed) {
    if (error) {
      return res.json({ error: true });
    }
    if (removed.result.n == 0) return res.json({ error: true });
    return res.json({ error: false });
  });
};

module.exports = myDatabase;
