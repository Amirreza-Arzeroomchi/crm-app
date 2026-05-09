let customers = [];


// ======================================
// LOAD CUSTOMERS
// ======================================

function loadCustomers(){

  fetch("/customers")

    .then(res => res.json())

    .then(data => {

      customers = data;

      renderTable(customers);

    })

    .catch(err => console.log(err));

}


// ======================================
// RENDER TABLE
// ======================================

function renderTable(data){

  const table =
  document.getElementById("customerTable");

  if(!table) return;

  table.innerHTML = "";

  let rows = "";

  data.forEach((c) => {

    rows += `

      <tr>

        <td>${c.firstName || ""}</td>

        <td>${c.lastName || ""}</td>

        <td>${c.email || ""}</td>

        <td>${c.phone || ""}</td>

        <td>${c.city || ""}</td>

        <td>

          <button
            class="action-btn email-btn"
            onclick="viewCustomer(
              '${c.firstName || ""}',
              '${c.lastName || ""}',
              '${c.email || ""}',
              '${c.phone || ""}',
              '${c.address || ""}',
              '${c.city || ""}',
              '${c.description || ""}'
            )"
          >
            View
          </button>

          <button
            class="action-btn delete-btn"
            onclick="deleteCustomer('${c._id}')"
          >
            Delete
          </button>

        </td>

      </tr>

    `;

  });

  table.innerHTML = rows;

}


// ======================================
// DELETE CUSTOMER
// ======================================

function deleteCustomer(id){

  const confirmDelete =
  confirm("Delete this customer?");

  if(!confirmDelete) return;

  fetch("/delete/" + id, {

    method:"DELETE"

  })

  .then(() => {

    loadCustomers();

  })

  .catch(err => console.log(err));

}


// ======================================
// SEARCH
// ======================================

const searchInput =
document.getElementById("search");

if(searchInput){

  searchInput.addEventListener("input", function(){

    const value =
    this.value.toLowerCase();

    const filtered =
    customers.filter(c =>

      (c.firstName || "")
      .toLowerCase()
      .includes(value)

      ||

      (c.lastName || "")
      .toLowerCase()
      .includes(value)

      ||

      (c.email || "")
      .toLowerCase()
      .includes(value)

      ||

      (c.city || "")
      .toLowerCase()
      .includes(value)

    );

    renderTable(filtered);

  });

}


// ======================================
// VIEW CUSTOMER
// ======================================

function viewCustomer(
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  description
){

  document.getElementById("mFirstName").innerText = firstName;

  document.getElementById("mLastName").innerText = lastName;

  document.getElementById("mEmail").innerText = email;

  document.getElementById("mPhone").innerText = phone;

  document.getElementById("mAddress").innerText = address;

  document.getElementById("mCity").innerText = city;

  document.getElementById("mDescription").innerText = description;

  document.getElementById("customerModal")
  .style.display = "flex";

}


// ======================================
// CLOSE MODAL
// ======================================

const closeModal =
document.getElementById("closeModal");

if(closeModal){

  closeModal.onclick = () => {

    document.getElementById("customerModal")
    .style.display = "none";

  };

}


// ======================================
// MINIMIZE MODAL
// ======================================

const minimizeBtn =
document.getElementById("minimizeBtn");

if(minimizeBtn){

  minimizeBtn.onclick = () => {

    document.getElementById("modalBox")
    .classList.toggle("minimized");

  };

}


// ======================================
// DRAGGABLE MODAL
// ======================================

const modalBox =
document.getElementById("modalBox");

const dragHeader =
document.getElementById("dragHeader");

let isDragging = false;

let offsetX = 0;

let offsetY = 0;

if(dragHeader){

  dragHeader.addEventListener(
    "mousedown",
    (e) => {

      isDragging = true;

      offsetX =
      e.clientX -
      modalBox.offsetLeft;

      offsetY =
      e.clientY -
      modalBox.offsetTop;

    }
  );

}


document.addEventListener(
  "mousemove",
  (e) => {

    if(!isDragging) return;

    modalBox.style.left =
    e.clientX - offsetX + "px";

    modalBox.style.top =
    e.clientY - offsetY + "px";

  }
);


document.addEventListener(
  "mouseup",
  () => {

    isDragging = false;

  }
);


// ======================================
// INIT
// ======================================

loadCustomers();