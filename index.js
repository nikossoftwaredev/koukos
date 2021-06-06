const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const port = 8080;

app.listen(port);

/* 
    Serve static content from directory "public",
    it will be accessible under path /static, 
    e.g. http://localhost:8080/static/index.html
*/
app.use("/static", express.static(__dirname + "/public"));

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }));

// parse application/json content from body
app.use(express.json());

// serve index.html as content root
app.get("/", (req, res) => {
  res.sendFile(
    "index.html",
    {
      root: path.join(__dirname, "public"),
    },
    (err) => {
      console.log(err);
    }
  );
});

// id title author
// Should put the into a database
const favoriteBooks = {};

app.post("/favoriteBook", (req, res) => {
  const { title, author, id } = req.body;

  if (favoriteBooks[id]) {
    res.send({ message: "Book is already favorite" });
  }

  favoriteBooks[id] = { title, author };

  res.send({ title });
});

app.get("/favoriteBook", (req, res) => {
  res.send(favoriteBooks);
});

app.delete("/favoriteBook/:id", (req, res) => {
  const { id } = req.params;
  favoriteBooks[id] = undefined;

  res.send(favoriteBooks);
});
