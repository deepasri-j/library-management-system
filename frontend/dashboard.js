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

//Add book
saveBookBtn.addEventListener("click", async function () {
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
                      <td>${book.total_copies}</td>
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
  author.querySelectorAll("option:not([value = '']):not([value = 'add-new'])").forEach(function(option){
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
  categories.forEach(function (categoryData) {
    const option = document.createElement("option");
    option.value = categoryData.id;
    option.textContent = categoryData.category_name;
    category.appendChild(option);
  });
}
loadcategories();

/*

const btnaddbook = document.querySelector(".btn.btn-primary");
const btnclearbook = document.querySelector(".btn.btn-secondary");
const btnreturnbook = document.querySelector(".btn.btn-return");
const returnMemberId = document.querySelector("#return-id");
const returnisbn = document.querySelector("#return-Isbn");
const returndate = document.querySelector("#return-date");
const fineamt = document.querySelector("#fine-amt");
const memberId = document.querySelector("#mem-id");
const bookISBN = document.querySelector("#book-isbn");
const issuedate = document.querySelector("#issue-date");
const duedate = document.querySelector("#due-date");
const successmsg = document.querySelector("#successmessage");
const Returnmsg = document.querySelector("#Returnmessage");
const displaybooks = document.querySelector(".table-wrapper");
//const stattotalbooks = document.querySelector(".stat-value");
const bookname = document.querySelector("#bookTitle");
const authorname = document.querySelector("#author");
const isbn = document.querySelector("#isbn");
const category = document.querySelector("#category");
const quantity = document.querySelector("#quantity");
const publishedYear = document.querySelector("#year");
const place = document.querySelector("#location");
const publisher = document.querySelector("#publisher");
const tbody = document.querySelector(".book-body");
const issuebtn = document.querySelector("#issuebookbtn");
const totalbooks = document.querySelector("#total");
const availablebooks = document.querySelector("#available");
const sissuedbooks = document.querySelector("#issued");
const overduebooks = document.querySelector("#overdue");
const mem1 = document.querySelector("#mem1");
const mem2 = document.querySelector("#mem2");
const mem3 = document.querySelector("#mem3");
const mem4 = document.querySelector("#mem4");

let booklist = [];
let editIndex = null;

const renderbooks = function (booklist) {
  tbody.innerHTML = "";
  booklist.forEach(function (book, index) {
    const row = document.createElement("tr");
    const categoryClass = book.category
      ? book.category.toLowerCase().replaceAll(" ", "-")
      : "default";
    const status = book.quantity === 0 ? "Out of Stock" : "Available";
    row.innerHTML = `
    <td>${index + 1} </td>
    <td>${book.title} </td>
    <td>${book.author}</td>
    <td>${book.ISBN}</td>
    <td>
      <span class="badge badge-${categoryClass}">
        ${book.category}
      </span>
    </td>
    
    <td>${status}</td>
    <td>${book.quantity}</td>
    <td>
      <div class = "action-btns">
       <button class = "btn btn-warning btn-sm edit-btn"> Edit </button> 
       
       <button class = "btn btn-danger btn-sm delete-btn"> Delete </button>   
      </div>
    </td>
 `;

    tbody.appendChild(row);
    let deleteIndex = null;
    function openDeleteModal(index) {
      deleteIndex = index;
      document.getElementById("deleteModal").style.display = "block";
    }
    function closeDeleteModal() {
      document.getElementById("deleteModal").style.display = "none";
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeModal();
        closeDeleteModal();
      }
    });

    const deletebtn = row.querySelector(".delete-btn");
    deletebtn.addEventListener("click", function () {
      openDeleteModal(index);
    });
    document
      .getElementById("cancelDeleteBtn")
      .addEventListener("click", closeDeleteModal);
    document
      .getElementById("confirmDeleteBtn")
      .addEventListener("click", function () {
        if (deleteIndex !== null) {
          booklist.splice(deleteIndex, 1);
          localStorage.setItem("books", JSON.stringify(booklist));
          renderbooks(booklist);
          updateDashBoard();
          deleteIndex = null;
        }
        closeDeleteModal();
      });

    const editbtn = row.querySelector(".edit-btn");
    editbtn.addEventListener("click", function () {
      console.log(" edit clicked");
      editIndex = index;
      bookname.value = book.title;
      authorname.value = book.author;
      isbn.value = book.ISBN;
      category.value = book.category;
      quantity.value = book.quantity;
      publishedYear.value = book.publishedyear;
      place.value = book.location;
      publisher.value = book.publisher;
      openModal();
      document.querySelector(".btn-primary").innerText = "Update Book";
      document.getElementById("modalTitle").innerText = "Update Book";
    });
  });
};
function openModal() {
  document.getElementById("addBookModal").style.display = "block";
}
function closeModal() {
  document.getElementById("addBookModal").style.display = "none";
}

btnaddbook.addEventListener("click", function (e) {
  e.preventDefault();

  const book = {
    title: bookname.value,
    author: authorname.value,
    ISBN: isbn.value,
    category: category.value,
    quantity: Number(quantity.value),
    publishedyear: publishedYear.value,
    location: place.value,
    publisher: publisher.value,
  };
  if (editIndex !== null) {
    booklist[editIndex] = book;
    editIndex = null;
  } else {
    booklist.push(book);
  }

  localStorage.setItem("books", JSON.stringify(booklist));
  renderbooks(booklist);
  updateDashBoard();

  document.querySelector(".btn-primary").innerText = "Add Book";
  document.getElementById("modalTitle").innerText = "Add New Book";
  closeModal();

  ((bookname.value = ""),
    (authorname.value = ""),
    (isbn.value = ""),
    (category.value = ""),
    (quantity.value = ""),
    (publishedYear.value = ""),
    (place.value = ""),
    (publisher.value = ""));
});

window.onclick = function (event) {
  let modal = document.getElementById("addBookModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

window.addEventListener("load", function () {
  const data = localStorage.getItem("books");
  if (data) booklist = JSON.parse(data);
  renderbooks(booklist);
});

btnclearbook.addEventListener("click", function (e) {
  e.preventDefault();
  ((bookname.value = ""),
    (authorname.value = ""),
    (isbn.value = ""),
    (category.value = ""),
    (quantity.value = ""),
    (publishedYear.value = ""),
    (place.value = ""),
    (publisher.value = ""));
});

//issuebooks
issuebtn.addEventListener("click", function (e) {
  e.preventDefault();

  const findbooks = booklist.find(
    (book) => book.ISBN.trim() === bookISBN.value.trim(),
  );

  if (!findbooks) {
    successmsg.textContent = "Wrong ISBN number!";
    successmsg.style.color = "red";
    setTimeout(() => (successmsg.textContent = ""), 1000);
    return;
  }
  if (findbooks.quantity === 0) {
    successmsg.textContent = "Out of Stock!";
    successmsg.style.color = "red";
    setTimeout(() => (successmsg.textContent = ""), 1000);
    return;
  }
  const issuedbooks = {
    memberID: memberId.value,
    bookISBN: bookISBN.value,
    bookName: findbooks.title,
    issuedate: issuedate.value,
    duedate: duedate.value,
    returnDate: null,
    status: "Not Returned",
  };

  let issuedbooklist = JSON.parse(localStorage.getItem("issuedbooklist")) || [];
  findbooks.quantity -= 1;
  issuedbooklist.push(issuedbooks);
  successmsg.textContent = "Book issued successfully!";
  successmsg.style.color = "green";

  localStorage.setItem("issuedbooklist", JSON.stringify(issuedbooklist));
  localStorage.setItem("books", JSON.stringify(booklist));
  renderbooks(booklist);
  ((memberId.value = ""),
    (bookISBN.value = ""),
    (issuedate.value = ""),
    (duedate.value = ""),
    setTimeout(() => (successmsg.textContent = ""), 1000));
  updateDashBoard();
});

returndate.addEventListener("change", () => {
  const issuedbooklist =
    JSON.parse(localStorage.getItem("issuedbooklist")) || [];

  const findbooks = issuedbooklist.find(
    (book) => book.bookISBN.trim() === returnisbn.value.trim(),
  );

  if (!findbooks) return;

  const returnd = new Date(returndate.value);
  const dued = new Date(findbooks.duedate);

  if (returnd > dued) {
    const diff = returnd - dued;
    const latedays = diff / (1000 * 60 * 60 * 24);
    fineamt.value = Math.floor(latedays * 10);
  } else {
    fineamt.value = 0;
  }
  updateDashBoard();
});

//returnbook
btnreturnbook.addEventListener("click", function () {
  const returnedbooks = {
    rmemberID: returnMemberId.value,
    rbookISBN: returnisbn.value,
    returndate: returndate.value,
    fineamt: fineamt.value,
  };

  let issuedbooklist = JSON.parse(localStorage.getItem("issuedbooklist")) || [];
  const findbooks = issuedbooklist.find(
    (book) =>
      book.bookISBN.trim() === returnedbooks.rbookISBN.trim() &&
      book.memberID === returnedbooks.rmemberID,
  );
  if (!findbooks) {
    Returnmsg.textContent = "Wrong ISBN or Member ID!";
    Returnmsg.style.color = "red";
    setTimeout(() => (Returnmsg.textContent = ""), 1000);
    return;
  }
  const returnd = new Date(returndate.value);
  const dued = new Date(findbooks.duedate);

  let latedays = 0;

  if (returnd > dued) {
    const diff = returnd - dued;
    latedays = diff / (1000 * 60 * 60 * 24);
  }

  findbooks.returnDate = returndate.value;
  findbooks.status = "Returned";

  const checkingquantity = booklist.find(
    (book) => book.ISBN.trim() === returnedbooks.rbookISBN.trim(),
  );
  if (checkingquantity) {
    checkingquantity.quantity += 1;
  }
  let returnbooklist = JSON.parse(localStorage.getItem("returnbooklist")) || [];
  returnbooklist.push(returnedbooks);
  Returnmsg.textContent =
    latedays > 0
      ? `Late by ${Math.floor(latedays)} days. Fine: ₹${fineamt.value}`
      : "No fine. Book returned on time!";
  Returnmsg.style.color = "green";
  localStorage.setItem("issuedbooklist", JSON.stringify(issuedbooklist));
  localStorage.setItem("returnbooklist", JSON.stringify(returnbooklist));
  localStorage.setItem("books", JSON.stringify(booklist));
  renderbooks(booklist);
  ((returnMemberId.value = ""),
    (returnisbn.value = ""),
    (returndate.value = ""),
    (fineamt.value = ""),
    setTimeout(() => (Returnmsg.textContent = ""), 1000));
});

//updateDashBoard
function updateDashBoard() {
  let booklisted = JSON.parse(localStorage.getItem("books")) || [];
  let issuedbooklist = JSON.parse(localStorage.getItem("issuedbooklist")) || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  totalbooks.textContent = booklisted.length;
  availablebooks.textContent = booklisted.reduce(
    (total, book) => total + book.quantity,
    0,
  );
  sissuedbooks.textContent = issuedbooklist.filter(
    (book) => book.returnDate === null,
  ).length;
  overduebooks.textContent = issuedbooklist.filter((book) => {
    const due = new Date(book.duedate);
    due.setHours(0, 0, 0, 0);
    return book.returnDate === null && due < today;
  }).length;

  renderbooks(booklist);
}
updateDashBoard();

//librarymembers
let memberCount = {};
issuedbooklist = JSON.parse(localStorage.getItem("issuedbooklist")) || [];
let activebooks = issuedbooklist.filter((book) => book.returnDate === null);

activebooks.forEach(function (book) {
  if (memberCount[book.memberID]) {
    memberCount[book.memberID] += 1;
  } else {
    memberCount[book.memberID] = 1;
  }
});
console.log(memberCount);

const membersgrid = document.querySelector(".members-grid");

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#searchvalue");

  searchInput.addEventListener("input", function () {
    const value = (searchInput.value.trim() || "").toLowerCase();
    if (value === "") {
      renderbooks(booklist);
      return;
    }

    const filtered = booklist.filter((book) => {
      const title = (book.title || "").toLowerCase();
      const author = (book.author || "").toLowerCase();
      const category = (book.category || "").toLowerCase();
      const isbn = (book.ISBN || "").toString();

      return title.includes(value);
    });
    if (filtered.length === 0) {
      tbody.innerHTML = `
    <tr> 
    <td colspan = "8" style = "text-align:center; padding : 20px;"> 
    No Records Found
    </td>
    </tr>`;
      return;
    }
    renderbooks(filtered);
  });
});
*/
