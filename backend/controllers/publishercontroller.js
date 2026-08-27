const pool = require("../db");

const getPublishers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM publishers");

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

const getPublisherById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM publishers WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Publisher not found");
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

const createPublisher = async (req, res) => {
  const { publisher_name } = req.body;

  if (!publisher_name) {
    return res.status(400).send("Publisher name is required");
  }

  try {
    await pool.query(
      "INSERT INTO publishers(publisher_name) VALUES($1)",
      [publisher_name],
    );

    res.send("Publisher inserted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

const updatePublisher = async (req, res) => {
  const id = req.params.id;
  const { publisher_name } = req.body;

  if (!publisher_name) {
    return res.status(400).send("Publisher name required");
  }

  try {
    const result = await pool.query(
      "UPDATE publishers SET publisher_name = $1 WHERE id = $2",
      [publisher_name, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Publisher not found");
    }

    res.send("Publisher Updated Successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

const deletePublisher = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM publishers WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Publisher not found");
    }

    res.send("Publisher deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

module.exports = {
  getPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher,
};