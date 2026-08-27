const pool = require("../db");

const getbooks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT books.id, books.title,books.isbn, authors.author_name, publishers.publisher_name, book_category.category_name,books.published_year,books.total_copies,books.available_copies,books.shelf_location FROM books JOIN authors ON books.author_id = authors.id JOIN publishers ON books.publisher_id = publishers.id JOIN book_category ON books.category_id = book_category.id",
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const getbook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT books.id, books.title,books.isbn, authors.author_name, publishers.publisher_name, book_category.category_name,books.published_year,books.total_copies,books.available_copies,books.shelf_location FROM books JOIN authors ON books.author_id = authors.id JOIN publishers ON books.publisher_id = publishers.id JOIN book_category ON books.category_id = book_category.id WHERE books.id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const addbook = async (req, res) => {
  try {
    const {
      title,
      isbn,
      author_id,
      publisher_id,
      category_id,
      published_year,
      total_copies,
      shelf_location,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO books(title, isbn, author_id, publisher_id, category_id, published_year, total_copies, available_copies, shelf_location) VALUES($1,$2,$3,$4,$5,$6,$7,$7,$8) RETURNING *",
      [
        title,
        isbn,
        author_id,
        publisher_id,
        category_id,
        published_year,
        total_copies,
        shelf_location,
      ],
    );

    res
      .status(200)
      .json({ message: "Book added successfully", book: result.rows[0] });
  } catch (error) {
    console.log(error);
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Book already exists",
      });
    }
    res.status(500).json({ message: "something went wrong" });
  }
};

const updatebook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      ISBN,
      category,
      quantity,
      publishedyear,
      location,
      publisher,
    } = req.body;
    const authorResult = await pool.query(
      "SELECT id FROM authors WHERE author_name = $1",
      [author],
    );
    const publisherResult = await pool.query(
      "SELECT id FROM publishers WHERE publisher_name = $1",
      [publisher],
    );
    const categoryResult = await pool.query(
      "SELECT id FROM book_category WHERE category_name = $1",
      [category],
    );
    if (
      authorResult.rows.length === 0 ||
      publisherResult.rows.length === 0 ||
      categoryResult.rows.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "Author, publisher or category not found" });
    }

    const result = await pool.query(
      "UPDATE books SET title = $1, author_id = $2 ,isbn = $3, publisher_id =$4, category_id =$5, published_year =$6, total_copies =$7,  shelf_location =$8 WHERE id = $9 RETURNING *",
      [
        title,
        authorResult.rows[0].id,
        ISBN,
        publisherResult.rows[0].id,
        categoryResult.rows[0].id,
        publishedyear,
        quantity,
        location,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res
      .status(200)
      .json({ message: "Book Updated Successfully", book: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const deletebook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res
      .status(200)
      .json({ message: "Book Deleted Successfully", book: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { getbooks, addbook, getbook, updatebook, deletebook };
