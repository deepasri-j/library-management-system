const pool = require("../db");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1 AND password = $2",
      [email, password],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.log("error");
    res.status(500).json({
      message: "something went wrong",
    });
  }
};
module.exports = { login };
