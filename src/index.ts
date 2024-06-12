import express from "express";
import { getWebserverPort } from "./config/environmentVariables";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = getWebserverPort();
app.listen(port, () => {
  console.log("Server is running on port", port);
});
