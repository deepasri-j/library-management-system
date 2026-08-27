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
