const express = require("express");
const crypto = require("crypto");
const app = express();
const fs = require("fs");
const path = require("path");
const port = 3000;
const dbPath = path.join(__dirname, "db.json");

app.use(express.json());

const readDatabase = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
};

const isEmpty = (prop) => {
  if (prop.length === 0) return true;
  return false;
};

const insertUser = (newUser) => {
  if (
    isEmpty(newUser.first_name) ||
    isEmpty(newUser.last_name) ||
    isEmpty(newUser.email) ||
    isEmpty(newUser.telephone)
  ) {
    return { message: "error" };
  }
  const db = readDatabase();
  const newId = crypto.randomUUID();
  const userWithIdFirst = { id: newId, ...newUser };

  db.users.push(userWithIdFirst);
  writeDatabase(db);
  return { message: "success" };
};

const deleteUserById = (userId) => {
  const db = readDatabase();
  const userIndex = db.users.findIndex((user) => user.id == userId);

  if (userIndex !== -1) {
    db.users.splice(userIndex, 1);
    writeDatabase(db);
    return true;
  }
  return false;
};

const updateUserById = (userId, updatedData) => {
  const db = readDatabase();
  const userIndex = db.users.findIndex((user) => user.id == userId);

  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...updatedData };
    writeDatabase(db);
    return true;
  }
  return false;
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.get("/users", (req, res) => {
  const db = readDatabase();
  return res.status(200).json(db.users);
});

app.post("/users", (req, res) => {
  const response = insertUser(req.body);
  if ((response.message = "success")) {
    return res.status(200).json({ message: "New user added!." });
  }
  return res
    .status(400)
    .json({ error: "Bad request.", message: "Something went wrong!" });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const updatedUser = updateUserById(id, updatedData);

  if (updatedUser) {
    return res.status(200).json({ message: "User updated successfully." });
  } else {
    return res.status(404).json({ error: "User not found." });
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const deletedUser = deleteUserById(id);
  if (deletedUser) {
    return res.status(200).json({ message: "User deleted successfully." });
  }
  return res
    .status(400)
    .json({ error: "Bad request.", message: "User does not exist!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
