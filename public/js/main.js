// Put your client side JS code here

const fetchBooks = () => {
  const search = document.getElementById("search").value;

  fetch(`https://reststop.randomhouse.com/resources/works?search=${search}`)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      console.log(xml);
      myFunction(xml);
    })
    .catch(console.error);
};

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

const deleteFavoriteBook = (id) => {
  fetch(`http://localhost:8080/favoriteBook/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const myFunction = (xml) => {
  let i = 0;

  const x = xml.getElementsByTagName("work");

  for (i = 0; i < x.length; i++) {
    const myTr = document.createElement("tr");

    //TDS
    const workIdTd = document.createElement("td");
    const authorwebTd = document.createElement("td");
    const titlewebTd = document.createElement("td");
    const titleSubtitleAuthTd = document.createElement("td");
    const favoriteButtonTd = document.createElement("td");
    const deleteButtonTd = document.createElement("td");

    workIdTd.innerHTML =
      x[i].getElementsByTagName("workid")[0].childNodes[0].nodeValue;

    authorwebTd.innerHTML =
      x[i].getElementsByTagName("authorweb")[0].childNodes[0].nodeValue;

    titlewebTd.innerHTML =
      x[i].getElementsByTagName("titleweb")[0].childNodes[0].nodeValue;

    titleSubtitleAuthTd.innerHTML =
      x[i].getElementsByTagName("titleSubtitleAuth")[0].childNodes[0].nodeValue;

    const favoriteButton = document.createElement("button");

    favoriteButton.addEventListener("click", () => {
      setFavoriteBook(
        workIdTd.innerHTML,
        titlewebTd.innerHTML,
        authorwebTd.innerHTML
      );
    });

    favoriteButton.innerHTML = "Favorite Book";

    const deleteButton = document.createElement("button");

    deleteButton.addEventListener("click", () => {
      deleteFavoriteBook(workIdTd.innerHTML);
    });

    deleteButton.innerHTML = "Delete Book";

    favoriteButtonTd.appendChild(favoriteButton);
    deleteButtonTd.appendChild(deleteButton);

    myTr.appendChild(workIdTd);
    myTr.appendChild(authorwebTd);
    myTr.appendChild(titlewebTd);
    myTr.appendChild(titleSubtitleAuthTd);
    myTr.appendChild(favoriteButtonTd);
    myTr.appendChild(deleteButtonTd);

    document.getElementById("demo").appendChild(myTr);
  }
};
