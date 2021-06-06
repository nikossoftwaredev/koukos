const setFavoriteBook = (id, title, author) => {
  fetch("http://localhost:8080/favoriteBook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title, author }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const editFavoriteBook = (id, data) =>
  new Promise((resolve, reject) => {
    fetch(`http://localhost:8080/favoriteBook/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

const deleteFavoriteBook = (id, reload) => {
  fetch(`http://localhost:8080/favoriteBook/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      if (reload) window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getFavoriteBooks = (id) =>
  new Promise((resolve, reject) => {
    fetch(
      id
        ? `http://localhost:8080/favoriteBook/${id}`
        : "http://localhost:8080/favoriteBook",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

let debounceTimer;
const debounceFilter = (search) => {
  const hint = document.getElementById("hint-2");
  hint.innerHTML = "Filtering...";
  hint.style.display = "block";
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    hint.innerHTML = "";
    hint.style.display = "none";
    return filterFavoriteBooks(search);
  }, 500);
};
const filterFavoriteBooks = (search) => {
  fetch(`http://localhost:8080/favoriteBook?filter=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      populateFavoriteBooks(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

let FavoriteIDS = [];
let FavoriteBooks = [];

const populateFavoriteBooks = (data) => {
  FavoriteBooks = Object.values(data);
  // compile the template

  const tableBody = document.getElementById("favorites-tableBody");
  if (tableBody) {
    tableBody.innerHTML = "";

    FavoriteBooks.forEach((book) => {
      const template = Handlebars.compile(
        "<td>{{id}}</td><td>{{title}}</td><td>{{author}}</td><td><a href='/bookForm?id={{id}}'><button type='button' class='btn btn-outline-warning' >Edit Favorite</button></a><button style='margin-left: 16px' class='btn btn-outline-danger' onclick='deleteFavoriteBook({{id}}, true)'>Remove from Favorites</button></td>"
      );
      const row = document.createElement("tr");
      row.innerHTML = template(book);
      tableBody.appendChild(row);
    });
  }
  // execute the compiled template and print the output to the console
};

getFavoriteBooks().then((data) => populateFavoriteBooks(data));

const getFavoriteIDS = () =>
  getFavoriteBooks().then((data) => {
    FavoriteIDS = Object.keys(data);
  });
// execute the compiled template and print the output to the console
