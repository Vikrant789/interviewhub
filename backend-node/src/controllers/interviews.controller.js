const { sql, config } = require("../config/db");

exports.getAll = async (req, res) => {
  await sql.connect(config);

  const result = await sql.query(`
    SELECT i.*, ja.JobTitle
    FROM Interviews i
    JOIN JobApplications ja ON i.JobApplicationId = ja.Id
  `);

  res.json(result.recordset);
};

exports.create = async (req, res) => {
  const { JobApplicationId, RoundName, InterviewDate, Mode } = req.body;

  await sql.connect(config);

  await sql.query`
    INSERT INTO Interviews (JobApplicationId, RoundName, InterviewDate, Mode)
    VALUES (${JobApplicationId}, ${RoundName}, ${InterviewDate}, ${Mode})
  `;

  res.send("Interview scheduled");
};