//Dashboard stats
const totalbooks = document.querySelector("#total");
const availablebooks = document.querySelector("#available");
const issuedbooks = document.querySelector("#issued");
const overduebooks = document.querySelector("#overdue");

//Add book form
const author = document.querySelector("#author");
const publisher = document.querySelector("#publisher");
const category = document.querySelector("#category");

const bookTitle = document.querySelector("#bookTitle");
const isbn = document.querySelector("#isbn");
const quantity = document.querySelector("#quantity");
const year = document.querySelector("#year");
const shelfLocation = document.querySelector("#location");

const saveBookBtn = document.querySelector("#saveBookBtn");

//Add Book Modal
const openBookModalBtn = document.querySelector("#openBookModalBtn");
function openModal() {
  document.getElementById("addBookModal").style.display = "block";
}
function closeModal() {
  document.getElementById("addBookModal").style.display = "none";
}
openBookModalBtn.addEventListener("click", function () {
  document.getElementById("modalTitle").textContent = "Add New Book";
  saveBookBtn.textContent = "Add Book";
  bookTitle.value = "";
  isbn.value = "";
  author.value = "";
  publisher.value = "";
  category.value = "";
  quantity.value = "";
  year.value = "";
  shelfLocation.value = "";
  openModal();
});

//isbn format
isbn.addEventListener("input", function () {
  let value = isbn.value.replace(/\D/g, "");
  value = value.slice(0, 12);
  if (value.length > 8) {
    value = value.slice(0, 4) + "-" + value.slice(4, 8) + "-" + value.slice(8);
  } else if (value.length > 4) {
    value = value.slice(0, 4) + "-" + value.slice(4);
  }
  isbn.value = value;
});

//Add book
saveBookBtn.addEventListener("click", async function () {
  const isbnDigits = isbn.value.replace(/-/g, "");
  if (!/^\d{12}$/.test(isbnDigits)) {
    alert("ISBN must contain exactly 12 digits");
    return;
  }
  const bookData = {
    title: bookTitle.value,
    isbn: isbn.value,
    author_id: author.value,
    publisher_id: publisher.value,
    category_id: category.value,
    published_year: year.value,
    total_copies: quantity.value,
    shelf_location: shelfLocation.value,
  };
  let response;

  if (editingBookId === null) {
    response = await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  } else {
    response = await fetch(`http://localhost:3000/books/${editingBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  }

  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    closeModal();
    loadBooks();
    editingBookId = null;
  } else {
    alert(data.message);
  }
});

//load dashboard stats
async function loadDashboardStats() {
  const response = await fetch("http://localhost:3000/stats");
  const data = await response.json();
  totalbooks.textContent = data.totalbooks;
  availablebooks.textContent = data.availablebooks;
  issuedbooks.textContent = data.issuedbooks;
  overduebooks.textContent = data.overdue;
}
loadDashboardStats();

//display books
function renderbooks(books) {
  tbody.innerHTML = "";
  books.forEach(function (book, index) {
    const row = document.createElement("tr");
    const status = book.available_copies === 0 ? "Out of Stock" : "Available";
    row.innerHTML = `<td> ${index + 1} </td>
                      <td> ${book.title}</td>
                      <td> ${book.author_name}</td>
                      <td>${book.isbn}</td>
                      <td>${book.category_name}</td>
                      <td>${status}</td>
                      <td>${book.available_copies}</td>
                      <td>
                      <button class = "btn btn-warning btn-sm edit-btn" data-id = "${book.id}">Edit</button>
                      <button class = "btn btn-danger btn-sm delete-btn" data-id = "${book.id}" > Delete </button>
                      </td>`;
    tbody.appendChild(row);
  });
}

//editbookupdate
let editingBookId = null;

//edit books
const tbody = document.querySelector(".book-body");
tbody.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    const bookId = event.target.dataset.id;
    editBook(bookId);
  } else if (event.target.classList.contains("delete-btn")) {
    const bookId = event.target.dataset.id;
    deletebook(bookId);
  }
});
async function editBook(bookId) {
  editingBookId = bookId;
  const response = await fetch(`http://localhost:3000/books/${bookId}`);
  const data = await response.json();
  console.log(data);
  bookTitle.value = data.title;
  isbn.value = data.isbn;
  author.value = data.author_id;
  publisher.value = data.publisher_id;
  category.value = data.category_id;
  quantity.value = data.total_copies;
  year.value = data.published_year;
  shelfLocation.value = data.shelf_location;
  console.log("author :", data.author_id);
  console.log("publsiher: ", data.publisher_id);
  console.log("category: ", data.category_id);

  openModal();

  document.getElementById("modalTitle").textContent = "Edit Book";
  saveBookBtn.textContent = "Update Book";
}

//delete books
let deletebookId = null;
function deletebook(bookId) {
  deletebookId = bookId;
  document.getElementById("deleteModal").style.display = "block";
  console.log("Selected book ID:", deletebookId);
}

const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
cancelDeleteBtn.addEventListener("click", function () {
  document.getElementById("deleteModal").style.display = "none";
});

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
confirmDeleteBtn.addEventListener("click", async function () {
  const response = await fetch(`http://localhost:3000/books/${deletebookId}`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    document.getElementById("deleteModal").style.display = "none";
    loadBooks();
    loadDashboardStats();
    deletebookId = null;
  } else {
    alert(data.message);
  }
});

//load books
async function loadBooks() {
  const response = await fetch("http://localhost:3000/books");
  const books = await response.json();
  renderbooks(books);
}
loadBooks();

//load authors
author.addEventListener("change", function () {
  if (author.value === "add-new") {
    document.getElementById("authorModal").style.display = "block";
    console.log("Add New Author selected");
  }
});

const cancelAuthorBtn = document.getElementById("cancelAuthorBtn");
cancelAuthorBtn.addEventListener("click", function () {
  console.log("cancel author clicked");
  document.getElementById("authorModal").style.display = "none";
});
const saveAuthorBtn = document.getElementById("saveAuthorBtn");
const newAuthorName = document.getElementById("newAuthorName");
saveAuthorBtn.addEventListener("click", async function () {
  const authorName = newAuthorName.value.trim();
  if (authorName === "") {
    alert("Please enter author name");
    return;
  }
  const response = await fetch("http://localhost:3000/authors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ author_name: authorName }),
  });
  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    document.getElementById("authorModal").style.display = "none";
    newAuthorName.value = "";
    loadauthors();
  } else {
    alert(data.message);
  }
});

async function loadauthors() {
  const response = await fetch("http://localhost:3000/authors");
  const authors = await response.json();
  author
    .querySelectorAll("option:not([value = '']):not([value = 'add-new'])")
    .forEach(function (option) {
      option.remove();
    });

  authors.forEach(function (authorData) {
    const option = document.createElement("option");
    option.value = authorData.id;
    option.textContent = authorData.author_name;
    author.appendChild(option);
  });
}
loadauthors();

//load publishers
publisher.addEventListener("change", function () {
  if (publisher.value === "add-new") {
    document.getElementById("publisherModal").style.display = "block";
    console.log("Add New Publisher Selected");
  }
});
const cancelPublisherBtn = document.getElementById("cancelPublisherBtn");
cancelPublisherBtn.addEventListener("click", function () {
  console.log("cancel publisher clicked");
  document.getElementById("publisherModal").style.display = "none";
});
const savePublisherBtn = document.getElementById("savePublisherBtn");
const newPublisherName = document.getElementById("newPublisherName");

savePublisherBtn.addEventListener("click", async function () {
  const publisherName = newPublisherName.value.trim();
  if (publisherName === "") {
    alert("Please enter publisher name");
    return;
  }
  const response = await fetch("http://localhost:3000/publishers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publisher_name: publisherName }),
  });
  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    document.getElementById("publisherModal").style.display = "none";
    newPublisherName.value = "";
    loadpublishers();
  } else {
    alert(data.message);
  }
});

async function loadpublishers() {
  const response = await fetch("http://localhost:3000/publishers");
  const publishers = await response.json();
  publisher
    .querySelectorAll("option:not([value = '']):not([value = 'add-new'])")
    .forEach(function (option) {
      option.remove();
    });
  publishers.forEach(function (publisherData) {
    const option = document.createElement("option");
    option.value = publisherData.id;
    option.textContent = publisherData.publisher_name;
    publisher.appendChild(option);
  });
}
loadpublishers();

//load categories
async function loadcategories() {
  const response = await fetch("http://localhost:3000/categories");
  const categories = await response.json();

  category
    .querySelectorAll("option:not([value='']):not([value = 'add-new'])")
    .forEach(function (option) {
      option.remove();
    });
  categories.forEach(function (categoryData) {
    const option = document.createElement("option");
    option.value = categoryData.id;
    option.textContent = categoryData.category_name;
    category.appendChild(option);
  });
}
loadcategories();

category.addEventListener("change", function () {
  if (category.value === "add-new") {
    document.getElementById("categoryModal").style.display = "block";
    console.log("Add new category Selected");
  }
});
const cancelCategoryBtn = document.getElementById("cancelCategoryBtn");
cancelCategoryBtn.addEventListener("click", function () {
  console.log("cancel Category clicked");
  document.getElementById(cancelCategoryBtn).style.display = "none";
});

const saveCategoryBtn = document.getElementById("saveCategoryBtn");
const newCategoryName = document.getElementById("newCategoryName");

saveCategoryBtn.addEventListener("click", async function () {
  const categoryName = newCategoryName.value.trim();
  if (categoryName === "") {
    alert("Please Enter Category Name");
    return;
  }
  const response = await fetch("http://localhost:3000/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category_name: categoryName }),
  });
  const data = await response.json();
  if (response.ok) {
    alert(data.message);
    document.getElementById("categoryModal").style.display = "none";
    newCategoryName.value = "";
    loadcategories();
  } else {
    alert(data.message);
  }
});

//Issue book
const memberId = document.getElementById("mem-id");
const bookISBN = document.getElementById("book-isbn");
const issuedate = document.getElementById("issue-date");
const duedate = document.getElementById("due-date");
const issuebtn = document.getElementById("issuebookbtn");
const successmsg = document.getElementById("successmessage");
bookISBN.addEventListener("input", function () {
  let value = bookISBN.value.replace(/\D/g, "");

  value = value.slice(0, 12);

  if (value.length > 8) {
    value = value.slice(0, 4) + "-" + value.slice(4, 8) + "-" + value.slice(8);
  } else if (value.length > 4) {
    value = value.slice(0, 4) + "-" + value.slice(4);
  }

  bookISBN.value = value;
});

issuebtn.addEventListener("click", async function (e) {
  e.preventDefault();
  const issueData = {
    member_id: memberId.value,
    book_isbn: bookISBN.value,
    issued_date: issuedate.value,
    due_date: duedate.value,
  };

  const response = await fetch("http://localhost:3000/issued-books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issueData),
  });
  const data = await response.json();
  if (response.ok) {
    successmsg.textContent = data.message;
    successmsg.style.color = "green";
    ((memberId.value = ""),
      (bookISBN.value = ""),
      (issuedate.value = ""),
      (duedate.value = ""));
    loadBooks();
    loadDashboardStats();
    setTimeout(() => {
      successmsg.textContent = "";
    }, 1000);
  } else {
    successmsg.textContent = data.message;
    successmsg.style.color = "red";
  }
});

//return books
const member_id = document.getElementById("return-id");
const book_isbn = document.getElementById("return-Isbn");
const return_date = document.getElementById("return-date");
const fine_amount = document.getElementById("fine-amt");
const returnmessage = document.getElementById("Returnmessage");
const returnbtn = document.querySelector(".btn.btn-return");

book_isbn.addEventListener("input", function () {
  let value = book_isbn.value.replace(/\D/g, "");

  value = value.slice(0, 12);

  if (value.length > 8) {
    value = value.slice(0, 4) + "-" + value.slice(4, 8) + "-" + value.slice(8);
  } else if (value.length > 4) {
    value = value.slice(0, 4) + "-" + value.slice(4);
  }

  book_isbn.value = value;
});

returnbtn.addEventListener("click", async function (e) {
  e.preventDefault();
  const returnData = {
    member_id: member_id.value,
    book_isbn: book_isbn.value,
    return_date: return_date.value,
  };
  const response = await fetch("http://localhost:3000/returned-books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(returnData),
  });
  const data = await response.json();
  if (response.ok) {
    returnmessage.textContent = data.message;
    returnmessage.style.color = "green";
    ((fine_amount.value = data.fineAmount),
      (member_id.value = ""),
      (book_isbn.value = ""),
      (return_date.value = ""));

    loadBooks();
    loadDashboardStats();
    setTimeout(() => {
      returnmessage.textContent = "";
      fine_amount.value = "";
    }, 2000);
  } else {
    returnmessage.textContent = data.message;
    returnmessage.style.color = "red";
    setTimeout(() => {
      returnmessage.textContent = "";
      ((member_id.value = ""),
        (book_isbn.value = ""),
        (return_date.value = ""));
    }, 2000);
  }
});

if (window.location.hash === "#issue-return") {
  setTimeout(() => {
    document.getElementById("issue-return").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 300);
}
