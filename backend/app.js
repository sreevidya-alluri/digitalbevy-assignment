const express = require("express");
const app = express();

app.use(express.json()); // for parsing JSON bodies

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

module.exports = app;
