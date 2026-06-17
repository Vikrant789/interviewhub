const { sql, config } = require("../config/db");

exports.getAll = async (req, res) => {
  await sql.connect(config);

  const result = await sql.query(`
    SELECT ja.*, u.FullName, c.Name AS CompanyName
    FROM JobApplications ja
    LEFT JOIN Users u ON ja.UserId = u.Id
    LEFT JOIN Companies c ON ja.CompanyId = c.Id
  `);

  res.json(result.recordset);
};

exports.create = async (req, res) => {
  const { UserId, CompanyId, JobTitle, JobUrl, Status, Notes } = req.body;

  await sql.connect(config);

  await sql.query`
    INSERT INTO JobApplications (UserId, CompanyId, JobTitle, JobUrl, Status, Notes)
    VALUES (${UserId}, ${CompanyId}, ${JobTitle}, ${JobUrl}, ${Status}, ${Notes})
  `;

  res.send("Application created");
};

exports.update = async (req, res) => {
  try {
    const { Status } = req.body;
    const { id } = req.params;

    console.log("Updating:", { id, Status });

    const result = await sql.query`
      UPDATE JobApplications
      SET Status = ${Status}
      WHERE Id = ${id}
    `;

    console.log("Rows affected:", result.rowsAffected);

    res.json({
      success: true,
      rowsAffected: result.rowsAffected
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};