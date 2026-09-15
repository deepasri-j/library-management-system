const pool = require("../db");
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await pool.query(
      `SELECT id FROM admins WHERE reset_token = $1 AND reset_token_expiry > NOW()`,
      [token],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }
    await pool.query(
      `UPDATE admins SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2`,
      [newPassword, result.rows[0].id],
    );
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = { resetPassword };
