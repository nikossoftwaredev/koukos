const getBookInfo = () => {
  const params = new URL(document.location).searchParams;
  const id = params.get("id");
  if (id) {
    getFavoriteBooks(id).then((data) => {
      const title = document.getElementById("book-title");
      title.value = data.title;

      const author = document.getElementById("book-author");
      author.value = data.author;

      const editButton = document.getElementById("edit-book");
      editButton.addEventListener("click", (e) => {
        e.preventDefault();
        return editFavoriteBook(id, {
          title: document.getElementById("book-title").value,
          author: document.getElementById("book-author").value,
        }).then(() => window.location.replace("/favorites"));
      });
    });
  }
};

window.onload = () => {
  getBookInfo();
};
