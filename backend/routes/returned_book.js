const express = require("express");
const router = express.Router();
const { returnbook } = require("../controllers/returnbookcontroller");
router.post("/", returnbook);
module.exports = router;
