const pool = require("../db");

const getAuthors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM authors");

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const getAuthorById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM authors WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("Author not found");
    }

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const createAuthor = async (req, res) => {
  const { author_name } = req.body;

  if (!author_name) {
    return res.status(400).send("Author name is required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO authors(author_name) VALUES ($1) RETURNING *",
      [author_name],
    );

    res.json({
      message: "Author inserted successfully",
      author: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { author_name } = req.body;

  try {
    await pool.query("UPDATE authors SET author_name = $1 WHERE id = $2", [
      author_name,
      id,
    ]);

    res.send("Author updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM authors WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).send("Author not found");
    }

    res.send("Author deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
