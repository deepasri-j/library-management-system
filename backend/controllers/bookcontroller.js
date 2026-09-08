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
      "SELECT books.id, books.title,books.isbn,books.author_id, authors.author_name,books.publisher_id,publishers.publisher_name, books.category_id,book_category.category_name,books.published_year,books.total_copies,books.available_copies,books.shelf_location FROM books JOIN authors ON books.author_id = authors.id JOIN publishers ON books.publisher_id = publishers.id JOIN book_category ON books.category_id = book_category.id WHERE books.id = $1",
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
      author_id,
      isbn,
      category_id,
      total_copies,
      published_year,
      shelf_location,
      publisher_id,
    } = req.body;
    const currentBook = await pool.query(
      "SELECT total_copies, available_copies FROM books WHERE id = $1",
      [id],
    );
    if (currentBook.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    const issuedCopies =
      currentBook.rows[0].total_copies - currentBook.rows[0].available_copies;
    const newAvailableCopies = total_copies - issuedCopies;
    if (newAvailableCopies < 0) {
      return res.status(400).json({
        message: "Total copies cannot be less than currently issued copies",
      });
    }

    const result = await pool.query(
      "UPDATE books SET title = $1, author_id = $2 ,isbn = $3, publisher_id =$4, category_id =$5, published_year =$6, total_copies =$7,  available_copies = $8, shelf_location =$9 WHERE id = $10 RETURNING *",
      [
        title,
        author_id,
        isbn,
        publisher_id,
        category_id,
        published_year,
        total_copies,
        newAvailableCopies,
        shelf_location,
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
    if (error.code === "23503") {
      return res.status(409).json({
        message: "This book cannot be deleted because it has issue history",
      });
    }
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { getbooks, addbook, getbook, updatebook, deletebook };
