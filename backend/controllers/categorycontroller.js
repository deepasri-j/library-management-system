const pool = require("../db");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM book_category");

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const createCategory = async (req, res) => {
  const { category_name } = req.body;
  if (!category_name) {
    return res.status(400).send("category name is required");
  }
  try {
    const result = await pool.query(
      "INSERT INTO book_category(category_name) VALUES($1) RETURNING *",
      [category_name],
    );
    res.json({
      message: "Category Inserted Successfully",
      category: "result.rows[0]",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

module.exports = { getCategories, createCategory };
