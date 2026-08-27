const express = require("express");
const router = express.Router();
const {
  getbooks,
  addbook,
  getbook,
  updatebook,
  deletebook,
} = require("../controllers/bookcontroller");

router.get("/", getbooks);
router.post("/", addbook);
router.get("/:id", getbook);
router.put("/:id", updatebook);
router.delete("/:id", deletebook);

module.exports = router;
