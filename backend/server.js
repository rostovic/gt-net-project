const express = require("express");
const app = express();
const port = 3000;

const routes = require("./routes");

app.use(express.json());

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

app.use("/users", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
