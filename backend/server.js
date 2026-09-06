const express = require("express");
const cors = require("cors");
const authorRoutes = require("./routes/authors");
const publisherRoutes = require("./routes/publishers");
const categoryRoutes = require("./routes/categories");
const membersRoutes = require("./routes/members");
const issuedbooksRoutes = require("./routes/issued_books");
const returnedbookRoutes = require("./routes/returned_book");
const bookRoutes = require("./routes/books");
const dashboardRoutes = require("./routes/dashboardroutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/authors", authorRoutes);
app.use("/publishers", publisherRoutes);
app.use("/categories", categoryRoutes);
app.use("/members", membersRoutes);
app.use("/issued-books", issuedbooksRoutes);
app.use("/returned-books", returnedbookRoutes);
app.use("/books", bookRoutes);
app.use("/stats", dashboardRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//practice learning
// app.get("/books", async (req, res) => {
//   const result = await pool.query("SELECT * FROM books");
//   res.json(result.rows);
// });
// // app.get("/books/:id", async (req, res) => {
// //   const id = req.params.id;

// //   const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

// //   res.json(result.rows);
// // });

// app.delete("/books/:id", async (req, res) => {
//   const id = req.params.id;
//   await pool.query("DELETE FROM Books where id = $1", [id]);
//   res.send("Book deleted Successfully");
// });

// app.put("/books/:id", async (req, res) => {
//   const id = req.params.id;
//   const { title, isbn, published_year, total_copies } = req.body;
//   await pool.query(
//     "UPDATE books SET title = $1, isbn = $2, published_year = $3, total_copies = $4 WHERE id = $5",
//     [title, isbn, published_year, total_copies, id],
//   );
//   res.send("Updated Successfully");
// });

//sending data to database
// app.post("/books", async (req, res) => {
//   const {
//     title,
//     isbn,
//     author_id,
//     publisher_id,
//     category_id,
//     published_year,
//     total_copies,
//     available_copies,
//     shelf_location,
//   } = req.body;
//   await pool.query(
//     "INSERT INTO books(title, isbn, author_id, publisher_id, category_id,published_year, total_copies,available_copies,shelf_location) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9)",
//     [
//       title,
//       isbn,
//       author_id,
//       publisher_id,
//       category_id,
//       published_year,
//       total_copies,
//       available_copies,
//       shelf_location,
//     ],
//   );
//   res.send("Book Added Successfully");
// });

//getting one title from database
// app.get("/search", async (req, res) => {
//   const title = req.query.title;
//   // const result = await pool.query("SELECT title FROM books WHERE title = $1", [
//   //   title,
//   // ]);
//   res.send(title);
//   // res.json(result.title);
// });

// //try catch
// // app.get("/search", async (req, res) => {
// //   try {
// //     const title = req.query.title;
// //     const result = await pool.query("SELECT * FROM books WHERE wrong_column = $1", [
// //       title,
// //     ]);
// //     if (result.rows.length === 0) {
// //       return res.status(404).send("Book not found");
// //     }
// //     res.json(result.rows);
// //   } catch (error) {
// //     res.status(500).send("Data error occured");
// //   }
// // });

//try-catch block for ILIKE

// // app.get("/search", async (req, res) => {
// //   try {
// //     const title = req.query.title;
// //     const result = await pool.query(
// //       "SELECT * FROM books WHERE title ILIKE $1",
// //       [`%${title}%`],
// //     );
// //     if (result.rows.length === 0) {
// //       return res.status(404).send("Book not found");
// //     }
// //     res.json(result.rows);
// //   } catch (error) {
// //     res.status(500).send("Data error occured");
// //   }
// // });

// getting data using join
// app.get("/books/:id", async (req, res) => {
//   const id = req.params.id;
//   const result = await pool.query(
//     "SELECT books.title, authors.author_name,publishers.publisher_name,book_category.category_name FROM books JOIN authors ON books.author_id = authors.id JOIN publishers ON books.publisher_id = publishers.id JOIN book_category ON books.category_id = book_category.id  WHERE books.id = $1",
//     [id],
//   );
//   res.json(result.rows);
// });

//updating multiple datas
// app.put("/books/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const { title, isbn, published_year } = req.body;
//     const result = await pool.query(
//       "UPDATE books SET title = $1 , isbn = $2, published_year=$3  WHERE id = $4",
//       [title, isbn, published_year, id],
//     );
//     res.send("Data Updated Successfully");
//   } catch (error) {
//     res.status(500).send("Data error occured");
//   }
// });

// //Using delete actually checking whether the data got deleted or not by using row count
// app.delete("/books/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await pool.query("DELETE FROM books WHERE id = $1", [id]);
//     if (result.rowCount === 0) {
//       return res.status(404).send("Book not found");
//     }
//     res.send("Book deleted successfully");
//   } catch (error) {
//     res.status(500).send("Some error occured");
//   }
// });

// app.post("/books", async (req, res) => {
//   const {
//     title,
//     isbn,
//     author_id,
//     publisher_id,
//     category_id,
//     published_year,
//     total_copies,
//     available_copies,
//     shelf_location,
//   } = req.body;
//   if (!title || !isbn || !published_year) {
//     return res.status(400).send("Bad Request");
//   }

//   try {
//     await pool.query(
//       "INSERT INTO books(title, isbn, author_id, publisher_id, category_id,published_year, total_copies,available_copies,shelf_location) VALUES($1,$2, $3, $4, $5,$6,$7,$8,$9)",
//       [
//         title,
//         isbn,
//         author_id,
//         publisher_id,
//         category_id,
//         published_year,
//         total_copies,
//         available_copies,
//         shelf_location,
//       ],
//     );

//     res.send("Book inserted successfully");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Something went wrong");
//   }
// });
