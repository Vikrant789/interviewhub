const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, config } = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async ({ FullName, Email, Password, Phone }) => {
  await sql.connect(config);

  const hash = await bcrypt.hash(Password, 10);

  await sql.query`
    INSERT INTO Users (FullName, Email, PasswordHash, Phone)
    VALUES (${FullName}, ${Email}, ${hash}, ${Phone})
  `;

  return { message: "User registered successfully" };
};

exports.login = async ({ Email, Password }) => {
  await sql.connect(config);

  const result = await sql.query`
    SELECT TOP 1 * FROM Users WHERE Email = ${Email}
  `;

  const user = result.recordset[0];

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(Password, user.PasswordHash);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      id: user.Id,
      email: user.Email,
      role: user.Role
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    token,
    user: {
      id: user.Id,
      name: user.FullName,
      email: user.Email,
      role: user.Role
    }
  };
};