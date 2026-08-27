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

module.exports = { getCategories };