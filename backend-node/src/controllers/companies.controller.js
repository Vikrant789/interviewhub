const { sql, config } = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM Companies");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.create = async (req, res) => {
  const { Name, Website, Location } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Companies (Name, Website, Location)
      VALUES (${Name}, ${Website}, ${Location})
    `;
    res.send("Company created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT * FROM Companies WHERE Id = ${req.params.id}
    `;
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  const { Name, Location } = req.body;

  try {
    await sql.query`
      UPDATE Companies
      SET Name = ${Name}, Location = ${Location}
      WHERE Id = ${req.params.id}
    `;
    res.send("Updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.delete = async (req, res) => {
  await sql.query`
    DELETE FROM Companies WHERE Id = ${req.params.id}
  `;
  res.send("Deleted");
};