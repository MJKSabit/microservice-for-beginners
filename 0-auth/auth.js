const express = require("express");
const app = express();

app.get("/validate", (req, res) => {
  const authheader = req.headers.authorization;

  if (!authheader) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.sendStatus(401);
  }

  const [user, pass] = new Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (pass !== "password") {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.sendStatus(401);
  }

  res.setHeader("User", user);
  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log("Server is Running ");
});
