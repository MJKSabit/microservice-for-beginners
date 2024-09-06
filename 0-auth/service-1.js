const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  const user = req.headers.user;
  if (user === "admin") {
    return res.send(`Hello, ${user}!`);
  } else {
    return res.send(`Welcome, ${user}!`);
  }
});

app.listen(3000, () => {
  console.log("Server is Running ");
});
