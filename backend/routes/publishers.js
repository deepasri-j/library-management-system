const express = require("express");

const router = express.Router();

const {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
} = require("../controllers/publishercontroller");

router.get("/", getPublishers);

router.get("/:id", getPublisherById);

router.post("/", createPublisher);

router.put("/:id", updatePublisher);

router.delete("/:id", deletePublisher);

module.exports = router;
