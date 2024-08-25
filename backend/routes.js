const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const { readDatabase, writeDatabase } = require("./database");

const getUsers = (req, res) => {
  const db = readDatabase();
  res.status(200).json(db.users);
};

const createUser = (req, res) => {
  const newUser = req.body;

  if (
    !newUser.first_name ||
    !newUser.last_name ||
    !newUser.email ||
    !newUser.telephone
  ) {
    return res.status(400).json({ message: "error" });
  }

  const db = readDatabase();
  const newId = crypto.randomUUID();
  const userWithId = { id: newId, ...newUser };

  db.users.push(userWithId);
  writeDatabase(db);
  res.status(200).json({ message: "New user added!" });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const db = readDatabase();
  const userIndex = db.users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...updatedData };
    writeDatabase(db);
    return res.status(200).json({ message: "User updated successfully." });
  }
  res.status(404).json({ message: "User not found." });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const userIndex = db.users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    db.users.splice(userIndex, 1);
    writeDatabase(db);
    return res.status(200).json({ message: "User deleted successfully." });
  }
  res.status(400).json({ message: "User does not exist!" });
};

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
