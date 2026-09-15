const pool = require("../db");
const crypto = require("crypto");
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query("SELECT id FROM admins WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Email not found!",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query(
      "UPDATE admins SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
      [resetToken, resetTokenExpiry, result.rows[0].id],
    );
    res.status(200).json({
      message: "Reset link generated successfully",
      resetToken: resetToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = { forgotpassword };
