const express = require("express");
const router = express.Router();
const {
  getmembers,
  addmembers,
  getmember,
  updateMember,
  deletemember,
} = require("../controllers/membercontroller");
router.get("/", getmembers);
router.post("/", addmembers);
router.get("/:member_id", getmember);
router.put("/:member_id", updateMember);
router.delete("/:member_id", deletemember);

module.exports = router;
