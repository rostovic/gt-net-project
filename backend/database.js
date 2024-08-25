const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "db.json");

const readDatabase = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
};

module.exports = { readDatabase, writeDatabase };
