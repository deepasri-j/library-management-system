const pool = require("../db");

const getDashboardStats = async (req, res) => {
  const result = await pool.query(
    "SELECT COALESCE (SUM(total_copies),0) AS total_books FROM books",
  );
  const availableResult = await pool.query(
    "SELECT COALESCE (SUM(available_copies),0) AS available_books FROM books",
  );
  const issuedbooksResult = await pool.query(
    "SELECT COUNT (*) AS issued_books FROM issued_books WHERE status= 'Not Returned' ",
  );
  const overdueResult = await pool.query(
    "SELECT COUNT (*) AS overdue_books FROM issued_books WHERE status = 'Not Returned' AND due_date < CURRENT_DATE",
  );
  res.status(200).json({
    totalbooks: result.rows[0].total_books,
    availablebooks: availableResult.rows[0].available_books,
    issuedbooks: issuedbooksResult.rows[0].issued_books,
    overdue: overdueResult.rows[0].overdue_books,
  });
};
module.exports = {getDashboardStats};
