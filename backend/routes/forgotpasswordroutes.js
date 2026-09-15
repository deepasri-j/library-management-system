const express = require("express");
const router = express.Router();
const { forgotpassword } = require("../controllers/forgotpasswordcontroller");
router.post("/", forgotpassword);
module.exports = router;
