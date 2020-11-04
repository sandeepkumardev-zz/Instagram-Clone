const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURL } = require("./config/keys");

const port = process.env.PORT || 3001;

// Database connection with mongoose
mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("database connected !");
});

mongoose.connection.on("error", (err) => {
  console.log("error :> ", err);
});
//..................................

require("./models/user");
require("./models/post");

// authentication method
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log("server running succesfully !");
});
