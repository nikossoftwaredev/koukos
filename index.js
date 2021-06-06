const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const { Console } = require("console");
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

app.get("/favorites", (req, res) => {
  res.sendFile(
    "favorites.html",
    {
      root: path.join(__dirname, "public"),
    },
    (err) => {
      console.log(err);
    }
  );
});

app.get("/bookForm", (req, res) => {
  res.sendFile(
    "bookForm.html",
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
  } else {
    favoriteBooks[id] = { title, author, id };
    res.send({ title, author, id });
  }
});

app.get("/favoriteBook", (req, res) => {
  const filter = req.query.filter;

  if (filter) {
    let filteredBooks = {};
    Object.values(favoriteBooks).forEach((book) => {
      if (
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase())
      ) {
        filteredBooks = { ...filteredBooks, book };
      }
    });

    res.send(filteredBooks);
  } else {
    res.send(favoriteBooks);
  }
});

app.get("/favoriteBook/:id", (req, res) => {
  const { id } = req.params;

  res.send(favoriteBooks[id]);
});

app.delete("/favoriteBook/:id", (req, res) => {
  const { id } = req.params;
  favoriteBooks[id] = undefined;

  res.send(favoriteBooks);
});

app.put("/favoriteBook/:id", (req, res) => {
  const { id } = req.params;

  console.log(req.body);
  favoriteBooks[id] = { ...favoriteBooks[id], ...req.body };

  res.send(favoriteBooks);
});
