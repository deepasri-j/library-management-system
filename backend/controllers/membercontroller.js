const pool = require("../db");

const getmembers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const addmembers = async (req, res) => {
  const { member_id, member_name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO members(member_id,member_name,email) VALUES($1,$2,$3) RETURNING *",
      [member_id, member_name, email],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      if (error.constraint === "members_member_id_unique") {
        return res.status(409).json({ message: "Member ID already exists" });
      }
      if (error.constraint === "members_email_unique") {
        return res.status(409).json({ message: "Member email already exists" });
      }
    }
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const getmember = async (req, res) => {
  const { member_id } = req.params;

  try {
    const memberResult = await pool.query(
      "SELECT * FROM members WHERE member_id = $1",
      [member_id],
    );
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    const bookResult = await pool.query(
      "SELECT books.title, books.isbn, issued_books.issue_date, issued_books.due_date, issued_books.status, issued_books.fine_amount FROM issued_books JOIN books ON issued_books.book_id = books.id JOIN members ON issued_books.member_id = members.id WHERE members.member_id = $1",
      [member_id],
    );
    res.json({ member: memberResult.rows[0], borrowed_books: bookResult.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const updateMember = async (req, res) => {
  try {
    const { member_id } = req.params;
    const { member_name, email } = req.body;
    const result = await pool.query(
      "UPDATE members SET member_name = $1, email = $2 WHERE member_id = $3 RETURNING *",
      [member_name, email, member_id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member updated successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Member email already exists",
      });
    }
    res.status(500).json({ message: "something went wrong" });
  }
};
const deletemember = async (req, res) => {
  try {
    const { member_id } = req.params;
    const result = await pool.query(
      "DELETE FROM members WHERE member_id = $1 RETURNING *",
      [member_id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    res
      .status(200)
      .json({ message: "Member Deleted Successfully", member: result.rows[0] });
  } catch (error) {
    console.log(error);
    if (error.code === "23503") {
      return res.status(409).json({
        message: "Cannot delete member because they have issued books",
      });
    }
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  getmembers,
  addmembers,
  getmember,
  updateMember,
  deletemember,
};
