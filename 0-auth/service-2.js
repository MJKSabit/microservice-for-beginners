const express = require("express");
const app = express();

// get from os env
const SERVICE_1 = process.env.SERVICE_1 || "http://localhost:3000";

app.get("/echo", (req, res) => {
  const headers = req.headers;
  fetch(SERVICE_1 + "/hello", {
    headers,
  })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      res.send(`[${text}]`);
    })
    .catch((err) => {
      res.send("Error in fetching data from service 1");
    });
});

app.listen(3001, () => {
  console.log("Server is Running ");
});
