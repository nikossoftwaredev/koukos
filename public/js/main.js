// Put your client side JS code here
let fetchTimeout;
const fetchBooks = (search) => {
  const hint = document.getElementById("hint");
  hint.innerHTML = "Fetching...";
  hint.style.display = "block";
  clearTimeout(fetchTimeout);
  fetchTimeout = setTimeout(() => {
    getFavoriteIDS();
    fetch(`https://reststop.randomhouse.com/resources/works?search=${search}`)
      .then((response) => response.text())
      .then((data) => {
        hint.innerHTML = "";
        hint.style.display = "none";
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        parseXML(xml);
      })
      .catch(console.error);
  }, 500);
};

const parseXML = (xml) => {
  let i = 0;
  const table = document.getElementById("table-book-data");
  table.innerHTML = "";

  const x = xml.getElementsByTagName("work");

  const idTh = document.createElement("th");
  const titleTh = document.createElement("th");
  const authorTh = document.createElement("th");
  const subtitleTh = document.createElement("th");
  const actionTh = document.createElement("th");

  const thead = document.createElement("thead");

  idTh.innerHTML = "Id";
  titleTh.innerHTML = "Title";
  authorTh.innerHTML = "Author";
  subtitleTh.innerHTML = "Subtitle";
  actionTh.innerHTML = "Action";

  thead.appendChild(idTh);
  thead.appendChild(titleTh);
  thead.appendChild(authorTh);
  thead.appendChild(subtitleTh);
  thead.appendChild(actionTh);

  table.appendChild(thead);

  for (i = 0; i < x.length; i++) {
    const myTr = document.createElement("tr");

    //TDS
    const workIdTd = document.createElement("td");
    const authorwebTd = document.createElement("td");
    const titlewebTd = document.createElement("td");
    const titleSubtitleAuthTd = document.createElement("td");
    const favoriteButtonTd = document.createElement("td");

    const workId =
      x[i].getElementsByTagName("workid")[0].childNodes[0].nodeValue;

    let isFavorite = FavoriteIDS.includes(workId);

    workIdTd.innerHTML = workId;

    authorwebTd.innerHTML =
      x[i].getElementsByTagName("authorweb")[0].childNodes[0].nodeValue;

    titlewebTd.innerHTML =
      x[i].getElementsByTagName("titleweb")[0].childNodes[0].nodeValue;

    titleSubtitleAuthTd.innerHTML =
      x[i].getElementsByTagName("titleSubtitleAuth")[0].childNodes[0].nodeValue;

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "btn btn-outline-primary";

    favoriteButton.addEventListener("click", () => {
      const notFavor = favoriteButton.innerHTML === "Add to favorites";

      notFavor
        ? setFavoriteBook(
            workIdTd.innerHTML,
            titlewebTd.innerHTML,
            authorwebTd.innerHTML
          )
        : deleteFavoriteBook(workIdTd.innerHTML);

      favoriteButton.innerHTML = notFavor
        ? "Remove from favorites"
        : "Add to favorites";

      favoriteButton.className = notFavor
        ? "btn btn-outline-danger"
        : "btn btn-outline-primary";
    });

    favoriteButton.innerHTML = isFavorite
      ? "Remove from favorites"
      : "Add to favorites";

    favoriteButton.className = isFavorite
      ? "btn btn-outline-danger"
      : "btn btn-outline-primary";

    favoriteButtonTd.appendChild(favoriteButton);

    myTr.appendChild(workIdTd);
    myTr.appendChild(authorwebTd);
    myTr.appendChild(titlewebTd);
    myTr.appendChild(titleSubtitleAuthTd);
    myTr.appendChild(favoriteButtonTd);

    table.appendChild(myTr);
  }
};
