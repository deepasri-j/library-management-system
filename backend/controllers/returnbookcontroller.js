const pool = require("../db");
const returnbook = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { member_id, book_isbn, return_date } = req.body;
    const issuedbookResult = await client.query(
      "SELECT issued_books.id,issued_books.book_id,issued_books.member_id,issued_books.due_date,issued_books.status FROM issued_books JOIN books ON issued_books.book_id = books.id JOIN members ON issued_books.member_id = members.id WHERE members.member_id = $1 AND books.isbn = $2 AND issued_books.status ='Not Returned'",
      [member_id, book_isbn],
    );
    if (issuedbookResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Issued Book Not Found" });
    }
    // if (issuedbookResult.rows[0].status === "Returned") {
    //   await client.query("ROLLBACK");
    //   return res.status(409).json({ message: "Book already returned" });
    // }
    const dueDate = new Date(issuedbookResult.rows[0].due_date);
    const returnDate = new Date(return_date);
    const lateDays = Math.max(
      0,
      Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)),
    );
    const fineAmount = lateDays * 10;
    await client.query(
      "UPDATE issued_books SET return_date = $1, status = $2, fine_amount = $3 WHERE id = $4",
      [return_date, "Returned", fineAmount, issuedbookResult.rows[0].id],
    );

    await client.query(
      "UPDATE books SET available_copies = available_copies+1 WHERE id = $1",
      [issuedbookResult.rows[0].book_id],
    );
    await client.query("COMMIT");

    res
      .status(200)
      .json({ message: "Book Returned successfully", fineAmount: fineAmount });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  } finally {
    client.release();
  }
};

module.exports = { returnbook };
