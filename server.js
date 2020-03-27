const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();
const PORT = process.env.PORT || 5000;
//Init Middileware
app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/user"));
app.use("/api/register", require("./routes/api/register"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => console.log(`Server started in ${PORT}`));
app.get("/", (req, res) => res.send("SERVER RUNNING"));
