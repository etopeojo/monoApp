var express = require("express");
var router = express.Router();
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/getInteractionLogFile", function (req, res, next) {
  let filePath = path.resolve(__dirname, "../log/interactions.txt");
  res.sendFile(filePath);
});

router.get("/getErrorLogFile", function (req, res, next) {
  let filePath = path.resolve(__dirname, "../log/errors.txt");
  res.sendFile(filePath);
});

module.exports = router;
