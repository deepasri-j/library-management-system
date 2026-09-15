const express = require("express");
const router = express.Router();
const { resetPassword } = require("../controllers/resetpasswordcontroller");
router.post("/", resetPassword);
module.exports = router;
