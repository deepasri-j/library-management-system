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
const loginRoutes = require("./routes/loginroutes");

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
app.use("/login", loginRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
