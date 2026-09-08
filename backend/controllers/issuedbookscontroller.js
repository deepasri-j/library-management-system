const pool = require("../db");

const issueBook = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("body:", req.body);
    const { member_id, book_isbn, issued_date, due_date } = req.body;
    const memberResult = await client.query(
      "SELECT id FROM members WHERE member_id = $1",
      [member_id],
    );
    if (memberResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Member not found" });
    }
    const bookResult = await client.query(
      "SELECT id, available_copies FROM books WHERE isbn = $1",
      [book_isbn],
    );

    if (bookResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Book Not found" });
    }

    if (bookResult.rows[0].available_copies <= 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Book is out of stock" });
    }

    const issueResult = await client.query(
      "INSERT INTO issued_books(book_id, member_id, issue_date,due_date,status,fine_amount) VALUES($1, $2, $3,$4,$5,$6) RETURNING *",
      [
        bookResult.rows[0].id,
        memberResult.rows[0].id,
        issued_date,
        due_date,
        "Not Returned",
        0,
      ],
    );

    await client.query(
      "UPDATE books SET available_copies = available_copies-1 WHERE id = $1",
      [bookResult.rows[0].id],
    );
    await client.query("COMMIT");

    res.status(201).json({
      message: "book issued successfully",
      issuedBook: issueResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  } finally {
    client.release();
  }
};

module.exports = { issueBook };
