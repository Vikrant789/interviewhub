const { sql, config } = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createUser = async (req, res) => {
  const { FullName, Email, PasswordHash, Phone } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Users (FullName, Email, PasswordHash, Phone)
      VALUES (${FullName}, ${Email}, ${PasswordHash}, ${Phone})
    `;
    res.send("User created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM Users WHERE Id = ${req.params.id}
    `;
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  const { FullName, Phone } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      UPDATE Users
      SET FullName = ${FullName}, Phone = ${Phone}
      WHERE Id = ${req.params.id}
    `;
    res.send("User updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await sql.connect(config);
    await sql.query`
      DELETE FROM Users WHERE Id = ${req.params.id}
    `;
    res.send("User deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};