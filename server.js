const express = require("express");
const mongoose = require("mongoose");

const auth = require("./routes/api/user-auth");
const profile = require("./routes/api/user-profile");
const posts = require("./routes/api/posts");

const app = express();
// database config
const db = require("./config/keys").mongoURI;
// connect to database
mongoose
  .connect(db)
  .then(() => console.log("Mongo DB Connection Success"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello there"));

// use routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
