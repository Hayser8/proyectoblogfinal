// auth.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./connection.js";

const loginUser = async (username, password) => {
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.query(
      "SELECT * FROM admin_users WHERE username = ?",
      [username]
    );
    conn.release();
    if (users.length === 0) return null;

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) return null;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.is_admin === 1, 
      },
      "YOUR_SECRET_KEY",
      {
        expiresIn: "24h",
      }
    );
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const registerUser = async (username, password, isAdmin = true) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO admin_users (username, hashed_password, is_admin) VALUES (?, ?, ?)",
      [username, hashedPassword, isAdmin ? 1 : 0] 
    );
    conn.release();

    const token = jwt.sign(
      {
        id: result.insertId,
        isAdmin: isAdmin, 
      },
      "YOUR_SECRET_KEY",
      {
        expiresIn: "24h",
      }
    );
    return { message: "Usuario registrado con éxito", token };
  } catch (error) {
    conn.release();
    console.error(error);
    return null;
  }
};

export { loginUser, registerUser };
