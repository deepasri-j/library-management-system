const express = require("express");
const router = express.Router();
const { issueBook } = require("../controllers/issuedbookscontroller");

router.post("/", issueBook);

module.exports = router;
