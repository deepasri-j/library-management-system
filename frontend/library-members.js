const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveMemberBtn = document.getElementById("saveMemberBtn");
const memberNameInput = document.getElementById("memberName");
const memberIdInput = document.getElementById("memberId");
const emailInput = document.getElementById("Email");

const membersList = document.getElementById("membersList");
const membersDetails = document.getElementById("memberDetails");

const openModal = () => {
  modal.classList.add("open");
};

const closeModal = () => {
  modal.classList.remove("open");
};

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

let members = [];
async function getMembers() {
  try {
    const response = await fetch("http://localhost:3000/members");
    const data = await response.json();
    members = data;
    renderMemberList();
    console.log(members);
  } catch (error) {
    console.log(error);
  }
}
getMembers();

function renderMemberList() {
  const memberList = document.querySelector("#membersList");

  members.forEach((member, index) => {
    const memberItem = document.createElement("div");
    memberItem.className = "member-item";
    if (index === 0) {
      memberItem.classList.add("active");
      renderMemberDetails(member);
    }
    memberItem.innerHTML = `<div class = "member-avatar-small"> ${member.member_name.charAt(0).toUpperCase()} </div>
    <div class = "member-name"> ${member.member_name} </div>`;
    memberList.append(memberItem);

    memberItem.addEventListener("click", () => {
      document.querySelectorAll(".member-item").forEach((item) => {
        item.classList.remove("active");
      });
      memberItem.classList.add("active");
      renderMemberDetails(member);
    });
  });
}
function formateDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
async function renderMemberDetails(member) {
  const detailsContainer = document.querySelector("#memberDetails");
  const memberId = member.member_id;
  const response = await fetch(`http://localhost:3000/members/${memberId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch member details");
  }
  const data = await response.json();
  const borrowedBooks = data.borrowed_books;
  let bookRows = "";
  borrowedBooks.forEach((book) => {
    bookRows += `<tr> <td> ${book.title}</td> <td> ${book.isbn}</td> <td> ${formateDate(book.issue_date)}</td> <td> ${formateDate(book.due_date)}</td> <td> ${book.status}</td></tr>`;
  });
  console.log(data);
  detailsContainer.innerHTML = `
<div class="member-profile">

    <div class="member-top">

        <div class="member-avatar">
            ${data.member.member_name.charAt(0).toUpperCase()}
        </div>

        <div class="member-user-details">

            <h2>${data.member.member_name}</h2>

            <div class="member-meta">
                <span>ID: ${data.member.member_id}</span>
                <span>Email: ${data.member.email}</span>
            </div>

        </div>

    </div>

    <table>
        <thead>
            <tr>
                <th>Book Name</th>
                <th>ISBN</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
            </tr>
        </thead>

        <tbody>
            ${
              borrowedBooks.length > 0
                ? bookRows
                : `<tr>
                         <td colspan="5" style="text-align:center;">
                           No books borrowed yet
                         </td>
                       </tr>`
            }
        </tbody>
    </table>

</div>
`;
}

//savememberbtn

saveMemberBtn.addEventListener("click", async function () {
  const memberData = {
    member_id: memberIdInput.value.trim(),
    member_name: memberNameInput.value.trim(),
    email: emailInput.value.trim(),
  };

  const response = await fetch("http://localhost:3000/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });
  const data = await response.json();
  if (response.ok) {
    alert("Member added successfully");
    closeModal();

    ((memberNameInput.value = ""),
      (memberIdInput.value = ""),
      (emailInput.value = ""));
    getMembers();
  } else {
    alert(data.message);
  }
});
